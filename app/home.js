import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";
import axios from 'axios';

const HomeScreen = () => {

  const [user, setUser] = useState({});
  const router = useRouter();

  const processUserData = async (userData) => {
    try{
      if (userData.rol && userData.rol.toLowerCase() === "cliente externo") {
        console.log(userData.rol)
        const token = await AsyncStorage.getItem('authToken');
        await axios.get('https://feriamaipo.herokuapp.com/usuarios/me/requerimientos/entregados/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).then(async (response) => {
          const requerimientosEntregados = await AsyncStorage.getItem('@requerimientosEntregados');

          if (requerimientosEntregados) {
            const alreadyNotified = requerimientosEntregados.find(requerimiento => requerimiento === response.data)
            if (!alreadyNotified) {
              const requerimientos_id = JSON.parse(requerimientosEntregados);
              requerimientos_id.push(response.data);
              await AsyncStorage.setItem('@requerimientosEntregados', JSON.stringify(requerimientos_id));
              Alert.alert(
                "Nuevo requerimiento entregado",
                "Ve a tus requerimientos para ver más detalles",
                [
                  {
                    text: "Ir a tus requerimientos",
                    onPress: () => router.push("/requirements/mine"),
                  },
                ]
              );
            }
          }
          else{
            const requerimientos_id = [];
            response.data.forEach(requerimiento => {
              requerimientos_id.push(requerimiento.id_requerimiento);
            });
            await AsyncStorage.setItem('@requerimientosEntregados', JSON.stringify(requerimientos_id));
            Alert.alert(
              "Nuevo requerimiento entregado",
              "Ve a tus requerimientos para ver más detalles",
              [
                {
                  text: "Ir a tus requerimientos",
                  onPress: () => router.push("/requirements/mine"),
                },
              ]
            );
          }

          console.log(response.data);
        }).catch((error) => {
          console.log(error);
        });
      }
    }catch(error) {
      console.log(error);
    }
  };

  const fetchUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('@user');

      if (userData) {
        console.log(userData);
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

  useEffect(() => {
    processUserData(user);
  }, [user]);


  return (
    <View style={styles.container}>

      <Text style={styles.text}>Hola, {user?.nombre_usuario}</Text>
      <Text style={styles.text}>Bienvenido a Feria Maipo</Text>
      {user?.rol === 'Consultor' && (
        <View
        style={{
          gap: 20,
          paddingHorizontal: 20,
          marginBottom: 20,
        }}
        >
          <TouchableOpacity
            title="Ver ventas efectuadas"
            style={styles.button}
            onPress={() => router.push("/ventas/")}
          >
            <Text style={{color: 'white'}}>Ver ventas efectuadas</Text>
          </TouchableOpacity>
          <TouchableOpacity
            title="Ver productos comprados"
            style={styles.button}
            onPress={() => router.push("/ventas/")}
          >
            <Text style={{color: 'white'}}>Analizar compras</Text>
          </TouchableOpacity>
        </View>
        )
      }
      {user?.rol === 'Cliente interno' && (
        <View
        style={{
          gap: 20,
          paddingHorizontal: 20,
          marginBottom: 20,
        }}
        >
          <TouchableOpacity
            title="Ver productos en venta"
            style={styles.button}
            onPress={() => router.push("/ventas_locales/")}
          >
            <Text style={{color: 'white'}}>Ver productos en venta</Text>
          </TouchableOpacity>
          <TouchableOpacity
            title="Ver productos comprados"
            style={styles.button}
            onPress={() => router.push("/ventas_locales/mine/")}
          >
            <Text style={{color: 'white'}}>Ver productos comprados</Text>
          </TouchableOpacity>
        </View>
        )
      }
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