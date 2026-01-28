# IBank Mobile - React Native

Aplicativo bancário mobile desenvolvido com React Native e Expo.

## 🚀 Tecnologias

- React Native 0.73
- Expo ~50.0
- React Navigation 6
- React Native Paper 5
- Axios
- TypeScript

## 📱 Funcionalidades

- ✅ Login e Registro
- ✅ Dashboard com saldo
- ✅ Extrato de transações
- ✅ Transferências (PIX/TED/DOC)
- ✅ Saques e Depósitos
- ✅ Gerenciamento de cartões
- ✅ Perfil do usuário
- ✅ Autenticação biométrica
- ✅ Notificações push

## 🛠️ Instalação

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Expo CLI: `npm install -g expo-cli`
- Android Studio (para emulador Android) ou Xcode (para iOS)

### Instalar dependências

```bash
cd frontend-mobile
npm install
```

### Configurar variáveis de ambiente

Copie o arquivo `.env.example` para `.env` e configure a URL da API:

```bash
cp .env.example .env
```

Edite o arquivo `.env`:
```
API_URL=http://10.0.2.2:8080/api  # Para emulador Android
# API_URL=http://localhost:8080/api  # Para iOS
```

## 🎮 Executar

### Iniciar servidor de desenvolvimento

```bash
npm start
```

### Executar no Android

```bash
npm run android
```

### Executar no iOS (macOS apenas)

```bash
npm run ios
```

### Executar no navegador

```bash
npm run web
```

## 📲 Executar em dispositivo físico

1. Instale o app **Expo Go** na Play Store ou App Store
2. Execute `npm start`
3. Escaneie o QR Code com o app Expo Go

## 🔧 Configuração da API

O app conecta ao backend IBank por padrão em `http://localhost:8080/api`.

Para testar com backend real:
- Emulador Android: use `http://10.0.2.2:8080/api`
- iOS Simulator: use `http://localhost:8080/api`
- Dispositivo físico: use o IP da sua máquina, ex: `http://192.168.1.100:8080/api`

Edite `src/services/api.ts` para alterar a URL base.

## 📁 Estrutura do Projeto

```
frontend-mobile/
├── src/
│   ├── screens/         # Telas do app
│   │   ├── LoginScreen.tsx
│   │   ├── DashboardScreen.tsx
│   │   ├── TransactionsScreen.tsx
│   │   ├── PaymentsScreen.tsx
│   │   ├── CardsScreen.tsx
│   │   └── ProfileScreen.tsx
│   ├── services/        # Serviços de API
│   │   └── api.ts
│   └── i18n/           # Internacionalização
│       └── config.ts
├── App.tsx             # Componente principal
├── app.json            # Configuração Expo
└── package.json
```

## 🔐 Autenticação

O app usa JWT para autenticação:
- Token armazenado em SecureStore (criptografado)
- Renovação automática de token
- Logout automático em caso de token inválido

## 🎨 Design

- Material Design via React Native Paper
- Tema customizável
- Suporte a modo escuro (em desenvolvimento)

## 📝 Notas

- O app está configurado para ambiente de desenvolvimento
- Para produção, configure as variáveis de ambiente adequadas
- Certifique-se que o backend está rodando antes de testar
