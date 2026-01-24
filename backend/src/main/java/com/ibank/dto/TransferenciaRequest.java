package com.ibank.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransferenciaRequest {
    
    @NotNull(message = "Conta origem é obrigatória")
    private Long contaOrigemId;
    
    @NotBlank(message = "Identificador do destino é obrigatório")
    private String destinoIdentificador; // Pode ser: número conta, IBAN, chave PIX
    
    @NotBlank(message = "Tipo de transferência é obrigatório")
    @Pattern(regexp = "PIX|TED|DOC|SEPA|SWIFT", message = "Tipo inválido")
    private String tipoTransferencia;
    
    @NotNull(message = "Valor é obrigatório")
    @DecimalMin(value = "0.01", message = "Valor mínimo é 0.01")
    private BigDecimal valor;
    
    @NotBlank(message = "Moeda é obrigatória")
    @Pattern(regexp = "BRL|EUR|USD", message = "Moeda inválida")
    private String moeda;
    
    private String descricao;
    
    private String codigoSeguranca; // Código de segurança da conta
    
    private String codigoTotp; // Para 2FA se habilitado
}
