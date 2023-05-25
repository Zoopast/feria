import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
const HomeScreen = () => {

  const [user, setUser] = useState({});

  const fetchUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('@user');
      
      if(userData) {
        setUser(JSON.parse(userData));
        return;
      }

      const token = await AsyncStorage.getItem('authToken');
      
      if(!token) return;

      await axios.get(
        'https://feriamaipo.herokuapp.com/usuarios/me',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ).then(async (response) => {
        console.log(response);
        console.log(response.data);
        await AsyncStorage.setItem('@user', JSON.stringify(response.data));
        setUser(response.data);
      }).catch((error) => {
        console.log(error);
      });
      console.log(response.data);
    }
    catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <View style={styles.container}>
      
      <Text style={styles.text}>Hola, {user?.nombre_usuario}</Text>
      <Text style={styles.text}>Bienvenido a Feria Maipo</Text>
      <View
        style={{
          gap: 20,
          paddingHorizontal: 20,
          marginBottom: 20,
        }}
      >
      <TouchableOpacity
        title="Nuevo requerimiento"
        style={styles.button}
        onPress={() => navigation.navigate('Nuevo requerimiento')}
      >
        <Text style={{color: 'white'}}>Nuevo requerimiento</Text>
      </TouchableOpacity>
      <TouchableOpacity
        title="Ver requerimientos"
        style={styles.button}
      >
        <Text style={{color: 'white'}}>Ver requerimientos</Text>
      </TouchableOpacity>
      </View>

      <TouchableOpacity
        title="Cerrar sesión"
        style={[styles.button, {backgroundColor: '#FF0000'}]}
        onPress={async () => {
          await AsyncStorage.removeItem('authToken');
          await AsyncStorage.removeItem('@user');
          setUser({});
        }}
      >
        <Text style={{color: 'white'}}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  button: {
    marginTop: 20,
    borderRadius: 20,
    backgroundColor:'#1E6738',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
});

export default HomeScreen;