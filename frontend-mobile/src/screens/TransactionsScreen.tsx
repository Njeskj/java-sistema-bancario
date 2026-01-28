import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Card, Text, Chip, Searchbar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { contaService } from '../services/api';

interface Transaction {
  id: number;
  tipo: string;
  valor: number;
  moeda: string;
  dataTransacao: string;
  descricao: string;
  status: string;
}

export default function TransactionsScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      // Assumindo contaId = 1
      const data = await contaService.getExtrato(1);
      setTransactions(data);
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadTransactions();
  };

  const getTransactionIcon = (tipo: string) => {
    const icons: any = {
      PIX: 'qrcode',
      TED: 'bank-transfer',
      DOC: 'bank-transfer',
      DEPOSITO: 'cash-plus',
      SAQUE: 'cash-minus',
    };
    return icons[tipo] || 'swap-horizontal';
  };

  const formatCurrency = (value: number, currency: string = 'BRL') => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.transactionHeader}>
          <View style={styles.transactionInfo}>
            <MaterialCommunityIcons
              name={getTransactionIcon(item.tipo)}
              size={24}
              color="#1976d2"
            />
            <View style={styles.transactionDetails}>
              <Text variant="titleMedium">{item.tipo}</Text>
              <Text variant="bodySmall" style={styles.date}>
                {formatDate(item.dataTransacao)}
              </Text>
            </View>
          </View>
          <View style={styles.valueContainer}>
            <Text
              variant="titleMedium"
              style={[
                styles.value,
                { color: item.tipo === 'DEPOSITO' ? '#4caf50' : '#f44336' },
              ]}
            >
              {item.tipo === 'DEPOSITO' ? '+' : '-'}
              {formatCurrency(item.valor, item.moeda)}
            </Text>
            <Chip style={styles.statusChip} compact>
              {item.status}
            </Chip>
          </View>
        </View>
        {item.descricao && (
          <Text variant="bodySmall" style={styles.description}>
            {item.descricao}
          </Text>
        )}
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Buscar transações"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      <FlatList
        data={transactions}
        renderItem={renderTransaction}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons
              name="history"
              size={64}
              color="#ccc"
            />
            <Text variant="bodyLarge" style={styles.emptyText}>
              Nenhuma transação encontrada
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchbar: {
    margin: 16,
  },
  card: {
    margin: 16,
    marginTop: 0,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  transactionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionDetails: {
    marginLeft: 12,
    flex: 1,
  },
  date: {
    color: '#666',
    marginTop: 4,
  },
  valueContainer: {
    alignItems: 'flex-end',
  },
  value: {
    fontWeight: 'bold',
  },
  statusChip: {
    marginTop: 4,
  },
  description: {
    marginTop: 12,
    color: '#666',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    marginTop: 16,
    color: '#666',
  },
});
