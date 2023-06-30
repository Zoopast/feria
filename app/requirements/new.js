import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform, ScrollView } from 'react-native';
import {Picker} from '@react-native-picker/picker';
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
  const [direccion, setDireccion] = useState('');
  const [showInicio, setShowInicio] = useState(false);
  const [showTermino, setShowTermino] = useState(false);
	const [productos, setProductos] = useState([
		{ nombre: '', cantidad: 1, calidad: '' },
	]);
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

	const router = useRouter();

  const onChangeInicio = (event, selectedDate) => {
    const currentDate = selectedDate || fechaInicio;
    setShowInicio(Platform.OS === 'ios');
    setFechaInicio(currentDate);

    if(currentDate && currentDate > fechaTermino) {
      setFechaTermino(currentDate);
    }
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
          direccion: direccion,
					productos: productos
				}
			).then((response) => {
				if(response.status === 200) {
					router.push('/requirements/mine')
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
          minimumDate={new Date()}
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
          minimumDate={fechaInicio}
          mode='date'
          is24Hour={true}
          display="default"
          onChange={onChangeTermino}
        />
      )}
      <Text style={styles.subtitle}>Dirección de envio</Text>
      <TextInput style={styles.textInput} placeholder="Dirección de envio" value={direccion} onChangeText={setDireccion} />
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
            newProductos.push({ nombre: '', cantidad: 1, calidad: '' });
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
          <View
            style={{
              position: 'relative',

            }}
          >
            <Text style={styles.subtitle}>Producto {index + 1}</Text>
            <Text style={styles.subtitle}> { producto.nombre } </Text>
            <View>
              <Picker
                selectedValue={producto.nombre}
                onValueChange={(itemValue, itemIndex) =>{
                  const newProductos = [...productos];
                  newProductos[index].nombre = itemValue;
                  setProductos(newProductos);
                }}>
                <Picker.Item label="Manzana" value="Manzana" />
                <Picker.Item label="Plátano" value="Plátano" />
                <Picker.Item label="Naranja" value="Naranja" />
                <Picker.Item label="Fresa" value="Fresa" />
                <Picker.Item label="Sandía" value="Sandía" />
                <Picker.Item label="Uva" value="Uva" />
                <Picker.Item label="Pera" value="Pera" />
                <Picker.Item label="Piña" value="Piña" />
                <Picker.Item label="Melón" value="Melón" />
                <Picker.Item label="Mango" value="Mango" />
                <Picker.Item label="Papaya" value="Papaya" />
                <Picker.Item label="Kiwi" value="Kiwi" />
                <Picker.Item label="Cereza" value="Cereza" />
                <Picker.Item label="Limón" value="Limón" />
                <Picker.Item label="Mandarina" value="Mandarina" />
                <Picker.Item label="Pepino" value="Pepino" />
                <Picker.Item label="Zanahoria" value="Zanahoria" />
                <Picker.Item label="Lechuga" value="Lechuga" />
                <Picker.Item label="Espinaca" value="Espinaca" />
                <Picker.Item label="Calabacín" value="Calabacín" />
              </Picker>
          </View>
          </View>
          <View>
            <Text style={styles.subtitle}>Cantidad</Text>
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
          <View
            style={{
              position: 'relative',

            }}
          >
            <Text style={styles.title}>Calidad</Text>
            <Text style={styles.subtitle}> { producto.calidad } </Text>
            <Picker
              selectedValue={producto.calidad}
              onValueChange={(itemValue, itemIndex) =>{
                const newProductos = [...productos];
                newProductos[index].calidad = itemValue;
                setProductos(newProductos);
              }}>
              <Picker.Item label="Fresca" value="Fresca" />
              <Picker.Item label="Madura" value="Madura" />
              <Picker.Item label="Dulce" value="Dulce" />
              <Picker.Item label="Sabrosa" value="Sabrosa" />
              <Picker.Item label="Jugosa" value="Jugosa" />
            </Picker>
          </View>
        </View>
      ))}
    </ScrollView>
			<TouchableOpacity
				style={[styles.submitButton, {
          backgroundColor: direccion.length < 1 ? 'gray' : 'green'
        }]}
				onPress={sendRequirement}
        disabled={direccion.length < 1}
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