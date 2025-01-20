import React, { useState } from 'react';
import { Text, StyleSheet, View, TextInput, Button, Alert } from 'react-native';

const Register = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const validateInputs = () => {
    
    if (!fullName || !email || !password) {
      Alert.alert('Error', 'Todos los campos son obligatorios.');
      return false;
    }

    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Por favor, ingresa un email válido.');
      return false;
    }

    
    if (password.length < 8) {
      Alert.alert('Error', 'La contraseña debe tener al menos 8 caracteres.');
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateInputs()) return;

    try {
      
      const response = await fetch('https://api.ejemplo.com/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName,
          email,
          password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert('Éxito', 'Registro exitoso.');
        navigation.navigate('Login'); 
      } else {
        Alert.alert('Error', result.message || 'Hubo un problema con el registro.');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo conectar con el servidor.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro de Usuario</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre Completo"
        value={fullName}
        onChangeText={setFullName}
      />
      <TextInput
        style={styles.input}
        placeholder="Correo Electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Registrarse" onPress={handleRegister} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
});

export default Register;
