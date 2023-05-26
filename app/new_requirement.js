import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const formatDate = (date) => {
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();
	return `${day}/${month}/${year}`;
}

const newRequirement = () => {
	const [fechaInicio, setFechaInicio] = useState(formatDate(new Date()));
	const [fechaTermino, setFechaTermino] = useState('');
	const [calidad, setCalidad] = useState('');
	const [productos, setProductos] = useState([
		{ nombre: '', cantidad: 1 },
		{ nombre: '', cantidad: 1 }
	]);


	const sendRequirement = async () => {
		try {
			const user = JSON.parse(await AsyncStorage.getItem('@user'));
			console.log(user);
			if(!user) return;
			const requerimiento = {
				id_usuario: user.id_usuario,
				fecha_inicio: fechaInicio,
				fecha_fin: fechaTermino,
				calidad: calidad,
				productos: productos
			}
			console.log(requerimiento);
			await axios.post(
				'https://feriamaipo.herokuapp.com/requerimientos/',
				{
					id_usuario: user.id_usuario,
					fecha_inicio: fechaInicio,
					fecha_fin: fechaTermino,
					calidad: calidad,
					productos: productos
				}
			).then((response) => {
				console.log(response);
				console.log(response.data);
			}
			).catch((error) => {
				console.log(error);
			});
		}
		catch (error) {
			console.log(error);
		}
	}

	return (
		<View
			style={styles.container}
		>
			<Text
				style={styles.title}
			>
				Nuevo requerimiento
			</Text>
			<Text
				style={styles.subtitle}
			>
				Fecha inicio
			</Text>
			<TextInput 
				style={styles.textInput}
				placeholder="Fecha de inicio"
				value={fechaInicio}
				onChangeText={setFechaInicio}
				keyboardType='date'
			/>
			<Text
				style={styles.subtitle}
			>
				Fecha termino
			</Text>
			<TextInput
				style={styles.textInput}
				placeholder="Fecha de termino"
				value={fechaTermino}
				onChangeText={setFechaTermino}
				keyboardType='date'
			/>
			<Text
				style={styles.subtitle}
			>
				Calidad
			</Text>
			<TextInput
				style={styles.textInput}
				placeholder="Calidad"
				value={calidad}
				onChangeText={setCalidad}
			/>
			<Text
				style={styles.title}
			>Productos</Text>
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'space-between',
					gap: 10,
				}}
			>
				<TouchableOpacity
					style={styles.addButton}
					onPress={() => {
						const newProductos = [...productos];
						newProductos.push({ nombre: '', cantidad: 1 });
						setProductos(newProductos);
					}}
				>
					<Text
						style={styles.addButtonText}
					>
						Agregar producto
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.deleteButton}
					onPress={() => {
						const newProductos = [...productos];
						newProductos.pop();
						setProductos(newProductos);
					}}
				>
					<Text
						style={styles.deleteButtonText}
					>
						Eliminar producto
					</Text>
				</TouchableOpacity>
			</View>
			{productos.map((producto, index) => (
				<View
					key={index}
					style={{
						flexDirection: 'row',
						justifyContent: 'space-between',
						gap: 10,
					}}
				>
					<TextInput
						style={styles.textInput}
						placeholder="Nombre"
						value={producto.nombre}
						onChangeText={text => {
							const newProductos = [...productos];
							newProductos[index].nombre = text;
							setProductos(newProductos);
						}}
					/>
					<TextInput
						style={styles.textInput}
						placeholder="Cantidad"
						value={producto.cantidad}
						onChangeText={text => {
							const newProductos = [...productos];
							newProductos[index].cantidad = text;
							setProductos(newProductos);
						}}
					/>
				</View>
			))}
			<TouchableOpacity
				style={styles.submitButton}
				onPress={sendRequirement}
			>
				<Text
					style={styles.submitButtonText}
				>
					Agregar requerimiento
				</Text>
			</TouchableOpacity>
		</View>
	)
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
    backgroundColor: '#1e2124',
    alignItems: 'center',
    justifyContent: 'center',
  },
	title: {
		fontSize : 20,
		fontWeight: 'bold',
		marginBottom: 20,
		color: 'white'
	},
	subtitle: {
		fontSize: 16,
		fontWeight: 'bold',
		marginBottom: 10,
		color: 'white'
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
	addButton: {
		backgroundColor: 'green',
		padding: 10,
		borderRadius: 8,
		marginTop: 10
	},
	addButtonText: {
		color: 'white',
		fontWeight: 'bold'
	},
	deleteButton: {
		backgroundColor: 'red',
		padding: 10,
		borderRadius: 8,
		marginTop: 10
	},
	deleteButtonText: {
		color: 'white',
		fontWeight: 'bold'
	},
	submitButton: {
		backgroundColor: 'blue',
		padding: 10,
		borderRadius: 8,
		marginTop: 10
	},
	submitButtonText: {
		color: 'white',
		fontWeight: 'bold'
	}
});

export default newRequirement;