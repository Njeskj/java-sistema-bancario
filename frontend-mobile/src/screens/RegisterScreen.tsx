import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { authService } from '../services/api';

export default function RegisterScreen({ navigation }: any) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmSenha, setConfirmSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!nome || !email || !cpf || !senha) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios');
      return;
    }

    if (senha !== confirmSenha) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    setLoading(true);
    try {
      await authService.register({
        nome,
        email,
        cpf,
        telefone,
        senha,
      });
      Alert.alert('Sucesso', 'Conta criada com sucesso!', [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
      ]);
    } catch (error: any) {
      Alert.alert(
        'Erro',
        error.response?.data?.message || 'Erro ao criar conta'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title} variant="headlineMedium">Criar Conta</Text>

        <TextInput
          label="Nome Completo *"
          value={nome}
          onChangeText={setNome}
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Email *"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          label="CPF *"
          value={cpf}
          onChangeText={setCpf}
          mode="outlined"
          style={styles.input}
          keyboardType="numeric"
        />

        <TextInput
          label="Telefone"
          value={telefone}
          onChangeText={setTelefone}
          mode="outlined"
          style={styles.input}
          keyboardType="phone-pad"
        />

        <TextInput
          label="Senha *"
          value={senha}
          onChangeText={setSenha}
          mode="outlined"
          style={styles.input}
          secureTextEntry
        />

        <TextInput
          label="Confirmar Senha *"
          value={confirmSenha}
          onChangeText={setConfirmSenha}
          mode="outlined"
          style={styles.input}
          secureTextEntry
        />

        <Button
          mode="contained"
          onPress={handleRegister}
          loading={loading}
          disabled={loading}
          style={styles.button}
        >
          Criar Conta
        </Button>

        <Button
          mode="text"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          Já tenho conta
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
    paddingVertical: 8,
  },
  backButton: {
    marginTop: 16,
  },
});
