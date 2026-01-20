package model;

import java.util.ArrayList;
import java.util.List;

public class ContaBancaria {
    private int id;
    private int usuarioId;
    private String banco;
    private String agencia;
    private String numeroConta;
    private String tipoConta;
    private String titular;
    private String cpfTitular;
    private double saldo;
    private double limiteCredito;
    private String statusConta;
    private int codigoSeguranca;
    private List<String> historico;

    public ContaBancaria(String banco, String agencia, String numeroConta, String tipoConta,
                         String titular, String cpfTitular, double saldoInicial,
                         double limiteCredito, int codigoSeguranca) {
        this.banco = banco;
        this.agencia = agencia;
        this.numeroConta = numeroConta;
        this.tipoConta = tipoConta;
        this.titular = titular;
        this.cpfTitular = cpfTitular;
        this.saldo = saldoInicial;
        this.limiteCredito = limiteCredito;
        this.codigoSeguranca = codigoSeguranca;
        this.statusConta = "Ativa";
        this.historico = new ArrayList<>();
    }

    public boolean autenticar(int codigoDigitado) {
        return codigoDigitado == this.codigoSeguranca;
    }

    public double getSaldo() {
        return saldo;
    }

    public double getTotalDisponivel() {
        return saldo + limiteCredito;
    }

    public boolean depositar(double valor) {
        if (valor > 0) {
            saldo += valor;
            historico.add("Depósito: R$ " + String.format("%.2f", valor));
            return true;
        }
        return false;
    }

    public boolean sacar(double valor) {
        if (valor > 0 && valor <= saldo) {
            saldo -= valor;
            historico.add("Saque: R$ " + String.format("%.2f", valor));
            return true;
        }
        return false;
    }

    public List<String> getHistorico() {
        return new ArrayList<>(historico);
    }

    public String getBanco() {
        return banco;
    }

    public String getAgencia() {
        return agencia;
    }

    public String getNumeroConta() {
        return numeroConta;
    }

    public String getTitular() {
        return titular;
    }

    public String getStatusConta() {
        return statusConta;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(int usuarioId) {
        this.usuarioId = usuarioId;
    }

    public String getCpfTitular() {
        return cpfTitular;
    }
}
