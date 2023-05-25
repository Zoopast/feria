import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from "expo-router";

export default function Page() {
  const [email, setEmail] = useState('');
  const router = useRouter();


  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text
        style={styles.title}
      >
        Recuperar cuenta
			</Text>
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
      </View>
      <TouchableOpacity>
				<Text style={styles.forgotPassword}>Recuperar cuenta</Text>
			</TouchableOpacity>
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

  }
});