import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Text, Button, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function CardsScreen() {
  return (
    <ScrollView style={styles.container}>
      <Card style={styles.cardContainer}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="credit-card" size={32} color="#fff" />
            <Chip style={styles.chip} textStyle={{ color: '#fff' }}>
              Virtual
            </Chip>
          </View>
          <Text variant="headlineMedium" style={styles.cardNumber}>
            **** **** **** 1234
          </Text>
          <View style={styles.cardFooter}>
            <View>
              <Text variant="bodySmall" style={styles.cardLabel}>
                Titular
              </Text>
              <Text variant="titleMedium" style={styles.cardValue}>
                João Silva
              </Text>
            </View>
            <View>
              <Text variant="bodySmall" style={styles.cardLabel}>
                Validade
              </Text>
              <Text variant="titleMedium" style={styles.cardValue}>
                12/28
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title
          title="Limites"
          left={(props) => <MaterialCommunityIcons name="chart-line" {...props} />}
        />
        <Card.Content>
          <View style={styles.limitRow}>
            <Text variant="bodyMedium">Compras</Text>
            <Text variant="titleMedium">R$ 5.000,00</Text>
          </View>
          <View style={styles.limitRow}>
            <Text variant="bodyMedium">Saque</Text>
            <Text variant="titleMedium">R$ 1.000,00</Text>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title
          title="Faturas"
          left={(props) => <MaterialCommunityIcons name="file-document" {...props} />}
        />
        <Card.Content>
          <Text variant="bodyMedium">Nenhuma fatura em aberto</Text>
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        style={styles.button}
        icon="credit-card-plus"
      >
        Solicitar Novo Cartão
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  cardContainer: {
    margin: 16,
    backgroundColor: '#1976d2',
    borderRadius: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  chip: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  cardNumber: {
    color: '#fff',
    marginBottom: 24,
    letterSpacing: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 4,
  },
  cardValue: {
    color: '#fff',
  },
  card: {
    margin: 16,
    marginTop: 0,
  },
  limitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  button: {
    margin: 16,
    paddingVertical: 8,
  },
});
