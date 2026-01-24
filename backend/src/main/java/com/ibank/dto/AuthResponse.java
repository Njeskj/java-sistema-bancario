package com.ibank.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String refreshToken;
    private String tipo;
    private Long usuarioId;
    private String nomeCompleto;
    private String email;
    private String nacionalidade;
    private String moedaPreferencial;
    private String idioma;
    private boolean requer2FA;
    private String qrCode2FA; // Apenas no cadastro do 2FA
}
