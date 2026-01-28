import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { TextInput, Button, Text, useTheme } from 'react-native-paper';
import { authService } from '../services/api';

export default function LoginScreen({ navigation }: any) {
  const [emailOuCpf, setEmailOuCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [secureText, setSecureText] = useState(true);
  const theme = useTheme();

  const handleLogin = async () => {
    if (!emailOuCpf || !senha) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    setLoading(true);
    try {
      console.log('Tentando login com:', emailOuCpf);
      const result = await authService.login(emailOuCpf, senha);
      console.log('Login bem-sucedido:', result);
      Alert.alert('Sucesso', 'Login realizado com sucesso!');
      // Recarregar a página para atualizar estado de autenticação
      if (Platform.OS === 'web') {
        window.location.reload();
      }
    } catch (error: any) {
      console.error('Erro no login:', error);
      Alert.alert(
        'Erro no Login',
        error.response?.data?.message || error.message || 'Credenciais inválidas'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <Text style={styles.title} variant="displaySmall">IBank</Text>
        <Text style={styles.subtitle} variant="titleMedium">Seu banco digital</Text>

        <TextInput
          label="Email ou CPF"
          value={emailOuCpf}
          onChangeText={setEmailOuCpf}
          mode="outlined"
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          label="Senha"
          value={senha}
          onChangeText={setSenha}
          mode="outlined"
          style={styles.input}
          secureTextEntry={secureText}
          right={
            <TextInput.Icon
              icon={secureText ? 'eye' : 'eye-off'}
              onPress={() => setSecureText(!secureText)}
            />
          }
        />

        <Button
          mode="contained"
          onPress={handleLogin}
          loading={loading}
          disabled={loading}
          style={styles.button}
        >
          Entrar
        </Button>

        <Button
          mode="text"
          onPress={() => navigation.navigate('Register')}
          style={styles.registerButton}
        >
          Criar conta
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#1976d2',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 40,
    color: '#666',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
    paddingVertical: 8,
  },
  registerButton: {
    marginTop: 16,
  },
});
