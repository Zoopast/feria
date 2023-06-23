import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';

const getDate = () => {
	const date = new Date();
	const day = date.getDate();
	const month = date.getMonth() + 1;
	const year = date.getFullYear();

	return `${year}-${month}-${day}`;
}

const Requirement = () => {
    const { id } = useLocalSearchParams();
    const router = useRouter();
		const [auctionInfo, setAuctionInfo] = useState({});
		const [precioOferta, setPrecioOferta] = useState(1);
    const [user, setUser] = useState({});
		const [fechaInicio, setFechaInicio] = useState(new Date());
		const [fechaTermino, setFechaTermino] = useState(new Date());
		const [showInicio, setShowInicio] = useState(false);
		const [showTermino, setShowTermino] = useState(false);

    useEffect(() => {
			const get_auction_info = async () => {
				await axios.get(`https://feriamaipo.herokuapp.com/subastas/${id}/info/`).then((response) => {
					setAuctionInfo(response.data);
					console.log(response.data);
				}

				).catch((error) => {
					console.log(error);
					});
			}

			get_auction_info();

        getUser();
    }, []);


    const getUser = async () => {
        const user = JSON.parse(await AsyncStorage.getItem('@user'));
        if(!user) return;

        setUser(user);
    }

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

		const handleOffer = async () => {
			const oferta = {
				id_subasta: auctionInfo.subasta.id_subasta,
				id_transportista: user.id_usuario,
				precio: precioOferta,
				fecha_recoleccion: formatDate(fechaInicio),
				fecha_entrega: formatDate(fechaTermino)
			}
			console.log(oferta);
			await axios.post("https://feriamaipo.herokuapp.com/subastas/ofertas/hacer_oferta", oferta).then(
				(response) => {
					console.log(response.data);
					router.push("/subastas");
				}
			).catch((error) => {
				console.log(error);
			});
		}

		const pickup_delivery = async () => {
			await axios.post(`https://feriamaipo.herokuapp.com/subastas/actualizar/envio/recogido/?id_subasta=${id}&id_requerimiento=${auctionInfo.requerimiento?.id_requerimiento}`).then(
				(response) => {
					console.log(response.data);
					router.push("/subastas/won");
				}
			)
		}

		const deliver_package = async () => {
			await axios.post(`https://feriamaipo.herokuapp.com/subastas/actualizar/envio/entregado/?id_subasta=${id}&id_requerimiento=${auctionInfo.requerimiento?.id_requerimiento}`).then(
				(response) => {
					console.log(response.data);
					router.push("/subastas/won");
				}
			)
		}

		const showMode = (currentMode) => {
			if (Platform.OS === 'android') {
				setShow(true);
			}
			setMode(currentMode);
		};

		const formatDate = (date) => {
			console.log
			const year = date.getFullYear();
			const month = date.getMonth() + 1;
			const day = date.getDate();
			return `${day}/${month}/${year}`;
		}

    return(
        <View style={styles.container}>
            <Text style={styles.title}>Subasta {id}</Text>
            <ScrollView>
								<Text style={styles.fieldTitle}>Requerimiento</Text>
								<Text style={styles.text}> { auctionInfo.requerimiento?.id_requerimiento }  </Text>
								<Text style={styles.fieldTitle}>Usuario</Text>
								<Text style={styles.text}> { auctionInfo.requerimiento?.usuario.nombre } </Text>
								<Text style={styles.fieldTitle}>Fecha inicio subasta</Text>
								<Text style={styles.text}> { formatDate(new Date(auctionInfo.subasta?.fecha_inicio)) } </Text>
								<Text style={styles.fieldTitle}>Fecha termino subasta</Text>
								<Text style={styles.text}> { formatDate(new Date(auctionInfo.subasta?.fecha_fin)) } </Text>
								<Text style={styles.fieldTitle}>Estado subasta</Text>
								<Text style={styles.text}> { auctionInfo.subasta?.estado } </Text>
								<Text style={styles.fieldTitle}>Produtos</Text>
								<View>
									{ auctionInfo.requerimiento?.productos?.map((product, idx) => (
										<View key={idx} style={styles.field}>
											<Text style={styles.fieldTitle}>Nombre: {product.nombre}</Text>
											<Text style={styles.fieldTitle}>Cantidad total: {product.cantidad}</Text>
										</View>))}
								</View>
								<View>
									<Text style={styles.title}>Dirección de envio</Text>
									<Text style={styles.fieldTitle}>{auctionInfo.requerimiento?.direccion}</Text>
								</View>
            </ScrollView>
						{
							auctionInfo.subasta?.estado === 'activo' &&
							<ScrollView>
							<Text style={styles.title}>Ofertar transporte</Text>
							<Text style={styles.fieldTitle}>Fecha recogida</Text>
							<TextInput style={styles.textInput} value={formatDate(fechaInicio)} />
							<TouchableOpacity onPress={showDatepickerInicio}>
								<Text style={styles.text}>Seleccionar fecha</Text>
							</TouchableOpacity>
							{showInicio && (
								<DateTimePicker
									testID="dateTimePicker"
									minimumDate={new Date()}
									value={fechaInicio}
									mode='date'
									is24Hour={true}
									display="default"
									onChange={onChangeInicio}
								/>
							)}

							<Text style={styles.fieldTitle}>Fecha entrega productos</Text>
							<TextInput style={styles.textInput} value={formatDate(fechaTermino)} />
							<TouchableOpacity onPress={showDatepickerTermino}>
								<Text style={styles.text}>Seleccionar fecha</Text>
							</TouchableOpacity>
							{showTermino && (
								<DateTimePicker
									testID="dateTimePicker"
									value={fechaTermino}
									mode='date'
									minimumDate={fechaInicio}
									is24Hour={true}
									display="default"
									onChange={onChangeTermino}
								/>
							)}
							<Text style={styles.fieldTitle}>Precio oferta</Text>
							<TextInput
								style={styles.textInput}
								placeholder="Precio de transporte"
								placeholderTextColor="white"
								value={precioOferta}
								onChangeText={setPrecioOferta}
							/>
							<TouchableOpacity style={styles.ofertarButton} onPress={handleOffer}>
								<Text style={styles.text}>Ofertar</Text>
							</TouchableOpacity>
						</ScrollView>
						}
						{
							auctionInfo.subasta?.estado === 'pendiente de entrega' &&
							<TouchableOpacity style={styles.pickedButton} onPress={pickup_delivery}>
								<Text style={styles.pickedButtonText}>Ya recogí esta orden</Text>
							</TouchableOpacity>
						}
						{
							auctionInfo.subasta?.estado === 'en camino' &&
							<TouchableOpacity style={styles.deliveredButton} onPress={deliver_package}>
								<Text style={styles.deliveredButtonText}>Ya entregué esta orden</Text>
							</TouchableOpacity>
						}
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
