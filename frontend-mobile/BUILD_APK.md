# Gerar APK do IBank Mobile

## Opção 1: Build Local (Recomendado para Desenvolvimento)

### Pré-requisitos:
1. **Node.js e npm** instalados
2. **EAS CLI** instalado globalmente:
   ```bash
   npm install -g eas-cli
   ```
3. **Android Studio** com SDK Android (para build local)
4. **Conta Expo** (criar em https://expo.dev)

### Passos:

1. **Login no Expo**:
   ```bash
   cd frontend-mobile
   eas login
   ```

2. **Configurar projeto**:
   ```bash
   eas build:configure
   ```

3. **Gerar APK local**:
   ```bash
   npm run build:apk
   ```

   Ou para produção:
   ```bash
   npm run build:apk:production
   ```

4. **APK gerado**: O arquivo `.apk` estará em `frontend-mobile/`

---

## Opção 2: Expo Go (Teste Rápido - Sem APK)

**Mais simples para testar durante desenvolvimento:**

1. **Instale Expo Go** no celular Android:
   - Google Play Store: https://play.google.com/store/apps/details?id=host.exp.exponent

2. **Inicie o projeto**:
   ```bash
   cd frontend-mobile
   npm start
   ```

3. **Escaneie o QR Code** com o app Expo Go

**Vantagens**: Sem necessidade de gerar APK, hot reload instantâneo
**Desvantagem**: Requer conexão com servidor dev

---

## Opção 3: Build na Nuvem (Mais Fácil)

Se não quiser instalar Android SDK localmente:

```bash
cd frontend-mobile
eas build -p android --profile preview
```

O Expo irá gerar o APK nos servidores deles e enviar link para download.

---

## Configuração da API

Antes de gerar o APK, configure o endpoint do backend em:

**`frontend-mobile/src/services/api.ts`**:
```typescript
const API_URL = 'http://SEU_IP_REAL:8081/api';
// Exemplo: http://192.168.1.100:8081/api
```

⚠️ **Importante**: `localhost` não funciona no celular! Use IP da máquina na rede local.

---

## Verificar IP da máquina:

**Windows**:
```bash
ipconfig
```
Procure por "Endereço IPv4" na sua interface de rede ativa.

**Atualize o arquivo `api.ts`** com o IP encontrado antes de gerar o APK.
