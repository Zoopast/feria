import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useRouter } from "expo-router";

const requirement = ({id}) => {
	const [requirement, setRequirement] = useState({});
	const router = useRouter();


	const getRequirement = async () => {
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