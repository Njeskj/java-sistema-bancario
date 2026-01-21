package dao;

import java.sql.*;
import model.Usuario;
import util.ConnectionManager;

public class UsuarioDAO {
    
    public void salvar(Usuario usuario) throws SQLException {
        String sql = "INSERT INTO usuarios (nome, sobrenome, cpf, rg, telefone, email, nome_mae, nome_pai, escolaridade, estado_civil, nacionalidade, naturalidade, sexo, ano_nascimento, idade, profissao, empresa, cargo, departamento, endereco) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        try (Connection conn = ConnectionManager.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            
            stmt.setString(1, usuario.getNome());
            stmt.setString(2, usuario.getSobrenome());
            stmt.setString(3, usuario.getCpf());
            stmt.setString(4, usuario.getRg());
            stmt.setString(5, usuario.getTelefone());
            stmt.setString(6, usuario.getEmail());
            stmt.setString(7, usuario.getNomeMae());
            stmt.setString(8, usuario.getNomePai());
            stmt.setString(9, usuario.getEscolaridade());
            stmt.setString(10, usuario.getEstadoCivil());
            stmt.setString(11, usuario.getNacionalidade());
            stmt.setString(12, usuario.getNaturalidade());
            stmt.setString(13, usuario.getSexo());
            stmt.setInt(14, usuario.getAnoNascimento());
            stmt.setInt(15, usuario.getIdade());
            stmt.setString(16, usuario.getProfissao());
            stmt.setString(17, usuario.getEmpresa());
            stmt.setString(18, usuario.getCargo());
            stmt.setString(19, usuario.getDepartamento());
            stmt.setString(20, usuario.getEndereco());
            
            stmt.executeUpdate();
            
            try (ResultSet rs = stmt.getGeneratedKeys()) {
                if (rs.next()) {
                    usuario.setId(rs.getInt(1));
                }
            }
        }
    }
    
    public Usuario buscarPorCpf(String cpf) throws SQLException {
        String sql = "SELECT * FROM usuarios WHERE cpf = ?";
        
        try (Connection conn = ConnectionManager.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, cpf);
            
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    Usuario usuario = new Usuario(
                        rs.getString("nome"),
                        rs.getString("sobrenome"),
                        rs.getString("cpf"),
                        rs.getString("rg"),
                        rs.getString("telefone"),
                        rs.getString("email"),
                        rs.getString("nome_mae"),
                        rs.getString("nome_pai"),
                        rs.getString("escolaridade"),
                        rs.getString("estado_civil"),
                        rs.getString("nacionalidade"),
                        rs.getString("naturalidade"),
                        rs.getString("sexo"),
                        rs.getInt("ano_nascimento"),
                        rs.getInt("idade"),
                        rs.getString("profissao"),
                        rs.getString("empresa"),
                        rs.getString("cargo"),
                        rs.getString("departamento"),
                        rs.getString("endereco")
                    );
                    usuario.setId(rs.getInt("id"));
                    return usuario;
                }
            }
        }
        return null;
    }
    
    public boolean existeCpf(String cpf) throws SQLException {
        String sql = "SELECT COUNT(*) FROM usuarios WHERE cpf = ?";
        
        try (Connection conn = ConnectionManager.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, cpf);
            
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt(1) > 0;
                }
            }
        }
        return false;
    }
}
