package com.ibank.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegistroRequest {
    
    @NotBlank(message = "Nome é obrigatório")
    @Size(min = 2, max = 100)
    private String nome;
    
    @NotBlank(message = "Sobrenome é obrigatório")
    @Size(min = 2, max = 100)
    private String sobrenome;
    
    @NotBlank(message = "CPF/NIF é obrigatório")
    private String cpf;
    
    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Email inválido")
    private String email;
    
    @NotBlank(message = "Telefone é obrigatório")
    private String telefone;
    
    @NotBlank(message = "Senha é obrigatória")
    @Size(min = 6, max = 100)
    private String senha;
    
    @Past(message = "Data de nascimento deve ser no passado")
    private LocalDate dataNascimento;
    
    @NotBlank(message = "Nacionalidade é obrigatória")
    @Pattern(regexp = "BR|PT", message = "Nacionalidade deve ser BR ou PT")
    private String nacionalidade;
    
    private String endereco;
    private String cidade;
    private String estado;
    private String cep;
}
