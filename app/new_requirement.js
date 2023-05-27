import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";

const formatDate = (date) => {
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();
	return `${day}/${month}/${year}`;
}

const newRequirement = () => {
  const [fechaInicio, setFechaInicio] = useState(new Date());
  const [fechaTermino, setFechaTermino] = useState(new Date());
  const [showInicio, setShowInicio] = useState(false);
  const [showTermino, setShowTermino] = useState(false);
	const [calidad, setCalidad] = useState('');
	const [productos, setProductos] = useState([
		{ nombre: '', cantidad: 1 },
	]);
  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

	const router = useRouter();

  const onChangeInicio = (event, selectedDate) => {
    const currentDate = selectedDate || fechaInicio;
    setShowInicio(Platform.OS === 'ios');
    setFechaInicio(currentDate);
  };

  const showDatepickerInicio = () => {
    setShowInicio(true);
  };

  const onChangeTermino = (event, selectedDate) => {
    const currentDate = selectedDate || fechaTermino;
    setShowTermino(Platform.OS === 'ios');
    setFechaTermino(currentDate);
  };

  const showDatepickerTermino = () => {
    setShowTermino(true);
  };


  const showMode = (currentMode) => {
    if (Platform.OS === 'android') {
      setShow(true);
    }
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };


	const sendRequirement = async () => {
		try {
			const user = JSON.parse(await AsyncStorage.getItem('@user'));
			if(!user) return;

			await axios.post(
				'https://feriamaipo.herokuapp.com/requerimientos/',
				{
					id_usuario: user.id_usuario,
					fecha_inicio: formatDate(fechaInicio),
					fecha_fin: formatDate(fechaTermino),
					calidad: calidad,
					productos: productos
				}
			).then((response) => {
				if(response.status === 200) {
					router.push('/requirements')
				}
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
			<Text style={styles.subtitle}>Fecha inicio</Text>
      <TextInput style={styles.textInput} placeholder="Fecha de inicio" value={formatDate(fechaInicio)} />
      <TouchableOpacity onPress={showDatepickerInicio}>
        <Text style={styles.subtitle}>Seleccionar fecha</Text>
      </TouchableOpacity>
      {showInicio && (
        <DateTimePicker
          testID="dateTimePicker"
          value={fechaInicio}
          mode='date'
          is24Hour={true}
          display="default"
          onChange={onChangeInicio}
        />
      )}

      <Text style={styles.subtitle}>Fecha termino</Text>
      <TextInput placeholderTextColor="white" style={styles.textInput} placeholder="Fecha de termino" value={formatDate(fechaTermino)} />
      <TouchableOpacity onPress={showDatepickerTermino}>
        <Text style={styles.subtitle}>Seleccionar fecha</Text>
      </TouchableOpacity>
      {showTermino && (
        <DateTimePicker
          testID="dateTimePicker"
          value={fechaTermino}
          mode='date'
          is24Hour={true}
          display="default"
          onChange={onChangeTermino}
        />
      )}
			<Text
				style={styles.subtitle}
			>
				Calidad
			</Text>
			<TextInput
				style={styles.textInput}
				placeholder="Calidad"
				placeholderTextColor="white"
				value={calidad}
				onChangeText={setCalidad}
			/>
			<Text
				style={styles.title}
			>Productos</Text>
			   <ScrollView>
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
          <Text style={styles.addButtonText}>Agregar producto</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => {
            const newProductos = [...productos];
            newProductos.pop();
            setProductos(newProductos);
          }}
        >
          <Text style={styles.deleteButtonText}>Eliminar producto</Text>
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
						placeholderTextColor="white"
            onChangeText={text => {
              const newProductos = [...productos];
              newProductos[index].nombre = text;
              setProductos(newProductos);
            }}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Cantidad"
            value={producto.cantidad.toString()}
            onChangeText={text => {
              const newProductos = [...productos];
              newProductos[index].cantidad = text;
              setProductos(newProductos);
            }}
          />
        </View>
      ))}
    </ScrollView>
			<TouchableOpacity
				style={styles.submitButton}
				onPress={sendRequirement}
			>
				<Text
					style={styles.submitButtonText}
				>
					Hacer requerimiento
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