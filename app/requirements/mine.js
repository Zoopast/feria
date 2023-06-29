import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import axios from 'axios';
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';

const my_requirements = () => {
  const [user, setUser] = useState({});
  const [requirements, setRequirements] = useState([]);
  const estados = ['enviado','activo', 'en subasta', 'en camino', 'entregado', 'finalizado'];
  const router = useRouter();

  const getActiveRequirements = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) return;
      await axios.get('https://feriamaipo.herokuapp.com/requerimientos/activos/', {
      })
        .then((response) => {
          setRequirements(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  }

  const getRequirements = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) return;
      await axios.get('https://feriamaipo.herokuapp.com/usuarios/me/requerimientos', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          setRequirements(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
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
      if (!user) return;
      setUser(user);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getCurrentUser();
  }, []);

  useEffect(() => {
    if (user?.rol === 'Cliente externo' || user?.rol === 'Cliente interno' || user?.rol === 'Administrador') {
      getRequirements();
    }

    if (user?.rol === 'Productor') {
      getActiveRequirements();
    }
  }, [user]);

  const filterRequirements = (status) => {
    return requirements.filter((requirement) => requirement.estado === status);
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        {user?.rol === 'Cliente externo' && "Mis requerimientos"}
        {user?.rol === 'Productor' && "Requerimientos activos"}
      </Text>
      <View style={styles.requirements}>
        {requirements.length === 0 && <Text style={styles.text}>No hay requerimientos</Text>}
        {estados.map((estado) => (
          <View key={estado} style={styles.statusContainer}>
            <Text style={styles.statusText}>Requerimientos {estado}</Text>
            {filterRequirements(estado).map((requirement) => (
              <TouchableOpacity
                style={styles.requirement}
                key={requirement.id_requerimiento}
                onPress={() => router.push(`/requirements/${requirement.id_requerimiento}`)}
              >
                <View style={styles.field}>
                  <Text style={styles.fieldTitle}>Numero</Text>
                  <Text style={styles.text}>{requirement.id_requerimiento}</Text>
                </View>
                <View style={styles.field}>
                  <Text style={styles.fieldTitle}>Fecha de inicio</Text>
                  <Text style={styles.text}>{formatDate(requirement.fecha_inicio)}</Text>
                </View>
                <View style={styles.field}>
                  <Text style={styles.fieldTitle}>Fecha termino</Text>
                  <Text style={styles.text}>{formatDate(requirement.fecha_fin)}</Text>
                </View>
                <View style={styles.field}>
                  <Text style={styles.fieldTitle}>Estado</Text>
                  <Text style={styles.text}>{requirement.estado}</Text>
                </View>
                <Text style={styles.viewText}>Ver</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e2124',
    padding: 10,
  },
  title: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  requirements: {
    flex: 1,
    backgroundColor: '#1e2124',
    padding: 10,
  },
  statusContainer: {
    backgroundColor: '#1e2124',
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 16,
    color: '#BDBDBD',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  requirement: {
    flexDirection: 'row',
    backgroundColor: '#282b30',
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
  },
  field: {
    flex: 1,
  },
  fieldTitle: {
    fontSize: 15,
    color: '#BDBDBD',
  },
  text: {
    color: 'white',
  },
  viewText: {
    color: 'white',
    marginLeft: 'auto',
  },
});

export default my_requirements;
