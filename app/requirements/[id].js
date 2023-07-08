import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

const OFERTA_API_URL = 'https://feriamaipo.herokuapp.com/requerimientos/productos/oferta/'

const Requirement = () => {
    const { id } = useLocalSearchParams();
    const [requirement, setRequirement] = useState({});
    const [isOfferValid, setIsOfferValid] = useState(false);
    const router = useRouter();
    const fields = ['usuario', 'estado', 'fecha_inicio', 'fecha_fin', 'productos', 'direccion'];
    const [ofertas, setOfertas] = useState([]);
    const [user, setUser] = useState({});
    const [direccion, setDireccion] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingInfo, setLoadingInfo] = useState(false);

    const allOffersAreValid = () => {
        if(ofertas.length < 1) return false;

        let valid = true;

        ofertas.forEach(oferta => {
            if(oferta.cantidad < 0 || oferta.precio <= 0) valid = false;
        })

        return valid;
    }

    useEffect(() => {
        getUser();
        getRequirement();
    }, []);

    useEffect(() => {
        fillProductsOfertas();
    }, [requirement]);

    useEffect(() => {
        setIsOfferValid(allOffersAreValid() && direccion.length > 0);
    }, [ofertas, direccion]);

    const getUser = async () => {
        const user = JSON.parse(await AsyncStorage.getItem('@user'));
        if(!user) return;

        setUser(user);
    }

    const getRequirement = async () => {
        try{
            setLoadingInfo(true);
            const response = await axios.get(`https://feriamaipo.herokuapp.com/requerimientos/${id}`);
            setRequirement(response.data);
            setLoadingInfo(false);
        }catch(error) {
            console.log(error);
        }
    };

    const finalize = async () => {
        try{
            const response = await axios.put(`https://feriamaipo.herokuapp.com/requerimientos/${id}/finalizar/`);
            if(response.status === 200) {
                router.push('/requirements/mine');
            }
        }catch(error) {
            console.log(error);
        }
    }

    const fillProductsOfertas = () => {
        const productsOfertas = [];
        requirement.productos?.map((product) => {
            productsOfertas.push({
                id_requerimiento: requirement.id_requerimiento,
                id_producto_requerimiento: product.id_producto,
                id_productor: user.id_usuario,
                cantidad: product.cantidad,
                precio: "0",
            });
        });
        setOfertas(productsOfertas);
        console.log(productsOfertas)
        return productsOfertas;
    }

    const validateNumber = (text, maxQty = 0) => {
        // Remove leading zeros
        const numericText = text.replace(/^0+(0$|[^0])/, '$1');
        // Ensure quantity is greater than 1
        const quantity = parseInt(numericText, 10);
        if(maxQty === 0){
            const validQuantity = isNaN(quantity) || quantity < 1 ? 1 : quantity;
            return validQuantity;
        }
        const validQuantity = isNaN(quantity) || quantity < 1 ? 1 : Math.min(quantity, maxQty);
        return validQuantity;
    }

    const formatNumber = (number) =>
    {
        if(number === undefined) return number;
        //format string to int

        if(number < 1000) return number;

        // add . every 3 digits
        number = number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

        return number + " unidades";
    }

    const filterOfertasWithNonValidValues = () => {
        return ofertas.filter((oferta) => oferta.precio !== "0" && oferta.cantidad !== "0");
      }

      const createOferta = async () => {
        try {
          setLoading(true);
          const validOfertas = filterOfertasWithNonValidValues();
          console.log(validOfertas);
          const productsOfertas = {
            direccion: direccion,
            ofertas: validOfertas,
          }
          await axios.post(
            OFERTA_API_URL,
            productsOfertas
          ).then((response) => {
            if(response.status === 200) {
                router.push('/requirements');
            }
          });
        } catch (e) {
          console.log(e);
        } finally {
            setLoading(false);
        }
      }

    const formatDate = (date) => {
        const dateArray = date?.split('-');
        if(!dateArray) return '';
        const year = dateArray[0];
        const month = dateArray[1];
        const dayArray = dateArray[2].split('T');
        const day = dayArray[0];

        return `${day}/${month}/${year}`;
    }

    const printPDF = async () => {
        try {
            const html = `
            <h1>Requerimiento ${id}</h1>
            <h2>Usuario: ${requirement.usuario?.nombre_usuario} ${requirement.usuario?.apellidos_usuario}</h2>
            <h2>Estado: ${requirement.estado}</h2>
            <h2>Fecha de inicio: ${formatDate(requirement.fecha_inicio)}</h2>
            <h2>Fecha de fin: ${formatDate(requirement.fecha_fin)}</h2>
            <h2>Dirección: ${requirement.direccion}</h2>
            <h2>Productos:</h2>
            <ul>
                ${requirement.productos?.map((product) => (
                    `<li>
                        <h3>Nombre: ${product.nombre}</h3>
                        <h3>Cantidad: ${product.cantidad}</h3>
                        <h3>Calidad: ${product.calidad}</h3>
                    </li>`
                ))}
            </ul>
            `;
            const { uri } = await Print.printToFileAsync({ html });
            await Sharing.shareAsync(uri);
        }catch (e) {
            console.error(e);
        }
    }

    return(
        <View style={styles.container}>
            <Text style={styles.title}>Requerimiento {id}</Text>
            {
                loadingInfo ?
                <ActivityIndicator color="green" size="large" /> :
                (
                    <View>
                        <ScrollView>
                    {fields.map((field) => (
                        <View key={field} style={styles.field}>
                            <Text style={styles.fieldTitle}>{field}</Text>
                            <Text style={styles.text}>
                                {
                                    (field === 'fecha_inicio' || field === 'fecha_fin') ? formatDate(requirement[field]) :
                                    (field === 'usuario') ? requirement[field]?.nombre_usuario + ' ' + requirement[field]?.apellidos_usuario :
                                    (field === 'estado' || field === 'direccion') ? requirement[field] :
                                    (field === 'productos') ? requirement[field]?.map((product, idx) => (
                                        <View style={styles.product} key={idx}>
                                            <Text >
                                                <Text style={styles.productFieldTitle}>Nombre:</Text> <Text style={styles.productField}>{product.nombre}</Text>
                                            </Text>
                                            <Text >
                                                <Text style={styles.productFieldTitle}>Cantidad:</Text> <Text style={styles.productField}>{formatNumber(product.cantidad)}</Text>
                                            </Text>
                                            <Text >
                                                <Text style={styles.productFieldTitle}>Calidad:</Text> <Text style={styles.productField}>{product.calidad}</Text>
                                            </Text>
                                        </View>
                                    )) : null
                                }
                            </Text>
                        </View>
                    ))}
                </ScrollView>
                    <ScrollView>
                        {requirement.estado === 'activo' && user.rol !== "Cliente externo" && (
                        <View>
                            <Text
                                style={styles.title}
                            >
                                Ofertar
                            </Text>
                            <View
                                style={{
                                    marginTop: 10
                                }}
                            >
                                <Text style={styles.fieldTitle}>Dirección de recogida</Text>
                                <TextInput
                                    value={direccion}
                                    style={[{color: "white"},styles.field]}
                                    placeholder="Dirección de recogida"
                                    placeholderTextColor={'#BDBDBD'}
                                    onChangeText={text => setDireccion(text)}
                                />
                            </View>
                            {requirement.productos?.map((product, idx) => (
                                <View key={idx} style={styles.field}>
                                    <Text style={styles.titleTwo}>Nombre</Text>
                                    <Text style={styles.fieldTitle}>{product.nombre} </Text>
                                    <Text style={styles.titleTwo}> Cantidad total </Text>
                                    <Text style={styles.fieldTitle}> {product.cantidad} </Text>

                                    <View
                                        style={{
                                            marginTop: 10
                                        }}
                                    >
                                        <Text style={styles.fieldTitle}> Cantidad a ofertar </Text>
                                        <TextInput
                                            value={ofertas[idx]?.cantidad.toString()}
                                            style={[{color: "white"},styles.field]}
                                            placeholder="Cantidad a ofertar"
                                            keyboardType="numeric"
                                            placeholderTextColor={'#BDBDBD'}
                                            onChangeText={text => {
                                                const validNumber = validateNumber(text, product.cantidad);
                                                const newOfertas = [...ofertas];
                                                newOfertas[idx].cantidad = validNumber;
                                                setOfertas(newOfertas);
                                            }}
                                        />
                                    </View>
                                    <View
                                        style={{
                                            marginTop: 10
                                        }}
                                    >
                                        <Text style={styles.fieldTitle}>Precio</Text>
                                        <TextInput
                                            value={ofertas[idx]?.precio.toString()}
                                            style={[{color: "white"},styles.field]}
                                            placeholder="Precio"
                                            keyboardType="numeric"
                                            placeholderTextColor={'#BDBDBD'}
                                            onChangeText={text => {
                                                const validNumber = validateNumber(text);
                                                const newOfertas = [...ofertas];
                                                newOfertas[idx].precio = validNumber;
                                                setOfertas(newOfertas);
                                            }}
                                        />
                                    </View>
                                </View>
                            ))}
                            <TouchableOpacity
                                onPress={createOferta}
                                style={[styles.offerButton, {
                                    borderColor: !isOfferValid ? '#BDBDBD' : 'green',
                                }]}
                                disabled={!isOfferValid}
                            >
                                { !loading ?
                                    <Text
                                        style={styles.offerButtonText}
                                    >
                                        Ofertar
                                    </Text> :
                                    <ActivityIndicator size="small" color="#00ff00" />
                                }
                            </TouchableOpacity>
                        </View>)}
                    </ScrollView>
                    {
                        requirement.estado === "entregado" &&
                        <View>
                            <Text style={styles.receivedTitle}>Confirmar entrega</Text>
                            <TouchableOpacity style={styles.receivedButton} onPress={finalize}>
                                <Text style={styles.receivedButtonText}>Recibí mis productos</Text>
                            </TouchableOpacity>
                        </View>
                    }
                    {
                        requirement.estado === "finalizado" &&
                        <View>
                            <Text style={styles.receivedTitle}>Imprimir como PDF</Text>
                            <TouchableOpacity style={styles.receivedButton} onPress={printPDF}>
                                <Text style={styles.receivedButtonText}>Imprimir</Text>
                            </TouchableOpacity>
                        </View>
                    }
                    </View>
                )
            }
        </View>
    )
}

const styles = StyleSheet.create({
    productFieldTitle: {
        fontWeight: 'bold',
    },
    productField: {
        fontWeight: 'normal',
        color: '#DCDCDC',
    },
    product: {
        flex: 1,
        flexDirection: 'column',
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10,
        marginBottom: 10,
    },
    receivedTitle: {
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 10,
    },
    receivedButton: {
		backgroundColor: '#282b30',
		padding: 10,
		marginTop: 10,
		marginBottom: 10,
		borderWidth: 1,
		borderColor: 'green',
	},
    receivedButtonText: {
		color: 'white',
		fontSize: 15,
		textAlign: 'center'
	},
    container: {
        flex: 1,
        backgroundColor: '#1e2124',
        color: 'white',
        padding: 10,
    },
    title: {
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold',
    },
    titleTwo: {
        fontSize: 15,
        color: 'white',
        fontWeight: 'bold',
    },
    field: {
        backgroundColor: '#282b30',
        padding: 10,
        marginBottom: 10,
        borderRadius: 10,
    },
    fieldTitle: {
        fontSize: 15,
        color: '#BDBDBD',
    },
    text: {
        color: 'white'
    },
    offerButton: {
        backgroundColor: '#282b30',
        padding: 10,
        marginTop: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: 'green',
    },
    offerButtonText: {
        color: 'white',
        fontSize: 15,
        textAlign: 'center'
    },
});

export default Requirement;
