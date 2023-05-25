import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Link } from "expo-router";
import { StyleSheet, Text, View, TextInput, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";

export default function Page() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const saveToken = async (jwtToken) => {
    try {
      await AsyncStorage.setItem('authToken', jwtToken);
      
    } catch (error) {
      console.log('Error saving token:', error);
    }
  };

  const handleLogin = async () => {
    try {

      const formData = new FormData();
      formData.append('username', email);
      formData.append('password', password);
      await axios.post(
        'https://feriamaipo.herokuapp.com/usuarios/sign_in', formData
        ).then(async (response) => {
        if(response.status == 200){
          await saveToken(response.data.access_token);
          router.push('/home');
        }
      }).catch((error) => {
        console.log(error);
      });
      Alert.alert('Success', 'Logged in successfully!');
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
      <View
        style={{
          paddingHorizontal: 20,
          marginBottom: 20,
        }}
      >
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.textInput}
        />

        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.textInput}
        />
      </View>
      <TouchableOpacity 
        style={styles.button}
        title="Login" 
        onPress={handleLogin}>
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
    backgroundColor: '#fff',
    
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize : 20,
    fontWeight: 'bold',
    marginBottom: 20,

  },
  textInput: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginTop: 8,
      padding: 10,
      borderRadius: 8,
  },
  forgotPassword: {
    marginTop: 20,
    color: 'blue',

  },
  button: {
    alignItems: "center",
    backgroundColor: "green",
    color: "white",
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  }
});