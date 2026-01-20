package view;

import model.ContaBancaria;
import model.Usuario;
import service.ContaBancariaService;
import service.UsuarioService;

import java.sql.SQLException;
import java.util.Scanner;

public class SistemaBancario {
    private Scanner input;
    private ContaBancaria conta;
    private Usuario usuario;
    private UsuarioService usuarioService;
    private ContaBancariaService contaService;

    public SistemaBancario() {
        this.input = new Scanner(System.in);
        this.usuarioService = new UsuarioService();
        this.contaService = new ContaBancariaService();
    }

    public void executar() {
        exibirMenuPrincipal();
    }

    private void exibirMenuPrincipal() {
        while (true) {
            limparTela();
            exibirCabecalho();
            System.out.println("╔════════════════════════════════════════╗");
            System.out.println("║         MENU PRINCIPAL                 ║");
            System.out.println("╠════════════════════════════════════════╣");
            System.out.println("║  1 - Login                             ║");
            System.out.println("║  2 - Registrar novo usuário            ║");
            System.out.println("║  3 - Sair                              ║");
            System.out.println("╚════════════════════════════════════════╝");
            System.out.print("→ Escolha uma opção: ");
            
            int opcao = lerOpcao();
            
            switch (opcao) {
                case 1:
                    realizarLogin();
                    break;
                case 2:
                    registrarNovoUsuario();
                    break;
                case 3:
                    System.out.println("\n✓ Obrigado por usar o IBank!");
                    return;
                default:
                    exibirErro("Opção inválida!");
                    aguardarEnter();
            }
        }
    }

    private void exibirCabecalho() {
        System.out.println("╔════════════════════════════════════════╗");
        System.out.println("║         IBANK - Sistema Bancário       ║");
        System.out.println("║         Seu banco digital seguro       ║");
        System.out.println("╚════════════════════════════════════════╝\n");
    }

    private void realizarLogin() {
        limparTela();
        exibirCabecalho();
        System.out.println("═══════════════ LOGIN ═══════════════\n");
        System.out.print("CPF (000.000.000-00): ");
        String cpf = input.nextLine();
        
        try {
            usuario = usuarioService.buscarPorCpf(cpf);
            
            if (usuario == null) {
                exibirErro("Usuário não encontrado!");
                aguardarEnter();
                return;
            }
            
            conta = contaService.buscarPorCpfTitular(cpf);
            
            if (conta == null) {
                exibirErro("Conta não encontrada!");
                aguardarEnter();
                return;
            }
            
            if (autenticar()) {
                exibirSucesso("Login realizado com sucesso!");
                System.out.println("Bem-vindo(a), " + usuario.getNomeCompleto());
                aguardarEnter();
                exibirMenuBancario();
            } else {
                exibirErro("Código de segurança inválido!");
                aguardarEnter();
            }
            
        } catch (SQLException e) {
            exibirErro("Erro ao realizar login: " + e.getMessage());
            aguardarEnter();
        }
    }

    private boolean autenticar() {
        System.out.print("Código de segurança (6 dígitos): ");
        int codigoDigitado = lerInt();
        return conta.autenticar(codigoDigitado);
    }

    private void registrarNovoUsuario() {
        limparTela();
        exibirCabecalho();
        System.out.println("═══════ REGISTRO DE NOVO USUÁRIO ═══════\n");
        
        System.out.print("Nome: ");
        String nome = input.nextLine();
        
        System.out.print("Sobrenome: ");
        String sobrenome = input.nextLine();
        
        System.out.print("CPF (000.000.000-00): ");
        String cpf = input.nextLine();
        
        System.out.print("RG: ");
        String rg = input.nextLine();
        
        System.out.print("Telefone: ");
        String telefone = input.nextLine();
        
        System.out.print("Email: ");
        String email = input.nextLine();
        
        System.out.print("Nome da mãe: ");
        String nomeMae = input.nextLine();
        
        System.out.print("Nome do pai: ");
        String nomePai = input.nextLine();
        
        System.out.print("Escolaridade: ");
        String escolaridade = input.nextLine();
        
        System.out.print("Estado civil: ");
        String estadoCivil = input.nextLine();
        
        System.out.print("Nacionalidade: ");
        String nacionalidade = input.nextLine();
        
        System.out.print("Naturalidade: ");
        String naturalidade = input.nextLine();
        
        System.out.print("Sexo: ");
        String sexo = input.nextLine();
        
        System.out.print("Ano de nascimento: ");
        int anoNascimento = lerInt();
        
        System.out.print("Idade: ");
        int idade = lerInt();
        
        System.out.print("Profissão: ");
        String profissao = input.nextLine();
        
        System.out.print("Empresa: ");
        String empresa = input.nextLine();
        
        System.out.print("Cargo: ");
        String cargo = input.nextLine();
        
        System.out.print("Departamento: ");
        String departamento = input.nextLine();
        
        System.out.print("Endereço completo: ");
        String endereco = input.nextLine();
        
        System.out.print("Código de segurança (6 dígitos): ");
        int codigoSeguranca = lerInt();
        
        try {
            usuario = usuarioService.registrarUsuario(
                nome, sobrenome, cpf, rg, telefone, email, nomeMae, nomePai,
                escolaridade, estadoCivil, nacionalidade, naturalidade, sexo,
                anoNascimento, idade, profissao, empresa, cargo, departamento, endereco
            );
            
            conta = contaService.criarConta(usuario, "Corrente", 0.0, 1000.0, codigoSeguranca);
            
            limparTela();
            exibirSucesso("CADASTRO REALIZADO COM SUCESSO!");
            System.out.println("\n╔════════════════════════════════════════╗");
            System.out.println("║         DADOS DA CONTA                 ║");
            System.out.println("╠════════════════════════════════════════╣");
            System.out.printf("║  Usuário: %-28s ║%n", usuario.getNomeCompleto());
            System.out.printf("║  Conta: %-30s ║%n", conta.getNumeroConta());
            System.out.printf("║  Agência: %-28s ║%n", conta.getAgencia());
            System.out.printf("║  Banco: %-30s ║%n", conta.getBanco());
            System.out.println("╚════════════════════════════════════════╝");
            aguardarEnter();
            
        } catch (SQLException e) {
            exibirErro("Erro ao registrar usuário: " + e.getMessage());
            aguardarEnter();
        }
    }

    private void exibirMenuBancario() {
        int opcao = 0;

        while (opcao != 7) {
            limparTela();
            exibirCabecalho();
            exibirInfoConta();
            System.out.println("\n╔════════════════════════════════════════╗");
            System.out.println("║         MENU PRINCIPAL                 ║");
            System.out.println("╠════════════════════════════════════════╣");
            System.out.println("║  1 → Minha Conta                       ║");
            System.out.println("║  2 → Transações                        ║");
            System.out.println("║  3 → Pagamentos                        ║");
            System.out.println("║  4 → Empréstimos                       ║");
            System.out.println("║  5 → Investimentos                     ║");
            System.out.println("║  6 → Configurações                     ║");
            System.out.println("║  7 → Sair                              ║");
            System.out.println("╚════════════════════════════════════════╝");
            System.out.print("→ Escolha uma opção: ");
            opcao = lerOpcao();

            switch (opcao) {
                case 1:
                    menuMinhaConta();
                    break;
                case 2:
                    menuTransacoes();
                    break;
                case 3:
                    menuPagamentos();
                    break;
                case 4:
                    menuEmprestimos();
                    break;
                case 5:
                    menuInvestimentos();
                    break;
                case 6:
                    menuConfiguracoes();
                    break;
                case 7:
                    exibirSucesso("Encerrando sessão...");
                    aguardarEnter();
                    break;
                default:
                    exibirErro("Opção inválida!");
                    aguardarEnter();
                    break;
            }
        }
    }

    private void exibirInfoConta() {
        System.out.println("╔════════════════════════════════════════╗");
        System.out.printf("║  Conta: %-30s ║%n", conta.getNumeroConta());
        System.out.printf("║  Titular: %-28s ║%n", usuario.getNomeCompleto().substring(0, Math.min(28, usuario.getNomeCompleto().length())));
        System.out.printf("║  Saldo: R$ %,23.2f ║%n", conta.getSaldo());
        System.out.println("╚════════════════════════════════════════╝");
    }

    private void menuMinhaConta() {
        int opcao = 0;

        while (opcao != 6) {
            limparTela();
            System.out.println("╔════════════════════════════════════════╗");
            System.out.println("║         MINHA CONTA                    ║");
            System.out.println("╠════════════════════════════════════════╣");
            System.out.println("║  1 - Ver saldo e limites               ║");
            System.out.println("║  2 - Extrato detalhado                 ║");
            System.out.println("║  3 - Dados da conta                    ║");
            System.out.println("║  4 - Dados pessoais                    ║");
            System.out.println("║  5 - Chaves PIX cadastradas            ║");
            System.out.println("║  6 - Voltar                            ║");
            System.out.println("╚════════════════════════════════════════╝");
            System.out.print("→ Escolha uma opção: ");
            opcao = lerOpcao();

            try {
                switch (opcao) {
                    case 1:
                        verSaldo();
                        break;
                    case 2:
                        exibirExtrato();
                        break;
                    case 3:
                        verDadosConta();
                        break;
                    case 4:
                        verDadosPessoais();
                        break;
                    case 5:
                        verChavesPix();
                        break;
                    case 6:
                        break;
                    default:
                        exibirErro("Opção inválida!");
                        aguardarEnter();
                        break;
                }
            } catch (SQLException e) {
                exibirErro("Erro: " + e.getMessage());
                aguardarEnter();
            }
        }
    }

    private void menuTransacoes() {
        int opcao = 0;

        while (opcao != 5) {
            limparTela();
            System.out.println("╔════════════════════════════════════════╗");
            System.out.println("║         TRANSAÇÕES                     ║");
            System.out.println("╠════════════════════════════════════════╣");
            System.out.println("║  1 - Depósito                          ║");
            System.out.println("║  2 - Saque                             ║");
            System.out.println("║  3 - Transferência (TED/DOC)           ║");
            System.out.println("║  4 - PIX                               ║");
            System.out.println("║  5 - Voltar                            ║");
            System.out.println("╚════════════════════════════════════════╝");
            System.out.print("→ Escolha uma opção: ");
            opcao = lerOpcao();

            try {
                switch (opcao) {
                    case 1:
                        realizarDeposito();
                        break;
                    case 2:
                        realizarSaque();
                        break;
                    case 3:
                        realizarTransferencia();
                        break;
                    case 4:
                        menuPix();
                        break;
                    case 5:
                        break;
                    default:
                        exibirErro("Opção inválida!");
                        aguardarEnter();
                        break;
                }
            } catch (SQLException e) {
                exibirErro("Erro: " + e.getMessage());
                aguardarEnter();
            }
        }
    }

    private void menuPix() {
        int opcao = 0;

        while (opcao != 4) {
            limparTela();
            System.out.println("╔════════════════════════════════════════╗");
            System.out.println("║              PIX                       ║");
            System.out.println("╠════════════════════════════════════════╣");
            System.out.println("║  1 - Enviar PIX                        ║");
            System.out.println("║  2 - Cadastrar chave PIX               ║");
            System.out.println("║  3 - Minhas chaves PIX                 ║");
            System.out.println("║  4 - Voltar                            ║");
            System.out.println("╚════════════════════════════════════════╝");
            System.out.print("→ Escolha uma opção: ");
            opcao = lerOpcao();

            try {
                switch (opcao) {
                    case 1:
                        realizarPix();
                        break;
                    case 2:
                        cadastrarChavePix();
                        break;
                    case 3:
                        verChavesPix();
                        break;
                    case 4:
                        break;
                    default:
                        exibirErro("Opção inválida!");
                        aguardarEnter();
                        break;
                }
            } catch (SQLException e) {
                exibirErro("Erro: " + e.getMessage());
                aguardarEnter();
            }
        }
    }

    private void menuPagamentos() {
        int opcao = 0;

        while (opcao != 6) {
            limparTela();
            System.out.println("╔════════════════════════════════════════╗");
            System.out.println("║         PAGAMENTOS                     ║");
            System.out.println("╠════════════════════════════════════════╣");
            System.out.println("║  1 - Pagar conta de luz                ║");
            System.out.println("║  2 - Pagar conta de água               ║");
            System.out.println("║  3 - Pagar conta de telefone           ║");
            System.out.println("║  4 - Pagar boleto                      ║");
            System.out.println("║  5 - Histórico de pagamentos           ║");
            System.out.println("║  6 - Voltar                            ║");
            System.out.println("╚════════════════════════════════════════╝");
            System.out.print("→ Escolha uma opção: ");
            opcao = lerOpcao();

            try {
                switch (opcao) {
                    case 1:
                        pagarConta("CONTA_LUZ", "Conta de Luz");
                        break;
                    case 2:
                        pagarConta("CONTA_AGUA", "Conta de Água");
                        break;
                    case 3:
                        pagarConta("CONTA_TELEFONE", "Conta de Telefone");
                        break;
                    case 4:
                        pagarConta("BOLETO", "Boleto");
                        break;
                    case 5:
                        verHistoricoPagamentos();
                        break;
                    case 6:
                        break;
                    default:
                        exibirErro("Opção inválida!");
                        aguardarEnter();
                        break;
                }
            } catch (SQLException e) {
                exibirErro("Erro: " + e.getMessage());
                aguardarEnter();
            }
        }
    }

    private void menuEmprestimos() {
        int opcao = 0;

        while (opcao != 4) {
            limparTela();
            System.out.println("╔════════════════════════════════════════╗");
            System.out.println("║         EMPRÉSTIMOS                    ║");
            System.out.println("╠════════════════════════════════════════╣");
            System.out.println("║  1 - Simular empréstimo                ║");
            System.out.println("║  2 - Solicitar empréstimo              ║");
            System.out.println("║  3 - Meus empréstimos                  ║");
            System.out.println("║  4 - Voltar                            ║");
            System.out.println("╚════════════════════════════════════════╝");
            System.out.print("→ Escolha uma opção: ");
            opcao = lerOpcao();

            switch (opcao) {
                case 1:
                    simularEmprestimo();
                    break;
                case 2:
                    solicitarEmprestimo();
                    break;
                case 3:
                    verMeusEmprestimos();
                    break;
                case 4:
                    break;
                default:
                    exibirErro("Opção inválida!");
                    aguardarEnter();
                    break;
            }
        }
    }

    private void menuInvestimentos() {
        limparTela();
        System.out.println("╔════════════════════════════════════════╗");
        System.out.println("║         INVESTIMENTOS                  ║");
        System.out.println("╠════════════════════════════════════════╣");
        System.out.println("║  Em breve:                             ║");
        System.out.println("║  • Poupança                            ║");
        System.out.println("║  • CDB                                 ║");
        System.out.println("║  • Tesouro Direto                      ║");
        System.out.println("║  • Fundos de Investimento              ║");
        System.out.println("╚════════════════════════════════════════╝");
        System.out.println("\n⏳ Funcionalidade em desenvolvimento...");
        aguardarEnter();
    }

    private void menuConfiguracoes() {
        int opcao = 0;

        while (opcao != 5) {
            limparTela();
            System.out.println("╔════════════════════════════════════════╗");
            System.out.println("║         CONFIGURAÇÕES                  ║");
            System.out.println("╠════════════════════════════════════════╣");
            System.out.println("║  1 - Alterar senha                     ║");
            System.out.println("║  2 - Gerenciar chaves PIX              ║");
            System.out.println("║  3 - Limites de transação              ║");
            System.out.println("║  4 - Notificações                      ║");
            System.out.println("║  5 - Voltar                            ║");
            System.out.println("╚════════════════════════════════════════╝");
            System.out.print("→ Escolha uma opção: ");
            opcao = lerOpcao();

            try {
                switch (opcao) {
                    case 1:
                        alterarSenha();
                        break;
                    case 2:
                        menuPix();
                        break;
                    case 3:
                        verLimites();
                        break;
                    case 4:
                        System.out.println("\n⏳ Funcionalidade em desenvolvimento...");
                        aguardarEnter();
                        break;
                    case 5:
                        break;
                    default:
                        exibirErro("Opção inválida!");
                        aguardarEnter();
                        break;
                }
            } catch (SQLException e) {
                exibirErro("Erro: " + e.getMessage());
                aguardarEnter();
            }
        }
    }

    private void verSaldo() {
        limparTela();
        System.out.println("╔════════════════════════════════════════╗");
        System.out.println("║         SALDO E LIMITES                ║");
        System.out.println("╠════════════════════════════════════════╣");
        System.out.printf("║  Saldo atual:       R$ %,14.2f ║%n", conta.getSaldo());
        System.out.printf("║  Limite crédito:    R$ %,14.2f ║%n", conta.getTotalDisponivel() - conta.getSaldo());
        System.out.printf("║  Total disponível:  R$ %,14.2f ║%n", conta.getTotalDisponivel());
        System.out.println("╚════════════════════════════════════════╝");
        aguardarEnter();
    }

    private void realizarDeposito() throws SQLException {
        limparTela();
        System.out.println("═══════════════ DEPÓSITO ═══════════════\n");
        System.out.print("Valor do depósito: R$ ");
        double valor = lerDouble();
        
        if (contaService.realizarDeposito(conta, valor)) {
            exibirSucesso("Depósito realizado com sucesso!");
            System.out.printf("Novo saldo: R$ %,.2f%n", conta.getSaldo());
        } else {
            exibirErro("Valor inválido para depósito!");
        }
        aguardarEnter();
    }

    private void realizarSaque() throws SQLException {
        limparTela();
        System.out.println("════════════════ SAQUE ═════════════════\n");
        System.out.print("Valor do saque: R$ ");
        double valor = lerDouble();
        
        if (contaService.realizarSaque(conta, valor)) {
            exibirSucesso("Saque realizado com sucesso!");
            System.out.printf("Novo saldo: R$ %,.2f%n", conta.getSaldo());
        } else {
            exibirErro("Saldo insuficiente ou valor inválido!");
        }
        aguardarEnter();
    }

    private void realizarTransferencia() throws SQLException {
        limparTela();
        System.out.println("══════════ TRANSFERÊNCIA ═══════════\n");
        System.out.print("Número da conta destino: ");
        String numeroContaDestino = input.nextLine();
        
        System.out.print("Valor da transferência: R$ ");
        double valor = lerDouble();
        
        if (contaService.realizarTransferencia(conta, numeroContaDestino, valor)) {
            exibirSucesso("Transferência realizada com sucesso!");
            System.out.printf("Novo saldo: R$ %,.2f%n", conta.getSaldo());
        } else {
            exibirErro("Falha na transferência. Verifique o saldo.");
        }
        aguardarEnter();
    }

    private void realizarPix() throws SQLException {
        limparTela();
        System.out.println("═══════════════ PIX ════════════════\n");
        System.out.print("Chave PIX (CPF, Email, Telefone): ");
        String chavePix = input.nextLine();
        
        System.out.print("Valor do PIX: R$ ");
        double valor = lerDouble();
        
        if (contaService.realizarPix(conta, chavePix, valor)) {
            exibirSucesso("PIX realizado com sucesso!");
            System.out.printf("Novo saldo: R$ %,.2f%n", conta.getSaldo());
        } else {
            exibirErro("Falha no PIX. Verifique o saldo.");
        }
        aguardarEnter();
    }

    private void realizarPagamento() throws SQLException {
        limparTela();
        System.out.println("═══════ PAGAMENTO DE CONTAS ════════\n");
        System.out.println("Tipos de pagamento:");
        System.out.println("1 - Conta de Luz");
        System.out.println("2 - Conta de Água");
        System.out.println("3 - Conta de Telefone");
        System.out.println("4 - Boleto");
        System.out.println("5 - Outros");
        System.out.print("\nTipo: ");
        int tipo = lerOpcao();
        
        String[] tipos = {"", "CONTA_LUZ", "CONTA_AGUA", "CONTA_TELEFONE", "BOLETO", "OUTROS"};
        if (tipo < 1 || tipo > 5) {
            exibirErro("Tipo inválido!");
            aguardarEnter();
            return;
        }
        
        System.out.print("Código de barras: ");
        String codigoBarras = input.nextLine();
        
        System.out.print("Valor: R$ ");
        double valor = lerDouble();
        
        System.out.print("Descrição: ");
        String descricao = input.nextLine();
        
        if (contaService.pagarConta(conta, tipos[tipo], codigoBarras, valor, descricao)) {
            exibirSucesso("Pagamento realizado com sucesso!");
            System.out.printf("Novo saldo: R$ %,.2f%n", conta.getSaldo());
        } else {
            exibirErro("Falha no pagamento. Saldo insuficiente.");
        }
        aguardarEnter();
    }

    private void pagarConta(String tipoPagamento, String descricaoTipo) throws SQLException {
        limparTela();
        System.out.println("═══════ PAGAMENTO: " + descricaoTipo.toUpperCase() + " ════════\n");
        
        System.out.print("Código de barras: ");
        String codigoBarras = input.nextLine();
        
        System.out.print("Valor: R$ ");
        double valor = lerDouble();
        
        System.out.print("Descrição adicional (opcional): ");
        String descricao = input.nextLine();
        
        if (descricao.isEmpty()) {
            descricao = descricaoTipo;
        }
        
        System.out.println("\n╔════════════════════════════════════════╗");
        System.out.println("║       CONFIRMAR PAGAMENTO              ║");
        System.out.println("╠════════════════════════════════════════╣");
        System.out.printf("║  Tipo: %-32s ║%n", descricaoTipo);
        System.out.printf("║  Valor: R$ %,24.2f ║%n", valor);
        System.out.printf("║  Descrição: %-27s ║%n", descricao.substring(0, Math.min(27, descricao.length())));
        System.out.println("╚════════════════════════════════════════╝");
        
        System.out.print("\nConfirmar pagamento? (S/N): ");
        String confirmacao = input.nextLine();
        
        if (!confirmacao.equalsIgnoreCase("S")) {
            exibirErro("Pagamento cancelado.");
            aguardarEnter();
            return;
        }
        
        if (contaService.pagarConta(conta, tipoPagamento, codigoBarras, valor, descricao)) {
            exibirSucesso("Pagamento realizado com sucesso!");
            System.out.printf("Novo saldo: R$ %,.2f%n", conta.getSaldo());
        } else {
            exibirErro("Falha no pagamento. Saldo insuficiente.");
        }
        aguardarEnter();
    }

    private void verDadosConta() {
        limparTela();
        System.out.println("╔════════════════════════════════════════╗");
        System.out.println("║         DADOS DA CONTA                 ║");
        System.out.println("╠════════════════════════════════════════╣");
        System.out.printf("║  Banco: %-30s ║%n", conta.getBanco());
        System.out.printf("║  Agência: %-28s ║%n", conta.getAgencia());
        System.out.printf("║  Conta: %-30s ║%n", conta.getNumeroConta());
        System.out.printf("║  Titular: %-28s ║%n", conta.getTitular().substring(0, Math.min(28, conta.getTitular().length())));
        System.out.printf("║  CPF: %-32s ║%n", conta.getCpfTitular());
        System.out.printf("║  Status: %-29s ║%n", conta.getStatusConta());
        System.out.println("╚════════════════════════════════════════╝");
        aguardarEnter();
    }

    private void verDadosPessoais() {
        limparTela();
        System.out.println("╔════════════════════════════════════════╗");
        System.out.println("║         DADOS PESSOAIS                 ║");
        System.out.println("╠════════════════════════════════════════╣");
        System.out.printf("║  Nome: %-32s ║%n", usuario.getNomeCompleto().substring(0, Math.min(32, usuario.getNomeCompleto().length())));
        System.out.printf("║  CPF: %-33s ║%n", usuario.getCpf());
        System.out.printf("║  RG: %-34s ║%n", usuario.getRg());
        System.out.printf("║  Email: %-31s ║%n", usuario.getEmail().substring(0, Math.min(31, usuario.getEmail().length())));
        System.out.printf("║  Telefone: %-28s ║%n", usuario.getTelefone());
        System.out.printf("║  Idade: %-31d ║%n", usuario.getIdade());
        System.out.printf("║  Estado Civil: %-24s ║%n", usuario.getEstadoCivil());
        System.out.printf("║  Profissão: %-27s ║%n", usuario.getProfissao().substring(0, Math.min(27, usuario.getProfissao().length())));
        System.out.println("╚════════════════════════════════════════╝");
        aguardarEnter();
    }

    private void cadastrarChavePix() throws SQLException {
        limparTela();
        System.out.println("═══════ CADASTRAR CHAVE PIX ════════\n");
        System.out.println("Tipos de chave:");
        System.out.println("1 - CPF");
        System.out.println("2 - Email");
        System.out.println("3 - Telefone");
        System.out.println("4 - Chave aleatória");
        System.out.print("\nTipo: ");
        int tipo = lerOpcao();
        
        String[] tipos = {"", "CPF", "EMAIL", "TELEFONE", "ALEATORIA"};
        if (tipo < 1 || tipo > 4) {
            exibirErro("Tipo inválido!");
            aguardarEnter();
            return;
        }
        
        String chave;
        if (tipo == 1) {
            chave = usuario.getCpf();
        } else if (tipo == 2) {
            chave = usuario.getEmail();
        } else if (tipo == 3) {
            chave = usuario.getTelefone();
        } else {
            chave = java.util.UUID.randomUUID().toString();
        }
        
        String sql = "INSERT INTO chaves_pix (conta_numero, tipo_chave, chave) VALUES (?, ?, ?)";
        try (var conn = util.ConnectionManager.getConnection();
             var stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, conta.getNumeroConta());
            stmt.setString(2, tipos[tipo]);
            stmt.setString(3, chave);
            
            stmt.executeUpdate();
            exibirSucesso("Chave PIX cadastrada com sucesso!");
            System.out.println("Chave: " + chave);
        } catch (SQLException e) {
            if (e.getMessage().contains("Duplicate entry")) {
                exibirErro("Esta chave já está cadastrada!");
            } else {
                throw e;
            }
        }
        aguardarEnter();
    }

    private void verChavesPix() throws SQLException {
        limparTela();
        System.out.println("╔════════════════════════════════════════════════════════════════╗");
        System.out.println("║                    MINHAS CHAVES PIX                           ║");
        System.out.println("╚════════════════════════════════════════════════════════════════╝\n");
        
        String sql = "SELECT tipo_chave, chave, ativa, data_criacao FROM chaves_pix WHERE conta_numero = ?";
        
        try (var conn = util.ConnectionManager.getConnection();
             var stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, conta.getNumeroConta());
            
            try (var rs = stmt.executeQuery()) {
                boolean temChaves = false;
                while (rs.next()) {
                    temChaves = true;
                    String tipo = rs.getString("tipo_chave");
                    String chave = rs.getString("chave");
                    boolean ativa = rs.getBoolean("ativa");
                    String data = rs.getString("data_criacao");
                    
                    System.out.println("═══════════════════════════════════════════════════════════════");
                    System.out.println("Tipo: " + tipo);
                    System.out.println("Chave: " + chave);
                    System.out.println("Status: " + (ativa ? "✓ Ativa" : "✗ Inativa"));
                    System.out.println("Cadastrada em: " + data.substring(0, 19));
                    System.out.println();
                }
                
                if (!temChaves) {
                    System.out.println("Nenhuma chave PIX cadastrada.");
                }
            }
        }
        aguardarEnter();
    }

    private void verHistoricoPagamentos() throws SQLException {
        limparTela();
        System.out.println("╔════════════════════════════════════════════════════════════════╗");
        System.out.println("║              HISTÓRICO DE PAGAMENTOS                           ║");
        System.out.println("╚════════════════════════════════════════════════════════════════╝\n");
        
        String sql = "SELECT tipo_pagamento, valor, descricao, data_pagamento FROM pagamentos WHERE conta_numero = ? ORDER BY data_pagamento DESC LIMIT 10";
        
        try (var conn = util.ConnectionManager.getConnection();
             var stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, conta.getNumeroConta());
            
            try (var rs = stmt.executeQuery()) {
                boolean temPagamentos = false;
                while (rs.next()) {
                    temPagamentos = true;
                    String tipo = rs.getString("tipo_pagamento");
                    double valor = rs.getDouble("valor");
                    String descricao = rs.getString("descricao");
                    String data = rs.getString("data_pagamento");
                    
                    System.out.printf("%s | %s | R$ %,.2f | %s%n", 
                        data.substring(0, 19), tipo, valor, descricao);
                }
                
                if (!temPagamentos) {
                    System.out.println("Nenhum pagamento realizado ainda.");
                }
            }
        }
        aguardarEnter();
    }

    private void simularEmprestimo() {
        limparTela();
        System.out.println("═══════ SIMULAÇÃO DE EMPRÉSTIMO ════════\n");
        
        System.out.print("Valor desejado: R$ ");
        double valor = lerDouble();
        
        System.out.print("Número de parcelas (6, 12, 24, 36, 48): ");
        int parcelas = lerInt();
        
        double taxa = 2.5; // Taxa mensal fictícia
        double valorTotal = valor * Math.pow(1 + taxa/100, parcelas);
        double valorParcela = valorTotal / parcelas;
        
        System.out.println("\n╔════════════════════════════════════════╗");
        System.out.println("║       SIMULAÇÃO                        ║");
        System.out.println("╠════════════════════════════════════════╣");
        System.out.printf("║  Valor solicitado: R$ %,13.2f ║%n", valor);
        System.out.printf("║  Parcelas: %-28d ║%n", parcelas);
        System.out.printf("║  Taxa de juros: %-22.2f%% ║%n", taxa);
        System.out.printf("║  Valor da parcela: R$ %,13.2f ║%n", valorParcela);
        System.out.printf("║  Valor total: R$ %,18.2f ║%n", valorTotal);
        System.out.println("╚════════════════════════════════════════╝");
        
        aguardarEnter();
    }

    private void solicitarEmprestimo() {
        limparTela();
        System.out.println("═══════ SOLICITAR EMPRÉSTIMO ════════\n");
        
        System.out.print("Valor desejado: R$ ");
        double valor = lerDouble();
        
        System.out.print("Número de parcelas (6, 12, 24, 36, 48): ");
        int parcelas = lerInt();
        
        System.out.print("\nConfirmar solicitação? (S/N): ");
        String confirmacao = input.nextLine();
        
        if (confirmacao.equalsIgnoreCase("S")) {
            exibirSucesso("Solicitação enviada para análise!");
            System.out.println("Você receberá uma resposta em até 24h.");
        } else {
            exibirErro("Solicitação cancelada.");
        }
        
        aguardarEnter();
    }

    private void verMeusEmprestimos() {
        limparTela();
        System.out.println("╔════════════════════════════════════════╗");
        System.out.println("║         MEUS EMPRÉSTIMOS               ║");
        System.out.println("╚════════════════════════════════════════╝\n");
        
        System.out.println("Nenhum empréstimo ativo no momento.");
        
        aguardarEnter();
    }

    private void verLimites() {
        limparTela();
        System.out.println("╔════════════════════════════════════════╗");
        System.out.println("║         LIMITES DE TRANSAÇÃO           ║");
        System.out.println("╠════════════════════════════════════════╣");
        System.out.printf("║  PIX diário:        R$ %,14.2f ║%n", 5000.00);
        System.out.printf("║  Transferência:     R$ %,14.2f ║%n", 10000.00);
        System.out.printf("║  Saque diário:      R$ %,14.2f ║%n", 3000.00);
        System.out.println("╚════════════════════════════════════════╝");
        aguardarEnter();
    }

    private void exibirExtrato() throws SQLException {
        limparTela();
        System.out.println("╔════════════════════════════════════════════════════════════════════════════════════════════╗");
        System.out.println("║                                    EXTRATO DETALHADO                                       ║");
        System.out.println("╚════════════════════════════════════════════════════════════════════════════════════════════╝\n");
        
        var extrato = contaService.obterExtrato(conta.getNumeroConta(), 15);
        
        if (extrato.isEmpty()) {
            System.out.println("Nenhuma transação realizada ainda.");
        } else {
            for (String transacao : extrato) {
                System.out.println(transacao);
            }
        }
        aguardarEnter();
    }

    private void alterarSenha() throws SQLException {
        limparTela();
        System.out.println("═══════ ALTERAR SENHA ════════\n");
        System.out.print("Código atual: ");
        int codigoAtual = lerInt();
        
        System.out.print("Novo código (6 dígitos): ");
        int codigoNovo = lerInt();
        
        System.out.print("Confirme o novo código: ");
        int confirmacao = lerInt();
        
        if (codigoNovo != confirmacao) {
            exibirErro("Códigos não conferem!");
            aguardarEnter();
            return;
        }
        
        if (contaService.alterarCodigoSeguranca(conta, codigoAtual, codigoNovo)) {
            exibirSucesso("Senha alterada com sucesso!");
        } else {
            exibirErro("Código atual incorreto!");
        }
        aguardarEnter();
    }

    private void limparTela() {
        System.out.print("\033[H\033[2J");
        System.out.flush();
    }

    private void exibirSucesso(String mensagem) {
        System.out.println("\n✓ " + mensagem);
    }

    private void exibirErro(String mensagem) {
        System.out.println("\n✗ " + mensagem);
    }

    private void aguardarEnter() {
        System.out.print("\nPressione ENTER para continuar...");
        input.nextLine();
    }

    private int lerOpcao() {
        try {
            int opcao = input.nextInt();
            input.nextLine();
            return opcao;
        } catch (Exception e) {
            input.nextLine();
            return -1;
        }
    }

    private int lerInt() {
        try {
            int valor = input.nextInt();
            input.nextLine();
            return valor;
        } catch (Exception e) {
            input.nextLine();
            return 0;
        }
    }

    private double lerDouble() {
        try {
            double valor = input.nextDouble();
            input.nextLine();
            return valor;
        } catch (Exception e) {
            input.nextLine();
            return 0.0;
        }
    }

    public void fechar() {
        input.close();
    }
}
