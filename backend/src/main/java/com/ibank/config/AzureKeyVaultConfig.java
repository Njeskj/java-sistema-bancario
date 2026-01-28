package com.ibank.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

/**
 * Configuração para Azure Key Vault
 * Permite buscar secrets do Azure ao invés de usar variáveis de ambiente
 */
@Configuration
@Profile({"staging", "production"})
@ConfigurationProperties(prefix = "azure.keyvault")
public class AzureKeyVaultConfig {

    private String uri;
    private String tenantId;
    private String clientId;
    private String clientSecret;
    
    // Getters e Setters
    public String getUri() {
        return uri;
    }

    public void setUri(String uri) {
        this.uri = uri;
    }

    public String getTenantId() {
        return tenantId;
    }

    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

    public String getClientId() {
        return clientId;
    }

    public void setClientId(String clientId) {
        this.clientId = clientId;
    }

    public String getClientSecret() {
        return clientSecret;
    }

    public void setClientSecret(String clientSecret) {
        this.clientSecret = clientSecret;
    }
}
