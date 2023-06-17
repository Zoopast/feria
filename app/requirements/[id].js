import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Requirement = () => {
    const { id } = useLocalSearchParams();
    const [requirement, setRequirement] = useState({});
    const router = useRouter();
    const fields = ['usuario', 'estado', 'fecha_inicio', 'fecha_fin', 'productos'];
    const [ofertas, setOfertas] = useState([]);
    const [user, setUser] = useState({});
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
        return ofertas.filter((oferta) => oferta.precio !== "0");
      }

      const createOferta = async () => {
        try {
          const validOfertas = filterOfertasWithNonValidValues();

          await axios.post(
            'https://feriamaipo.herokuapp.com/requerimientos/productos/oferta/',
            validOfertas
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
                                (field === 'estado') ? requirement[field] :
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
                    {requirement.estado === 'activo' &&	(
                    <View>
                        <Text
                            style={styles.title}
                        >
                            Ofertar
                        </Text>
                        {requirement.productos?.map((product, idx) => (
                            <View key={idx} style={styles.field}>
                                <Text style={styles.fieldTitle}>Nombre: {product.nombre}</Text>
                                <Text style={styles.fieldTitle}>Cantidad total: {product.cantidad}</Text>
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
                        ))}
                        <TouchableOpacity
                            onPress={createOferta}
                            style={styles.field}
                        >
                            <Text
                                style={styles.fieldTitle}
                            >Ofertar</Text>
                        </TouchableOpacity>
                    </View>)}
                </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
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
    }
});

export default Requirement;
