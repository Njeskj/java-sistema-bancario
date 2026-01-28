import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Card, Text, Button, Avatar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { contaService } from '../services/api';

export default function DashboardScreen({ navigation }: any) {
  const [saldo, setSaldo] = useState({ brl: 0, eur: 0, usd: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadSaldo();
  }, []);

  const loadSaldo = async () => {
    try {
      // Assumindo contaId = 1 para demonstração
      const data = await contaService.getSaldo(1);
      setSaldo(data);
    } catch (error) {
      console.error('Erro ao carregar saldo:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadSaldo();
  };

  const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency,
    }).format(value);
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Card style={styles.balanceCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.balanceLabel}>
            Saldo Disponível
          </Text>
          <Text variant="displaySmall" style={styles.balanceValue}>
            {formatCurrency(saldo.brl, 'BRL')}
          </Text>
          <View style={styles.otherCurrencies}>
            <Text variant="bodySmall">
              EUR: {formatCurrency(saldo.eur, 'EUR')}
            </Text>
            <Text variant="bodySmall">
              USD: {formatCurrency(saldo.usd, 'USD')}
            </Text>
          </View>
        </Card.Content>
      </Card>

      <View style={styles.actionsContainer}>
        <View style={styles.actionButton}>
          <Avatar.Icon
            size={56}
            icon="bank-transfer"
            style={styles.actionIcon}
          />
          <Text variant="bodySmall">Transferir</Text>
        </View>

        <View style={styles.actionButton}>
          <Avatar.Icon
            size={56}
            icon="cash-plus"
            style={styles.actionIcon}
          />
          <Text variant="bodySmall">Depositar</Text>
        </View>

        <View style={styles.actionButton}>
          <Avatar.Icon
            size={56}
            icon="cash-minus"
            style={styles.actionIcon}
          />
          <Text variant="bodySmall">Sacar</Text>
        </View>

        <View style={styles.actionButton}>
          <Avatar.Icon
            size={56}
            icon="qrcode-scan"
            style={styles.actionIcon}
          />
          <Text variant="bodySmall">PIX</Text>
        </View>
      </View>

      <Card style={styles.card}>
        <Card.Title
          title="Transações Recentes"
          left={(props) => <MaterialCommunityIcons name="history" {...props} />}
        />
        <Card.Content>
          <Text variant="bodyMedium">Nenhuma transação recente</Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title
          title="Meus Cartões"
          left={(props) => <MaterialCommunityIcons name="credit-card" {...props} />}
        />
        <Card.Content>
          <Text variant="bodyMedium">Nenhum cartão cadastrado</Text>
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
  balanceCard: {
    margin: 16,
    backgroundColor: '#1976d2',
  },
  balanceLabel: {
    color: '#fff',
    opacity: 0.9,
  },
  balanceValue: {
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 8,
  },
  otherCurrencies: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionIcon: {
    backgroundColor: '#1976d2',
    marginBottom: 8,
  },
  card: {
    margin: 16,
    marginTop: 0,
  },
});
