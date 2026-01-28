package com.ibank.util;

import org.springframework.stereotype.Component;

import dev.samstevens.totp.code.CodeGenerator;
import dev.samstevens.totp.code.CodeVerifier;
import dev.samstevens.totp.code.DefaultCodeGenerator;
import dev.samstevens.totp.code.DefaultCodeVerifier;
import dev.samstevens.totp.code.HashingAlgorithm;
import dev.samstevens.totp.exceptions.QrGenerationException;
import dev.samstevens.totp.qr.QrData;
import dev.samstevens.totp.qr.QrGenerator;
import dev.samstevens.totp.qr.ZxingPngQrGenerator;
import dev.samstevens.totp.secret.DefaultSecretGenerator;
import dev.samstevens.totp.time.SystemTimeProvider;
import dev.samstevens.totp.time.TimeProvider;
import static dev.samstevens.totp.util.Utils.getDataUriForImage;

/**
 * Utilitário para autenticação de dois fatores (2FA) usando TOTP
 */
@Component
public class TwoFactorAuthUtil {

    private final DefaultSecretGenerator secretGenerator = new DefaultSecretGenerator();
    private final TimeProvider timeProvider = new SystemTimeProvider();
    private final CodeGenerator codeGenerator = new DefaultCodeGenerator();
    private final CodeVerifier verifier = new DefaultCodeVerifier(codeGenerator, timeProvider);

    /**
     * Gera um novo secret para 2FA
     */
    public String generateSecret() {
        return secretGenerator.generate();
    }

    /**
     * Gera QR Code em formato Data URI para configuração do 2FA
     * 
     * @param secret Secret gerado
     * @param email Email do usuário
     * @param issuer Nome da aplicação (IBank)
     * @return Data URI da imagem QR Code
     */
    public String generateQrCodeDataUri(String secret, String email, String issuer) {
        QrData data = new QrData.Builder()
                .label(email)
                .secret(secret)
                .issuer(issuer)
                .algorithm(HashingAlgorithm.SHA1)
                .digits(6)
                .period(30)
                .build();

        QrGenerator generator = new ZxingPngQrGenerator();
        try {
            byte[] imageData = generator.generate(data);
            return getDataUriForImage(imageData, generator.getImageMimeType());
        } catch (QrGenerationException e) {
            throw new RuntimeException("Erro ao gerar QR Code para 2FA", e);
        }
    }

    /**
     * Verifica se o código TOTP fornecido é válido
     * 
     * @param secret Secret do usuário
     * @param code Código de 6 dígitos fornecido
     * @return true se válido, false caso contrário
     */
    public boolean verifyCode(String secret, String code) {
        return verifier.isValidCode(secret, code);
    }

    /**
     * Gera código TOTP atual (útil para testes)
     */
    public String getCurrentCode(String secret) {
        try {
            long currentBucket = Math.floorDiv(timeProvider.getTime(), 30);
            return codeGenerator.generate(secret, currentBucket);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao gerar código TOTP", e);
        }
    }
}
