import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';


const Requirement = () => {
    const { id } = useLocalSearchParams();
    const [requirement, setRequirement] = useState({});
    const router = useRouter();
    const fields = ['usuario', 'estado', 'fecha_inicio', 'fecha_fin', 'productos', 'direccion'];
    const [ofertas, setOfertas] = useState([]);
    const [user, setUser] = useState({});
    const [direccion, setDireccion] = useState('')
    useEffect(() => {
        getUser();
        getRequirement();
    }, []);

    useEffect(() => {
        fillProductsOfertas();
    }, [requirement]);

    const getUser = async () => {
        const user = JSON.parse(await AsyncStorage.getItem('@user'));
        if(!user) return;

        setUser(user);
    }

    const getRequirement = async () => {
        try{
            const response = await axios.get(`https://feriamaipo.herokuapp.com/requerimientos/${id}`);
            setRequirement(response.data);
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

    const filterOfertasWithNonValidValues = () => {
        return ofertas.filter((oferta) => oferta.precio !== "0" && oferta.cantidad !== "0");
      }

      const createOferta = async () => {
        try {
          const validOfertas = filterOfertasWithNonValidValues();
          console.log(validOfertas);
          const productsOfertas = {
            direccion: direccion,
            ofertas: validOfertas,
          }
          await axios.post(
            'https://feriamaipo.herokuapp.com/requerimientos/productos/oferta/',
            productsOfertas
          ).then((response) => {
            if(response.status === 200) {
                router.push('/requirements');
            }
          });
        } catch (e) {
          console.log(e);
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
    }

    return(
        <View style={styles.container}>
            <Text style={styles.title}>Requerimiento {id}</Text>
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
                                    <View key={idx}>
                                        <Text style={styles.text}>Nombre: {product.nombre}</Text>
                                        <Text style={styles.text}>Cantidad: {product.cantidad}</Text>
                                        <Text style={styles.text}>Calidad: {product.calidad}</Text>
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
                                        placeholderTextColor={'#BDBDBD'}
                                        onChangeText={text => {
                                            const newOfertas = [...ofertas];
                                            newOfertas[idx].cantidad = text;
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
                                        placeholderTextColor={'#BDBDBD'}
                                        onChangeText={text => {
                                            const newOfertas = [...ofertas];
                                            newOfertas[idx].precio = text;
                                            setOfertas(newOfertas);
                                        }}
                                    />
                                </View>
                            </View>
                        ))}
                        <TouchableOpacity
                            onPress={createOferta}
                            style={[styles.offerButton, {
                                borderColor: direccion.length === 0 ? '#BDBDBD' : 'green',
                            }]}
                            disabled={direccion.length === 0}
                        >
                            <Text
                                style={styles.offerButtonText}
                            >
                                Ofertar
                            </Text>
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

const styles = StyleSheet.create({
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
        color: 'white',
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
