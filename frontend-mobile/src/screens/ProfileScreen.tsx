import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { List, Divider, Avatar, Text } from 'react-native-paper';
import { authService } from '../services/api';

export default function ProfileScreen() {
  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          onPress: async () => {
            await authService.logout();
            // Navigation será tratada automaticamente
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Avatar.Icon size={80} icon="account" style={styles.avatar} />
        <Text variant="headlineSmall" style={styles.name}>
          João Silva
        </Text>
        <Text variant="bodyMedium" style={styles.email}>
          joao.silva@email.com
        </Text>
      </View>

      <List.Section>
        <List.Subheader>Conta</List.Subheader>
        <List.Item
          title="Dados Pessoais"
          description="Editar informações"
          left={(props) => <List.Icon {...props} icon="account-edit" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
        />
        <Divider />
        <List.Item
          title="Documentos"
          description="CPF, RG, CNH"
          left={(props) => <List.Icon {...props} icon="file-document" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
        />
        <Divider />
        <List.Item
          title="Endereço"
          description="Atualizar endereço"
          left={(props) => <List.Icon {...props} icon="map-marker" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
        />
      </List.Section>

      <List.Section>
        <List.Subheader>Segurança</List.Subheader>
        <List.Item
          title="Alterar Senha"
          left={(props) => <List.Icon {...props} icon="lock" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
        />
        <Divider />
        <List.Item
          title="Autenticação Biométrica"
          description="Ativada"
          left={(props) => <List.Icon {...props} icon="fingerprint" />}
          right={(props) => <List.Icon {...props} icon="check" />}
        />
        <Divider />
        <List.Item
          title="Notificações"
          description="Configurar alertas"
          left={(props) => <List.Icon {...props} icon="bell" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
        />
      </List.Section>

      <List.Section>
        <List.Subheader>Ajuda</List.Subheader>
        <List.Item
          title="Central de Ajuda"
          left={(props) => <List.Icon {...props} icon="help-circle" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
        />
        <Divider />
        <List.Item
          title="Termos e Privacidade"
          left={(props) => <List.Icon {...props} icon="file-document-outline" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
        />
        <Divider />
        <List.Item
          title="Sobre"
          description="Versão 2.0.0"
          left={(props) => <List.Icon {...props} icon="information" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
        />
      </List.Section>

      <List.Section>
        <List.Item
          title="Sair"
          titleStyle={{ color: '#f44336' }}
          left={(props) => <List.Icon {...props} icon="logout" color="#f44336" />}
          onPress={handleLogout}
        />
      </List.Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  avatar: {
    backgroundColor: '#1976d2',
    marginBottom: 16,
  },
  name: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    color: '#666',
  },
});
