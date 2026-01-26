package com.ibank.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioDTO {
    private Long id;
    private String nome;
    private String sobrenome;
    private String nomeCompleto;
    private String email;
    private String cpf;
    private String telefone;
    private String telefonePais;
    private LocalDate dataNascimento;
    private String idioma;
    private String moedaPreferencial;
    private boolean doisFatoresAtivo;
}
