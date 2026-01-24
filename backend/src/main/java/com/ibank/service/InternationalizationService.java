package com.ibank.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;

import java.util.Locale;

/**
 * Serviço de internacionalização (i18n)
 * Suporta: pt-BR (Português do Brasil), pt-PT (Português de Portugal)
 */
@Service
public class InternationalizationService {

    private final MessageSource messageSource;

    @Value("${ibank.default-language}")
    private String defaultLanguage;

    public InternationalizationService(MessageSource messageSource) {
        this.messageSource = messageSource;
    }

    /**
     * Obtém mensagem traduzida
     */
    public String getMessage(String key) {
        return messageSource.getMessage(key, null, getCurrentLocale());
    }

    /**
     * Obtém mensagem traduzida com parâmetros
     */
    public String getMessage(String key, Object... params) {
        return messageSource.getMessage(key, params, getCurrentLocale());
    }

    /**
     * Obtém locale atual da requisição
     */
    public Locale getCurrentLocale() {
        Locale locale = LocaleContextHolder.getLocale();
        if (locale == null || locale.getLanguage().isEmpty()) {
            return getDefaultLocale();
        }
        return locale;
    }

    /**
     * Obtém locale padrão configurado
     */
    public Locale getDefaultLocale() {
        return Locale.forLanguageTag(defaultLanguage);
    }

    /**
     * Verifica se é locale do Brasil
     */
    public boolean isBrazil() {
        return getCurrentLocale().getCountry().equals("BR");
    }

    /**
     * Verifica se é locale de Portugal
     */
    public boolean isPortugal() {
        return getCurrentLocale().getCountry().equals("PT");
    }

    /**
     * Formata número de documento conforme país
     */
    public String formatDocument(String document, String country) {
        if (document == null || document.isEmpty()) {
            return "";
        }

        if ("BR".equals(country)) {
            // Formato CPF: 000.000.000-00
            if (document.length() == 11) {
                return document.replaceAll("(\\d{3})(\\d{3})(\\d{3})(\\d{2})", "$1.$2.$3-$4");
            }
            // Formato CNPJ: 00.000.000/0000-00
            if (document.length() == 14) {
                return document.replaceAll("(\\d{2})(\\d{3})(\\d{3})(\\d{4})(\\d{2})", "$1.$2.$3/$4-$5");
            }
        } else if ("PT".equals(country)) {
            // Formato NIF Portugal: 000 000 000
            if (document.length() == 9) {
                return document.replaceAll("(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3");
            }
        }

        return document;
    }

    /**
     * Formata telefone conforme país
     */
    public String formatPhone(String phone, String countryCode) {
        if (phone == null || phone.isEmpty()) {
            return "";
        }

        if ("+55".equals(countryCode)) {
            // Brasil: +55 (11) 98765-4321
            if (phone.length() == 11) {
                return String.format("+55 (%s) %s-%s",
                        phone.substring(0, 2),
                        phone.substring(2, 7),
                        phone.substring(7));
            }
        } else if ("+351".equals(countryCode)) {
            // Portugal: +351 912 345 678
            if (phone.length() == 9) {
                return String.format("+351 %s %s %s",
                        phone.substring(0, 3),
                        phone.substring(3, 6),
                        phone.substring(6));
            }
        }

        return countryCode + " " + phone;
    }

    /**
     * Obtém nome do país
     */
    public String getCountryName(String countryCode) {
        switch (countryCode) {
            case "BR":
                return isBrazil() ? "Brasil" : "Brasil";
            case "PT":
                return isBrazil() ? "Portugal" : "Portugal";
            default:
                return countryCode;
        }
    }

    /**
     * Obtém código do país por locale
     */
    public String getCountryCode() {
        return getCurrentLocale().getCountry();
    }
}
