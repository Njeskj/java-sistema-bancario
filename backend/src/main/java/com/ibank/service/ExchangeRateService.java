package com.ibank.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Serviço para conversão de moedas e cotações
 * Suporta: BRL (Real Brasileiro), EUR (Euro), USD (Dólar)
 */
@Service
public class ExchangeRateService {

    @Value("${exchange.api.url}")
    private String exchangeApiUrl;

    private final RestTemplate restTemplate = new RestTemplate();
    private final Map<String, Map<String, BigDecimal>> exchangeRates = new ConcurrentHashMap<>();

    /**
     * Converte valor entre moedas
     * 
     * @param amount Valor a converter
     * @param fromCurrency Moeda de origem (BRL, EUR, USD)
     * @param toCurrency Moeda de destino (BRL, EUR, USD)
     * @return Valor convertido
     */
    public BigDecimal convert(BigDecimal amount, String fromCurrency, String toCurrency) {
        if (fromCurrency.equals(toCurrency)) {
            return amount;
        }

        BigDecimal rate = getExchangeRate(fromCurrency, toCurrency);
        return amount.multiply(rate).setScale(2, RoundingMode.HALF_UP);
    }

    /**
     * Obtém taxa de câmbio entre duas moedas
     */
    public BigDecimal getExchangeRate(String fromCurrency, String toCurrency) {
        if (!exchangeRates.containsKey(fromCurrency)) {
            updateExchangeRates(fromCurrency);
        }

        Map<String, BigDecimal> rates = exchangeRates.get(fromCurrency);
        return rates.getOrDefault(toCurrency, BigDecimal.ONE);
    }

    /**
     * Obtém todas as taxas de câmbio para uma moeda base
     */
    public Map<String, BigDecimal> getAllRates(String baseCurrency) {
        if (!exchangeRates.containsKey(baseCurrency)) {
            updateExchangeRates(baseCurrency);
        }
        return exchangeRates.get(baseCurrency);
    }

    /**
     * Atualiza taxas de câmbio para uma moeda específica
     */
    private void updateExchangeRates(String baseCurrency) {
        try {
            String url = exchangeApiUrl + "/" + baseCurrency;
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            
            if (response != null && response.containsKey("rates")) {
                Map<String, Object> rates = (Map<String, Object>) response.get("rates");
                Map<String, BigDecimal> convertedRates = new ConcurrentHashMap<>();
                
                rates.forEach((currency, rate) -> {
                    if (rate instanceof Number) {
                        convertedRates.put(currency, 
                            BigDecimal.valueOf(((Number) rate).doubleValue()));
                    }
                });
                
                exchangeRates.put(baseCurrency, convertedRates);
            }
        } catch (Exception e) {
            // Fallback para taxas fixas em caso de erro na API
            useFallbackRates(baseCurrency);
        }
    }

    /**
     * Taxas de câmbio de fallback (backup)
     */
    private void useFallbackRates(String baseCurrency) {
        Map<String, BigDecimal> fallbackRates = new ConcurrentHashMap<>();
        
        switch (baseCurrency) {
            case "BRL":
                fallbackRates.put("USD", new BigDecimal("0.20"));
                fallbackRates.put("EUR", new BigDecimal("0.18"));
                fallbackRates.put("BRL", BigDecimal.ONE);
                break;
            case "USD":
                fallbackRates.put("BRL", new BigDecimal("5.00"));
                fallbackRates.put("EUR", new BigDecimal("0.91"));
                fallbackRates.put("USD", BigDecimal.ONE);
                break;
            case "EUR":
                fallbackRates.put("BRL", new BigDecimal("5.50"));
                fallbackRates.put("USD", new BigDecimal("1.10"));
                fallbackRates.put("EUR", BigDecimal.ONE);
                break;
        }
        
        exchangeRates.put(baseCurrency, fallbackRates);
    }

    /**
     * Atualiza todas as taxas de câmbio a cada hora
     */
    @Scheduled(fixedRate = 3600000) // 1 hora
    public void refreshAllRates() {
        updateExchangeRates("BRL");
        updateExchangeRates("USD");
        updateExchangeRates("EUR");
    }

    /**
     * Formata valor com símbolo da moeda
     */
    public String formatCurrency(BigDecimal amount, String currency) {
        String symbol;
        switch (currency) {
            case "BRL":
                symbol = "R$";
                break;
            case "EUR":
                symbol = "€";
                break;
            case "USD":
                symbol = "$";
                break;
            default:
                symbol = currency;
        }
        return symbol + " " + amount.setScale(2, RoundingMode.HALF_UP).toString();
    }
}
