package com.ibank.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {
    
    @NotBlank(message = "Email ou CPF é obrigatório")
    private String emailOuCpf;
    
    @NotBlank(message = "Senha é obrigatória")
    private String senha;
}
