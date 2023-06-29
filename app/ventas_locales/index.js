import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';

const ventas_locales = () => {
	const [ventas_locales, setVentasLocales] = useState([]);
	const router = useRouter();

	useEffect(() => {
		getVentasLocales();
	}, []);


	const formatDate = (date) => {
		const dateArray = date.split('-');
		const year = dateArray[0];
		const month = dateArray[1];
		const dayArray = dateArray[2].split('T');
		const day = dayArray[0];

		return `${day}/${month}/${year}`;
	}

	const getVentasLocales = async () => {
		try {
			const token = await AsyncStorage.getItem('authToken');
			if(!token) return;
			await axios.get('https://feriamaipo.herokuapp.com/ventas-locales/activos/', {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}).then((response) => {
				console.log(response.data);
				setVentasLocales(response.data);
			}).catch((error) => {
				console.log(error);
			});
		}
		catch (error) {
			console.log(error);
		}
	}

		return (
			<View style={styles.container}>
				<Text style={styles.title}>Ventas Locales</Text>
				<View
					style={styles.requirements}
				>
					{ventas_locales.length === 0 && <Text style={styles.text}>No hay ventas activas</Text>}
					{ventas_locales.map((venta_local) => (
						<TouchableOpacity
							key={venta_local.id_venta_local}
							style={styles.requirement}
							onPress={() => router.push(`/ventas_locales/${venta_local.id_venta_local}`)}
						>
							<View style={styles.field}>
								<Text style={styles.fieldTitle}>Nombre: </Text>
								<Text style={styles.text}>{venta_local.nombre}</Text>
							</View>
							<View style={styles.field}>
								<Text style={styles.fieldTitle}>Fecha de Inicio: </Text>
								<Text style={styles.text}>{formatDate(venta_local.fecha_inicio)}</Text>
							</View>
							<View style={styles.field}>
								<Text style={styles.fieldTitle}>Fecha de Termino: </Text>
								<Text style={styles.text}>{formatDate(venta_local.fecha_fin)}</Text>
							</View>
							<View style={styles.field}>
								<Text style={styles.fieldTitle}>Calidad: </Text>
								<Text style={styles.text}>{venta_local.calidad}</Text>
							</View>
							<View style={styles.field}>
								<Text style={styles.fieldTitle}>Precio: </Text>
								<Text style={styles.text}>{venta_local.precio}</Text>
							</View>
							<Text
								style={styles.text}
							>
								Ver
							</Text>
						</TouchableOpacity>
						))}
				</View>
			</View>
		);
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
	requirements: {
		flex: 1,
		backgroundColor: '#1e2124',
		padding: 10,
		gap: 10,
	},
	requirement: {
		flex: 1,
		color: 'white',
		flexDirection: 'row',
		backgroundColor: '#282b30',
		padding: 10,
		gap: 10,
		borderRadius: 10,
		maxHeight: 120,
	},
	field: {
		flex: 1,
		color: 'white',
		flexDirection: 'column'
	},
	fieldTitle: {
		fontSize: 15,
		color: '#BDBDBD',
	},
	text: {
		color: 'white',
	}
});

export default ventas_locales;