package service;

import dao.ContaBancariaDAO;
import model.ContaBancaria;
import model.Usuario;
import util.ConnectionManager;

import java.sql.SQLException;

public class ContaBancariaService {
    private ContaBancariaDAO contaDAO;
    private static final String BANCO_PADRAO = "IBank";
    private static final String AGENCIA_PADRAO = "0001";
    private static int contadorContas = 1000000;
    
    public ContaBancariaService() {
        this.contaDAO = new ContaBancariaDAO();
    }
    
    public ContaBancaria criarConta(Usuario usuario, String tipoConta, double saldoInicial, 
                                    double limiteCredito, int codigoSeguranca) throws SQLException {
        
        // Gerar número de conta único
        String numeroConta = gerarNumeroConta();
        
        // Criar conta
        ContaBancaria conta = new ContaBancaria(
            BANCO_PADRAO,
            AGENCIA_PADRAO,
            numeroConta,
            tipoConta,
            usuario.getNomeCompleto(),
            usuario.getCpf(),
            saldoInicial,
            limiteCredito,
            codigoSeguranca
        );
        
        conta.setUsuarioId(usuario.getId());
        
        // Salvar no banco
        contaDAO.salvar(conta);
        
        return conta;
    }
    
    public boolean realizarDeposito(ContaBancaria conta, double valor) throws SQLException {
        if (conta.depositar(valor)) {
            contaDAO.atualizar(conta);
            registrarTransacao(conta, "DEPOSITO", valor, "Depósito realizado");
            return true;
        }
        return false;
    }
    
    public boolean realizarSaque(ContaBancaria conta, double valor) throws SQLException {
        if (conta.sacar(valor)) {
            contaDAO.atualizar(conta);
            registrarTransacao(conta, "SAQUE", valor, "Saque realizado");
            return true;
        }
        return false;
    }
    
    public boolean realizarTransferencia(ContaBancaria contaOrigem, String numeroContaDestino, 
                                        double valor) throws SQLException {
        
        ContaBancaria contaDestino = contaDAO.buscarPorNumeroConta(numeroContaDestino);
        
        if (contaDestino == null) {
            throw new SQLException("Conta destino não encontrada.");
        }
        
        if (contaOrigem.sacar(valor)) {
            contaDestino.depositar(valor);
            
            contaDAO.atualizar(contaOrigem);
            contaDAO.atualizar(contaDestino);
            
            registrarTransacao(contaOrigem, "TRANSFERENCIA_ENVIADA", valor, 
                             "Transferência para conta " + numeroContaDestino);
            registrarTransacao(contaDestino, "TRANSFERENCIA_RECEBIDA", valor, 
                             "Transferência de conta " + contaOrigem.getNumeroConta());
            
            return true;
        }
        
        return false;
    }
    
    public ContaBancaria buscarPorNumeroConta(String numeroConta) throws SQLException {
        return contaDAO.buscarPorNumeroConta(numeroConta);
    }
    
    public ContaBancaria buscarPorCpfTitular(String cpf) throws SQLException {
        return contaDAO.buscarPorCpfTitular(cpf);
    }
    
    private String gerarNumeroConta() {
        return String.format("%07d-0", contadorContas++);
    }
    
    private void registrarTransacao(ContaBancaria conta, String tipo, double valor, 
                                   String descricao) throws SQLException {
        registrarTransacao(conta.getNumeroConta(), null, tipo, valor, descricao, conta.getSaldo() - valor, conta.getSaldo());
    }
    
    private void registrarTransacao(String contaOrigem, String contaDestino, String tipo, 
                                   double valor, String descricao, double saldoAnterior, 
                                   double saldoPosterior) throws SQLException {
        String sql = "INSERT INTO transacoes (conta_origem, conta_destino, tipo, valor, descricao, saldo_anterior, saldo_posterior) VALUES (?, ?, ?, ?, ?, ?, ?)";
        
        try (var conn = ConnectionManager.getConnection();
             var stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, contaOrigem);
            stmt.setString(2, contaDestino);
            stmt.setString(3, tipo);
            stmt.setDouble(4, valor);
            stmt.setString(5, descricao);
            stmt.setDouble(6, saldoAnterior);
            stmt.setDouble(7, saldoPosterior);
            
            stmt.executeUpdate();
        }
    }
    
    public java.util.List<String> obterExtrato(String numeroConta, int limite) throws SQLException {
        java.util.List<String> extrato = new java.util.ArrayList<>();
        String sql = "SELECT tipo, valor, descricao, saldo_posterior, data_transacao FROM transacoes WHERE conta_origem = ? OR conta_destino = ? ORDER BY data_transacao DESC LIMIT ?";
        
        try (var conn = ConnectionManager.getConnection();
             var stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, numeroConta);
            stmt.setString(2, numeroConta);
            stmt.setInt(3, limite);
            
            try (var rs = stmt.executeQuery()) {
                while (rs.next()) {
                    String tipo = rs.getString("tipo");
                    double valor = rs.getDouble("valor");
                    String descricao = rs.getString("descricao");
                    double saldo = rs.getDouble("saldo_posterior");
                    String data = rs.getString("data_transacao");
                    
                    extrato.add(String.format("%s | %s | R$ %.2f | Saldo: R$ %.2f | %s", 
                        data.substring(0, 19), tipo, valor, saldo, descricao));
                }
            }
        }
        return extrato;
    }
    
    public boolean realizarPix(ContaBancaria contaOrigem, String chavePix, double valor) throws SQLException {
        // Buscar conta destino pela chave PIX
        String sqlChave = "SELECT conta_numero FROM chaves_pix WHERE chave = ? AND ativa = TRUE";
        String numeroContaDestino = null;
        
        try (var conn = ConnectionManager.getConnection();
             var stmt = conn.prepareStatement(sqlChave)) {
            
            stmt.setString(1, chavePix);
            try (var rs = stmt.executeQuery()) {
                if (rs.next()) {
                    numeroContaDestino = rs.getString("conta_numero");
                }
            }
        }
        
        if (numeroContaDestino == null) {
            throw new SQLException("Chave PIX não encontrada.");
        }
        
        ContaBancaria contaDestino = contaDAO.buscarPorNumeroConta(numeroContaDestino);
        
        if (contaDestino == null) {
            throw new SQLException("Conta destino não encontrada.");
        }
        
        double saldoAnteriorOrigem = contaOrigem.getSaldo();
        double saldoAnteriorDestino = contaDestino.getSaldo();
        
        if (contaOrigem.sacar(valor)) {
            contaDestino.depositar(valor);
            
            contaDAO.atualizar(contaOrigem);
            contaDAO.atualizar(contaDestino);
            
            registrarTransacao(contaOrigem.getNumeroConta(), numeroContaDestino, "PIX_ENVIADO", 
                             valor, "PIX para " + chavePix, saldoAnteriorOrigem, contaOrigem.getSaldo());
            registrarTransacao(numeroContaDestino, contaOrigem.getNumeroConta(), "PIX_RECEBIDO", 
                             valor, "PIX de " + contaOrigem.getNumeroConta(), saldoAnteriorDestino, contaDestino.getSaldo());
            
            return true;
        }
        
        return false;
    }
    
    public boolean pagarConta(ContaBancaria conta, String tipoPagamento, String codigoBarras, 
                             double valor, String descricao) throws SQLException {
        
        double saldoAnterior = conta.getSaldo();
        
        if (conta.sacar(valor)) {
            contaDAO.atualizar(conta);
            
            // Registrar pagamento
            String sqlPagamento = "INSERT INTO pagamentos (conta_numero, tipo_pagamento, codigo_barras, valor, descricao) VALUES (?, ?, ?, ?, ?)";
            try (var conn = ConnectionManager.getConnection();
                 var stmt = conn.prepareStatement(sqlPagamento)) {
                
                stmt.setString(1, conta.getNumeroConta());
                stmt.setString(2, tipoPagamento);
                stmt.setString(3, codigoBarras);
                stmt.setDouble(4, valor);
                stmt.setString(5, descricao);
                
                stmt.executeUpdate();
            }
            
            registrarTransacao(conta.getNumeroConta(), null, "PAGAMENTO", valor, 
                             "Pagamento: " + tipoPagamento + " - " + descricao, 
                             saldoAnterior, conta.getSaldo());
            
            return true;
        }
        
        return false;
    }
    
    public boolean alterarCodigoSeguranca(ContaBancaria conta, int codigoAtual, int codigoNovo) throws SQLException {
        if (!conta.autenticar(codigoAtual)) {
            return false;
        }
        
        String sql = "UPDATE contas SET codigo_seguranca = ? WHERE numero_conta = ?";
        
        try (var conn = ConnectionManager.getConnection();
             var stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, codigoNovo);
            stmt.setString(2, conta.getNumeroConta());
            
            stmt.executeUpdate();
            return true;
        }
    }
}
