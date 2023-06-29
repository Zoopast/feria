import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';


const venta_local = () => {
	const { id } = useLocalSearchParams();
	const [ventaLocalInfo, setVentaLocalInfo] = useState({});

	const get_venta_local_info = async () => {
		await axios.get(`https://feriamaipo.herokuapp.com/ventas-locales/${id}`).then((response) => {
			setVentaLocalInfo(response.data);
			console.log(response.data);
		}).catch((error) => {
			console.log(error);
			});
	}

	useEffect(() => {
		get_venta_local_info()
	}, []);

	return (
		<View
			style={styles.container}
		>
			<Text
				style={styles.title}
			>Venta local número { id }</Text>
		</View>
	)
}

const styles = StyleSheet.create({

	pickedButton: {
		backgroundColor: '#282b30',
		padding: 10,
		marginTop: 10,
		marginBottom: 10,
		borderWidth: 1,
		borderColor: 'green',
	},

	pickedButtonText: {
		color: 'white',
		fontSize: 15,
		textAlign: 'center'
	},

	deliveredButton: {
		backgroundColor: '#282b30',
		padding: 10,
		marginTop: 10,
		marginBottom: 10,
		borderWidth: 1,
		borderColor: 'green',
	},
	deliveredButtonText: {
		color: 'white',
		fontSize: 15,
		textAlign: 'center'

	},

	textInput: {
		height: 40,
		borderColor: 'gray',
		borderWidth: 1,
		marginTop: 8,
		padding: 10,
		borderRadius: 8,
		color: 'white'
	},
		ofertarButton: {
			backgroundColor: '#282b30',
			padding: 10,
			marginTop: 10,
			marginBottom: 10,
			borderWidth: 1,
			borderColor: 'green',
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
				textAlign: 'center'
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
		ofertarButtonText: {
			color: 'white',
			fontSize: 15,
			textAlign: 'center'
		}
});

export default venta_local;