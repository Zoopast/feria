import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Link } from "expo-router";
import { StyleSheet, Text, View, TextInput, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";

export default function Page() {
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [disabled, setDisabled] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkIfUserIsLoggedIn();
  }, []);



  const saveToken = async (jwtToken) => {
    try {
      await AsyncStorage.setItem('authToken', jwtToken);

    } catch (error) {
      console.log('Error saving token:', error);
    }
  };

  const checkIfUserIsLoggedIn = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const user = JSON.parse(await AsyncStorage.getItem('@user'));
      if ((token !== null) && (user !== null)) {
        router.push('/home');
      }
    } catch (error) {
      console.log('Error checking if user is logged in:', error);
    }
  }

  const handleLogin = async () => {
    try {

      const formData = new FormData();
      formData.append('username', email);
      formData.append('password', password);
      await axios.post(
        'https://feriamaipo.herokuapp.com/usuarios/sign_in', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          transformRequest: (data, headers) => {
            return formData;
          }
        }).then(async (response) => {
        if(response.status == 200){
          await saveToken(response.data.access_token);
          router.push('/home');
        }
      }).catch((error) => {
        if(error.response.status === 401) {
          setMessage('Email o contraseña incorecto');
        }
        console.log(error);
      });
    } catch (error) {
      Alert.alert('Error', 'Login failed. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text
        style={styles.title}
      >
        Iniciar sesión</Text>
      <View>
        <Text
          style={{
            color: 'white',
          }}
        >
          {message}
        </Text>
      </View>
      <View
        style={{
          paddingHorizontal: 20,
          marginBottom: 20,
        }}
      >
        <TextInput
          placeholder="Email"
          value={email}
          placeholderTextColor="white"
          onChangeText={setEmail}
          style={styles.textInput}
        />

        <TextInput
          placeholder="Contraseña"
          value={password}
          placeholderTextColor="white"
          onChangeText={setPassword}
          secureTextEntry
          style={styles.textInput}
        />
      </View>
      <TouchableOpacity
        style={[styles.button, {
          backgroundColor: email.length > 0 && password.length > 0 ? 'green' : 'gray',
        }]}
        title="Login"
        onPress={handleLogin}
        disabled={email.length > 0 && password.length > 0 ? false : true}
      >
        <Text
          style={{
            color: 'white',
          }}
        >
          Iniciar sesión
        </Text>
      </TouchableOpacity>
      <Link
        href="/forgot_password"
      >
        <Text
          style={styles.forgotPassword}
        >¿Olvidaste tu contraseña?</Text>
      </Link>
    </View>
  );
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
    color: 'white',

  },
  textInput: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginTop: 8,
      padding: 10,
      width: 300,
      borderRadius: 8,
      color: 'white',
  },
  forgotPassword: {
    marginTop: 20,
    color: '#07a4b5',

  },
  button: {
    alignItems: "center",
    color: "white",
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  }
});