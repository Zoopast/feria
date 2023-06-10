import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';

const auctions = () => {
	const [user, setUser] = useState({});
	const [subastas, setSubastas] = useState([]);
	const router = useRouter();

	const getSubastasActivas = async () => {
		try {
			const token = await AsyncStorage.getItem('authToken');
			if(!token) return;
			await axios.get('https://feriamaipo.herokuapp.com/subastas/activas/', {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
				.then((response) => {
					setSubastas(response.data);
				})
				.catch((error) => {
					console.log(error);
				});
		}
		catch (error) {
			console.log(error);
		}
	};

	const formatDate = (date) => {
		const dateArray = date.split('-');
		const year = dateArray[0];
		const month = dateArray[1];
		const dayArray = dateArray[2].split('T');
		const day = dayArray[0];

		return `${day}/${month}/${year}`;
	}

	const getCurrentUser = async () => {
		try {
			const user = JSON.parse(await AsyncStorage.getItem('@user'));
			if(!user) return;
			setUser(user);
		}
		catch (error) {
			console.log(error);
		}
	}

	useEffect(() => {
		getCurrentUser();
	}, []);

	useEffect(() => {
		getSubastasActivas();
	}, [user]);


	return(
		<View
			style={styles.container}
		>
			<Text
				style={styles.title}
			>
				Subastas activas
				{user?.rol === 'Cliente externo' &&  "Mis requerimientos" }
				{user?.rol === 'Productor' &&  "Requerimientos activos" }
			</Text>
			<View
				style={styles.requirements}
			>
			{subastas.length === 0 && <Text style={styles.text}>No hay subastas activas</Text>}

			{subastas.map((subasta) => (
				<TouchableOpacity
					style={styles.requirement}
					key={subasta.id_subasta}
					onPress={() => router.push(`/subastas/${subasta.id_subasta}`)}
				>
					<View
						style={styles.field}
					>
						<Text
							style={styles.fieldTitle}
						>
							Numero
						</Text>
						<Text
							style={styles.text}
						>
							{subasta.id_subasta}
						</Text>
					</View>
					<View
						style={styles.field}
					>
						<Text
							style={styles.fieldTitle}
						>
							Fecha de inicio
						</Text>
						<Text
							style={styles.text}
						>
							{formatDate(subasta.fecha_inicio)}
						</Text>
					</View>
					<View
						style={styles.field}
					>
						<Text
							style={styles.fieldTitle}
						>
							Fecha termino
						</Text>
						<Text
							style={styles.text}
						>
							{formatDate(subasta.fecha_fin)}
						</Text>
					</View>
					<View
						style={styles.field}
					>
						<Text
							style={styles.fieldTitle}
						>
							Estado
						</Text>
						<Text
							style={styles.text}
						>
							{subasta.estado}
						</Text>
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

export default auctions;