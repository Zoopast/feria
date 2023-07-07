import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform, ScrollView } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";

const calidad_items = [
  { name: 'Fresca', value:'Fresca' },
  { name: 'Madura', value:'Madura' },
  { name: 'Dulce', value:'Dulce' },
  { name: 'Sabrosa', value:'Sabrosa'},
  { name: 'Jugosa', value:'Jugosa'}
]

const productos_items = [
  { name: 'Manzana', value: 'Manzana' },
  { name: 'Plátano', value: 'Plátano' },
  { name: 'Naranja', value: 'Naranja' },
  { name: 'Piña', value: 'Piña' },
  { name: 'Fresa', value: 'Fresa' },
  { name: 'Uva', value: 'Uva' },
  { name: 'Mango', value: 'Mango' },
  { name: 'Sandía', value: 'Sandía' },
  { name: 'Cereza', value: 'Cereza' },
  { name: 'Pera', value: 'Pera' },
  { name: 'Melón', value: 'Melón' },
  { name: 'Mandarina', value: 'Mandarina' },
  { name: 'Coco', value: 'Coco' },
  { name: 'Papaya', value: 'Papaya' },
  { name: 'Limón', value: 'Limón' },
  { name: 'Fruta de la pasión', value: 'Fruta de la pasión' },
  { name: 'Granada', value: 'Granada' },
  { name: 'Kiwi', value: 'Kiwi' },
  { name: 'Ciruela', value: 'Ciruela' },
  { name: 'Guayaba', value: 'Guayaba' }
  ];

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
  const [validProducts, setValidProducts] = useState(allProductosValid);
	const [productos, setProductos] = useState([
		{ nombre: productos_items[0].value, cantidad: 0, calidad: calidad_items[0].value },
	]);
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);


	const router = useRouter();

  const onChangeInicio = (event, selectedDate) => {
    const currentDate = selectedDate || fechaInicio;
    setShowInicio(Platform.OS === 'ios');
    setFechaInicio(currentDate);

    if(currentDate && currentDate > fechaTermino) {
      setFechaTermino(currentDate);
    }
  };

  const allProductosValid = () => {
    if (productos.length < 1) return false;

    let valid = true;

    productos.forEach((producto) => {
      if (producto.nombre.length <= 0 || producto.cantidad < 1 || producto.calidad.length <= 0) {
        valid = false;
      }
    });

    return valid;
  };

  useEffect(() => {
    console.log(allProductosValid() && direccion.length > 0)
    setIsButtonEnabled(allProductosValid() && direccion.length > 0);
  }, [productos, direccion]);

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
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          width: '100%',
          marginTop: 20
        }}
      >
        <Text style={styles.subtitle}>Dirección de envio</Text>
        <TextInput
          style={[styles.textInput, {
            width: '75%',
          }]}
          placeholder="Dirección de envio"
          placeholderTextColor={"gray"}
          value={direccion}
          onChangeText={setDireccion}
        />
      </View>
      <View
        style={{
          marginTop: 40,
        }}
      >
        <Text
          style={styles.title}
        >
          Productos
        </Text>
      </View>
			<ScrollView>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 10,
            marginBottom: 10,
          }}
        >
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              const newProductos = [...productos];
              newProductos.push({ nombre: productos_items[0].value, cantidad: 0, calidad: calidad_items[0].value });
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
            margin: 10,
          }}
        >
          <View
            style={{
              position: 'relative',

            }}
          >
            <Text style={[styles.subtitle, { textAlign: 'center' }]}>Producto {index + 1}
            </Text>
            <Picker
              style={{ height: 50, width: 150, color: "white", textAlign: 'center' }}
              itemStyle={{ color: 'white', backgroundColor: 'transparent' }}
              dropdownIconColor={"white"}
              selectedValue={productos[index].nombre}
              onValueChange={(itemValue, itemIndex) =>{
                const newProductos = [...productos];
                newProductos[index].nombre = itemValue;
                setProductos(newProductos);
              }}>
                {productos_items.map((item, idx) => {
                  return (
                    <Picker.Item key={idx} label={item.name} value={item.value} />
                  );
                })}
            </Picker>
          </View>
          <View>
            <Text style={[styles.subtitle, { textAlign: 'center' }]}>Cantidad</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Cantidad"
              value={producto.cantidad.toString()}
              onChangeText={text => {
                // Remove leading zeros
                const numericText = text.replace(/^0+(0$|[^0])/, '$1');
                // Ensure quantity is greater than 1
                const quantity = parseInt(numericText, 10);
                const validQuantity = isNaN(quantity) || quantity < 1 ? 1 : quantity;
                const newProductos = [...productos];
                newProductos[index].cantidad = validQuantity;
                setProductos(newProductos);
              }}
              keyboardType="numeric"
            />
          </View>
          <View
            style={{
              position: 'relative',

            }}
          >
            <Text style={[styles.subtitle, { textAlign: 'center' }]}>Calidad</Text>
            <Picker
              style={{
                height: 50,
                width: 150,
                color: "white"
              }}
              dropdownIconColor={"white"}
              selectedValue={productos[index].cantidad}
              onValueChange={(itemValue, itemIndex) =>{
                const newProductos = [...productos];
                newProductos[index].calidad = itemValue;
                setProductos(newProductos);
              }}>
                {calidad_items.map((item, idx) => {
                  return (
                    <Picker.Item key={idx} label={item.name} value={item.value} />
                  );
                })}
            </Picker>
          </View>
        </View>
      ))}
    </ScrollView>
			<TouchableOpacity
				style={[styles.submitButton, {
          width: '90%',
          borderWidth: 1,
          borderColor: (!isButtonEnabled) ? 'gray' : 'green',
          margin: 10
        }]}
				onPress={sendRequirement}
        disabled={!isButtonEnabled}
			>
				<Text
					style={[styles.submitButtonText, {
            textAlign: 'center'
          }]}
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
		color: 'white',
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