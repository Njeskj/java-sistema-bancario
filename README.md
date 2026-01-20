# 🏦 IBank - Sistema Bancário Digital

Sistema bancário completo desenvolvido em Java com arquitetura em camadas, banco de dados MySQL e interface de terminal interativa.

## 📋 Sobre o Projeto

O IBank é um sistema bancário digital que simula operações reais de um banco moderno, incluindo transações financeiras, PIX, pagamentos de contas, empréstimos e muito mais. Desenvolvido com foco em boas práticas de programação, segurança e experiência do usuário.

## ✨ Funcionalidades

### 🔐 Autenticação e Cadastro
- Login seguro com CPF e código de 6 dígitos
- Registro completo de novos usuários
- Validação de dados e unicidade de CPF

### 💰 Minha Conta
- Visualização de saldo e limites
- Extrato detalhado com histórico de transações
- Consulta de dados pessoais e da conta
- Gerenciamento de chaves PIX cadastradas

### 💸 Transações
- **Depósito**: Adicionar valores à conta
- **Saque**: Retirar valores com validação de saldo
- **Transferência TED/DOC**: Entre contas do banco
- **PIX**: Transferências instantâneas via chave PIX
  - Suporte para CPF, Email, Telefone e Chave Aleatória
  - Cadastro e gerenciamento de chaves

### 🧾 Pagamentos
- Pagamento de conta de luz
- Pagamento de conta de água
- Pagamento de conta de telefone
- Pagamento de boletos
- Histórico completo de pagamentos realizados

### 💳 Empréstimos
- Simulação de empréstimos com cálculo de juros
- Solicitação de empréstimos
- Acompanhamento de empréstimos ativos

### ⚙️ Configurações
- Alteração de senha (código de segurança)
- Gerenciamento de chaves PIX
- Visualização de limites de transação
- Sistema de notificações (em desenvolvimento)

### 📊 Investimentos
- Funcionalidade em desenvolvimento
- Planejamento: Poupança, CDB, Tesouro Direto, Fundos

## 🛠️ Tecnologias Utilizadas

- **Java** - Linguagem de programação principal
- **MySQL** - Banco de dados relacional
- **JDBC** - Conectividade com banco de dados
- **MySQL Connector/J 8.3.0** - Driver JDBC para MySQL
- **Git** - Controle de versão

## 📁 Arquitetura do Projeto

O projeto utiliza **Arquitetura em Camadas (Layered Architecture)** para separação de responsabilidades:

```
src/
├── model/              # Camada de Modelo (Entidades)
│   ├── Usuario.java
│   └── ContaBancaria.java
│
├── dao/                # Camada de Acesso a Dados (Data Access Objects)
│   ├── UsuarioDAO.java
│   └── ContaBancariaDAO.java
│
├── service/            # Camada de Serviço (Lógica de Negócio)
│   ├── UsuarioService.java
│   └── ContaBancariaService.java
│
├── util/               # Camada de Utilitários
│   └── ConnectionManager.java
│
├── view/               # Camada de Apresentação (Interface)
│   └── SistemaBancario.java
│
└── Main.java           # Ponto de entrada da aplicação
```

### Descrição das Camadas

- **Model**: Entidades que representam os dados do sistema
- **DAO**: Responsável pela comunicação direta com o banco de dados
- **Service**: Contém as regras de negócio e validações
- **Util**: Componentes auxiliares reutilizáveis
- **View**: Interface com o usuário (menus e interações)

## 🗄️ Banco de Dados

O sistema utiliza as seguintes tabelas:

- **usuarios**: Dados cadastrais dos clientes
- **contas**: Informações das contas bancárias
- **transacoes**: Registro de todas as operações
- **pagamentos**: Histórico de pagamentos de contas
- **emprestimos**: Controle de empréstimos
- **chaves_pix**: Gerenciamento de chaves PIX

## 🚀 Como Executar

### Pré-requisitos

- Java JDK 8 ou superior
- MySQL Server
- MySQL Connector/J 8.3.0

### Configuração do Banco de Dados

1. Execute o script SQL para criar o banco de dados:
```bash
mysql -u root < database.sql
```

Ou use o PowerShell:
```powershell
Get-Content database.sql | mysql -u root
```

### Compilação

```bash
javac -cp mysql-connector-j-8.3.0.jar -d bin src/**/*.java src/*.java
```

### Execução

```bash
java -cp "bin;mysql-connector-j-8.3.0.jar" Main
```

## 🔑 Dados de Teste

Para testar o sistema, use as seguintes credenciais:

- **CPF**: 000.000.000-00
- **Código de Segurança**: 123456
- **Saldo Inicial**: R$ 5.000,00
- **Limite de Crédito**: R$ 10.000,00

## 📊 Funcionalidades Técnicas

### Segurança
- Senhas armazenadas como código numérico
- Validação de CPF único
- Autenticação obrigatória para todas as operações
- Transações com confirmação

### Performance
- Índices otimizados no banco de dados
- Uso de PreparedStatement para prevenir SQL Injection
- ConnectionManager para gerenciamento eficiente de conexões

### Interface
- Menus hierárquicos intuitivos
- Design visual com caracteres especiais (╔═╗║)
- Mensagens de sucesso e erro coloridas
- Navegação por submenus
- Validação de entrada do usuário

## 📝 Boas Práticas Implementadas

- ✅ Arquitetura em camadas
- ✅ Separação de responsabilidades
- ✅ Uso de PreparedStatement
- ✅ Try-with-resources para gerenciamento de recursos
- ✅ Tratamento de exceções
- ✅ Código limpo e legível
- ✅ Nomenclatura clara de variáveis e métodos
- ✅ Foreign keys e constraints no banco de dados

## 🔄 Controle de Versão

O projeto utiliza Git para controle de versão. A pasta `.github/` contém configurações locais e não deve ser enviada ao repositório remoto.

## 👨‍💻 Autor

**Israel Silva**
- Email: israel.macedo.1711@gmail.com
- GitHub: [@Njeskj](https://github.com/Njeskj)

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais.

## 🚧 Funcionalidades Futuras

- [ ] Implementar sistema de investimentos (Poupança, CDB, Tesouro Direto, Fundos)
- [ ] Adicionar autenticação de dois fatores
- [ ] Desenvolver interface web/mobile
- [ ] Implementar notificações por email e SMS
- [ ] Adicionar relatórios em PDF
- [ ] Sistema de cashback e programa de pontos
- [ ] Integração com APIs externas de pagamento
- [ ] Dashboard administrativo
- [ ] API REST para integração

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

---

⭐ Se este projeto foi útil para você, considere dar uma estrela no repositório!
