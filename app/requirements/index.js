import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useRouter } from "expo-router";

const requirements = () => {
	
	const [requirements, setRequirements] = useState([]);
	const router = useRouter();


	const getRequirements = async () => {
		try {
			await axios.get('https://feriamaipo.herokuapp.com/requerimientos/')
				.then((response) => {
					console.log(response);
					console.log(response.data);
					setRequirements(response.data);
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

	useEffect(() => {
		getRequirements();
	}, []);


	return(
		<View
			style={styles.container}
		>
			<Text
				style={styles.title}
			>
				Mis requerimientos
			</Text>
			<View
				style={styles.requirements}
			>
			{requirements.map((requirement) => (
				<TouchableOpacity
					style={styles.requirement}
					key={requirement.id_requerimiento}
					onPress={() => router.push(`/requirements/${requirement.id_requerimiento}`)}
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
							{requirement.id_requerimiento}
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
							{formatDate(requirement.fecha_inicio)}
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
							{formatDate(requirement.fecha_fin)}
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
							{requirement.estado}
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

export default requirements;