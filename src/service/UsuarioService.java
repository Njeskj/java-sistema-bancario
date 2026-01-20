package service;

import dao.UsuarioDAO;
import model.Usuario;

import java.sql.SQLException;

public class UsuarioService {
    private UsuarioDAO usuarioDAO;
    
    public UsuarioService() {
        this.usuarioDAO = new UsuarioDAO();
    }
    
    public Usuario registrarUsuario(String nome, String sobrenome, String cpf, String rg,
                                   String telefone, String email, String nomeMae, String nomePai,
                                   String escolaridade, String estadoCivil, String nacionalidade,
                                   String naturalidade, String sexo, int anoNascimento, int idade,
                                   String profissao, String empresa, String cargo,
                                   String departamento, String endereco) throws SQLException {
        
        // Validar se CPF já existe
        if (usuarioDAO.existeCpf(cpf)) {
            throw new SQLException("CPF já cadastrado no sistema.");
        }
        
        // Criar novo usuário
        Usuario usuario = new Usuario(nome, sobrenome, cpf, rg, telefone, email, nomeMae,
                                     nomePai, escolaridade, estadoCivil, nacionalidade,
                                     naturalidade, sexo, anoNascimento, idade, profissao,
                                     empresa, cargo, departamento, endereco);
        
        // Salvar no banco
        usuarioDAO.salvar(usuario);
        
        return usuario;
    }
    
    public Usuario buscarPorCpf(String cpf) throws SQLException {
        return usuarioDAO.buscarPorCpf(cpf);
    }
}
