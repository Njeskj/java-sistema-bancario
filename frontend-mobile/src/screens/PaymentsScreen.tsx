import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Text, TextInput, Button, SegmentedButtons } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { contaService } from '../services/api';

export default function PaymentsScreen() {
  const [tipoTransacao, setTipoTransacao] = useState('transferencia');
  const [destinoIdentificador, setDestinoIdentificador] = useState('');
  const [valor, setValor] = useState('');
  const [descricao, setDescricao] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTransferencia = async () => {
    if (!destinoIdentificador || !valor) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios');
      return;
    }

    setLoading(true);
    try {
      await contaService.realizarTransferencia({
        contaOrigemId: 1, // Assumindo contaId = 1
        destinoIdentificador,
        valor: parseFloat(valor),
        moeda: 'BRL',
        tipoTransferencia: 'PIX',
        descricao,
      });
      Alert.alert('Sucesso', 'Transferência realizada com sucesso!');
      setDestinoIdentificador('');
      setValor('');
      setDescricao('');
    } catch (error: any) {
      Alert.alert(
        'Erro',
        error.response?.data?.message || 'Erro ao realizar transferência'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSaque = async () => {
    if (!valor) {
      Alert.alert('Erro', 'Informe o valor do saque');
      return;
    }

    setLoading(true);
    try {
      await contaService.realizarSaque(1, parseFloat(valor));
      Alert.alert('Sucesso', 'Saque realizado com sucesso!');
      setValor('');
    } catch (error: any) {
      Alert.alert(
        'Erro',
        error.response?.data?.message || 'Erro ao realizar saque'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeposito = async () => {
    if (!valor) {
      Alert.alert('Erro', 'Informe o valor do depósito');
      return;
    }

    setLoading(true);
    try {
      await contaService.realizarDeposito(1, parseFloat(valor));
      Alert.alert('Sucesso', 'Depósito realizado com sucesso!');
      setValor('');
    } catch (error: any) {
      Alert.alert(
        'Erro',
        error.response?.data?.message || 'Erro ao realizar depósito'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    switch (tipoTransacao) {
      case 'transferencia':
        handleTransferencia();
        break;
      case 'saque':
        handleSaque();
        break;
      case 'deposito':
        handleDeposito();
        break;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.title}>
            Realizar Operação
          </Text>

          <SegmentedButtons
            value={tipoTransacao}
            onValueChange={setTipoTransacao}
            buttons={[
              {
                value: 'transferencia',
                label: 'Transferir',
                icon: 'bank-transfer',
              },
              {
                value: 'saque',
                label: 'Sacar',
                icon: 'cash-minus',
              },
              {
                value: 'deposito',
                label: 'Depositar',
                icon: 'cash-plus',
              },
            ]}
            style={styles.segmented}
          />

          {tipoTransacao === 'transferencia' && (
            <TextInput
              label="Chave PIX ou Conta"
              value={destinoIdentificador}
              onChangeText={setDestinoIdentificador}
              mode="outlined"
              style={styles.input}
              placeholder="CPF, Email, Telefone ou IBAN"
            />
          )}

          <TextInput
            label="Valor (R$)"
            value={valor}
            onChangeText={setValor}
            mode="outlined"
            style={styles.input}
            keyboardType="decimal-pad"
          />

          {tipoTransacao === 'transferencia' && (
            <TextInput
              label="Descrição (opcional)"
              value={descricao}
              onChangeText={setDescricao}
              mode="outlined"
              style={styles.input}
              multiline
              numberOfLines={3}
            />
          )}

          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
            style={styles.button}
          >
            Confirmar
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title
          title="Informações"
          left={(props) => <MaterialCommunityIcons name="information" {...props} />}
        />
        <Card.Content>
          <Text variant="bodyMedium">
            • PIX: Transferência instantânea{'\n'}
            • Saques: Disponível 24/7{'\n'}
            • Depósitos: Confirmação imediata
          </Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    margin: 16,
  },
  title: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
  segmented: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    paddingVertical: 8,
  },
});
