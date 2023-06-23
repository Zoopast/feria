import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";
import axios from 'axios';

const HomeScreen = () => {

  const [user, setUser] = useState({});
  const router = useRouter();

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
        await AsyncStorage.setItem('@user', JSON.stringify(response.data));
        setUser(response.data);
      }).catch((error) => {
        console.log(error);
      });
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
      {(user?.rol === 'Administrador' || user?.rol === 'Cliente externo' ) && (
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
          onPress={() => router.push("/new_requirement") }
        >
          <Text style={{color: 'white'}}>Nuevo requerimiento</Text>
        </TouchableOpacity>
        <TouchableOpacity
          title="Ver requerimientos"
          style={styles.button}
          onPress={() => router.push("/requirements/mine")}
        >
          <Text style={{color: 'white'}}>Ver mis requerimientos</Text>
        </TouchableOpacity>
      </View>
      )}
      { user?.rol === 'Productor' && (
        <View
          style={{
            gap: 20,
            paddingHorizontal: 20,
            marginBottom: 20,
          }}
        >
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/requirements')}
          >
            <Text style={{color: 'white'}}>Ver nuevos requerimientos</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/requirements')}
          >
            <Text style={{color: 'white'}}>Ver requerimientos entregados</Text>
          </TouchableOpacity>
        </View>
      )
      }
            { user?.rol === 'Transportista' && (
        <View
          style={{
            gap: 20,
            paddingHorizontal: 20,
            marginBottom: 20,
          }}
        >
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/subastas')}
          >
            <Text style={{color: 'white'}}>Ver subastas activas</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/subastas/won')}
          >
            <Text style={{color: 'white'}}>Ver subastas ganadas</Text>
          </TouchableOpacity>
        </View>
      )
      }
      <TouchableOpacity
        title="Cerrar sesión"
        style={[styles.button, {backgroundColor: '#FF0000'}]}
        onPress={async () => {
          await AsyncStorage.removeItem('authToken');
          await AsyncStorage.removeItem('@user');
          setUser({});
          router.push('/');
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
    backgroundColor: '#1e2124',
    color: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
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