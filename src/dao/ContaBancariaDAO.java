package dao;

import model.ContaBancaria;
import util.ConnectionManager;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class ContaBancariaDAO {
    
    public void salvar(ContaBancaria conta) throws SQLException {
        String sql = "INSERT INTO contas (usuario_id, banco, agencia, numero_conta, tipo_conta, titular, cpf_titular, saldo, limite_credito, status_conta) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        try (Connection conn = ConnectionManager.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            
            stmt.setInt(1, conta.getUsuarioId());
            stmt.setString(2, conta.getBanco());
            stmt.setString(3, conta.getAgencia());
            stmt.setString(4, conta.getNumeroConta());
            stmt.setString(5, "Corrente");
            stmt.setString(6, conta.getTitular());
            stmt.setString(7, conta.getCpfTitular());
            stmt.setDouble(8, conta.getSaldo());
            stmt.setDouble(9, conta.getTotalDisponivel() - conta.getSaldo());
            stmt.setString(10, conta.getStatusConta());
            
            stmt.executeUpdate();
            
            try (ResultSet rs = stmt.getGeneratedKeys()) {
                if (rs.next()) {
                    conta.setId(rs.getInt(1));
                }
            }
        }
    }
    
    public ContaBancaria buscarPorNumeroConta(String numeroConta) throws SQLException {
        String sql = "SELECT * FROM contas WHERE numero_conta = ?";
        
        try (Connection conn = ConnectionManager.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, numeroConta);
            
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    ContaBancaria conta = new ContaBancaria(
                        rs.getString("banco"),
                        rs.getString("agencia"),
                        rs.getString("numero_conta"),
                        rs.getString("tipo_conta"),
                        rs.getString("titular"),
                        rs.getString("cpf_titular"),
                        rs.getDouble("saldo"),
                        rs.getDouble("limite_credito"),
                        123456
                    );
                    conta.setId(rs.getInt("id"));
                    conta.setUsuarioId(rs.getInt("usuario_id"));
                    return conta;
                }
            }
        }
        return null;
    }
    
    public void atualizar(ContaBancaria conta) throws SQLException {
        String sql = "UPDATE contas SET saldo = ?, status_conta = ? WHERE numero_conta = ?";
        
        try (Connection conn = ConnectionManager.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setDouble(1, conta.getSaldo());
            stmt.setString(2, conta.getStatusConta());
            stmt.setString(3, conta.getNumeroConta());
            
            stmt.executeUpdate();
        }
    }
    
    public List<ContaBancaria> listarTodas() throws SQLException {
        List<ContaBancaria> contas = new ArrayList<>();
        String sql = "SELECT * FROM contas";
        
        try (Connection conn = ConnectionManager.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            
            while (rs.next()) {
                ContaBancaria conta = new ContaBancaria(
                    rs.getString("banco"),
                    rs.getString("agencia"),
                    rs.getString("numero_conta"),
                    rs.getString("tipo_conta"),
                    rs.getString("titular"),
                    rs.getString("cpf_titular"),
                    rs.getDouble("saldo"),
                    rs.getDouble("limite_credito"),
                    123456
                );
                contas.add(conta);
            }
        }
        
        return contas;
    }
    
    public void deletar(String numeroConta) throws SQLException {
        String sql = "DELETE FROM contas WHERE numero_conta = ?";
        
        try (Connection conn = ConnectionManager.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, numeroConta);
            stmt.executeUpdate();
        }
    }
    
    public ContaBancaria buscarPorCpfTitular(String cpf) throws SQLException {
        String sql = "SELECT * FROM contas WHERE cpf_titular = ?";
        
        try (Connection conn = ConnectionManager.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, cpf);
            
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    ContaBancaria conta = new ContaBancaria(
                        rs.getString("banco"),
                        rs.getString("agencia"),
                        rs.getString("numero_conta"),
                        rs.getString("tipo_conta"),
                        rs.getString("titular"),
                        rs.getString("cpf_titular"),
                        rs.getDouble("saldo"),
                        rs.getDouble("limite_credito"),
                        123456
                    );
                    conta.setId(rs.getInt("id"));
                    conta.setUsuarioId(rs.getInt("usuario_id"));
                    return conta;
                }
            }
        }
        return null;
    }
}
