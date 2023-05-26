import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useRouter, useLocalSearchParams } from "expo-router";

const requirement = () => {
	const { id } = useLocalSearchParams();
	const [requirement, setRequirement] = useState({});
	const router = useRouter();
	const fields = ['usuario', 'estado', 'fecha_inicio', 'fecha_fin', 'calidad', 'productos']

	const getRequirement = async () => {
		try{
			await axios.get(`https://feriamaipo.herokuapp.com/requerimientos/${id}`).then(
				(response) => {
					console.log(response);
					console.log(response.data);
					setRequirement(response.data);
				}
			).catch((error) => {
				console.log(error);
			});
		}catch(error){
			console.log(error);
		}
	};

	const formatDate = (date) => {
		const dateArray = date?.split('-');
		if(!dateArray) return '';
		const year = dateArray[0];
		const month = dateArray[1];
		const dayArray = dateArray[2].split('T');
		const day = dayArray[0];
	
		return `${day}/${month}/${year}`;
	}

	useEffect(() => {
		getRequirement();
	}, []);


	return(
		<View
			style={styles.container}
		>
			<Text
				style={styles.title}
			>
				Requerimiento {id}
			</Text>
			<View>
				<View>
						
					{fields.map((field) => (
						<View
							style={styles.requirement}
							key={field}
						>
							<View
								style={styles.field}
							>
								<Text
									style={styles.fieldTitle}
								>
									{field}
								</Text>
								<Text
									style={styles.text}
								>
									
									{ (field === 'fecha_inicio' || field === 'fecha_fin') && formatDate(requirement[field]) }
									{ (field === 'usuario') && requirement[field]?.nombre_usuario + ' ' + requirement[field]?.apellidos_usuario }
									{ (field === 'estado' || field === 'calidad') && requirement[field] }
									{ (field === 'productos') && requirement[field]?.map((product, idx) => (
										<View
											key={idx}
											style={{
												flexDirection: 'column',
												justifyContent: 'space-between',
												alignItems: 'center',
												gap: 10,
											}}
										>
											<View
												style={{
													flexDirection: 'row',
													justifyContent: 'space-between',
													alignItems: 'center',
													gap: 10,
												}}
											>
												<View
													style={styles.product}
												>
													<Text
														style={styles.text}
													>
														Nombre
													</Text>
													<Text
														style={styles.text}
													>
														{product.nombre}
													</Text>
												</View>
												<View>
													<Text>
														Cantidad
													</Text>
													<Text
														style={styles.text}
														key={idx}
													>
														{product.cantidad}
													</Text>
												</View>
											</View>
										</View>
									))}
								</Text>
							</View>
						</View>
						))
					}
				</View>
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

export default requirement;