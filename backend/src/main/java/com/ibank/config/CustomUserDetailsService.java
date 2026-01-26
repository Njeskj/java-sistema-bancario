package com.ibank.config;

import com.ibank.model.Usuario;
import com.ibank.repository.UsuarioRepository;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    public CustomUserDetailsService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String cpf) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByCpfHash(cpf)
            .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado: " + cpf));

        return User.builder()
            .username(cpf)
            .password(usuario.getSenhaHash())
            .authorities(new ArrayList<>()) // Adicionar roles se necessário
            .accountExpired(false)
            .accountLocked(usuario.isContaBloqueada())
            .credentialsExpired(false)
            .disabled(!usuario.isAtivo())
            .build();
    }
}
