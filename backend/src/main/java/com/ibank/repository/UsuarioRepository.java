package com.ibank.repository;

import com.ibank.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    
    Optional<Usuario> findByCpfHash(String cpfHash);
    
    Optional<Usuario> findByEmailHash(String emailHash);
    
    boolean existsByCpfHash(String cpfHash);
    
    boolean existsByEmailHash(String emailHash);
    
    @Query("SELECT u FROM Usuario u WHERE u.cpfHash = :cpfHash AND u.ativo = true")
    Optional<Usuario> findActiveUsuarioByCpfHash(@Param("cpfHash") String cpfHash);
    
    @Query("SELECT u FROM Usuario u WHERE u.emailHash = :emailHash AND u.ativo = true")
    Optional<Usuario> findActiveUsuarioByEmailHash(@Param("emailHash") String emailHash);
    
    @Query("SELECT u FROM Usuario u WHERE (u.email = :email OR u.cpf = :cpf) AND u.ativo = true")
    Optional<Usuario> findByEmailOrCpf(@Param("email") String email, @Param("cpf") String cpf);
    
    @Query("SELECT COUNT(u) FROM Usuario u WHERE u.nacionalidade = :nacionalidade AND u.ativo = true")
    long countByNacionalidade(@Param("nacionalidade") String nacionalidade);
}

