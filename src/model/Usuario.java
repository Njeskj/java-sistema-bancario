package model;

public class Usuario {
    private int id;
    private String nome;
    private String sobrenome;
    private String cpf;
    private String rg;
    private String telefone;
    private String email;
    private String nomeMae;
    private String nomePai;
    private String escolaridade;
    private String estadoCivil;
    private String nacionalidade;
    private String naturalidade;
    private String sexo;
    private int anoNascimento;
    private int idade;
    private String profissao;
    private String empresa;
    private String cargo;
    private String departamento;
    private String endereco;

    public Usuario(String nome, String sobrenome, String cpf, String rg, String telefone,
                   String email, String nomeMae, String nomePai, String escolaridade,
                   String estadoCivil, String nacionalidade, String naturalidade,
                   String sexo, int anoNascimento, int idade, String profissao,
                   String empresa, String cargo, String departamento, String endereco) {
        this.nome = nome;
        this.sobrenome = sobrenome;
        this.cpf = cpf;
        this.rg = rg;
        this.telefone = telefone;
        this.email = email;
        this.nomeMae = nomeMae;
        this.nomePai = nomePai;
        this.escolaridade = escolaridade;
        this.estadoCivil = estadoCivil;
        this.nacionalidade = nacionalidade;
        this.naturalidade = naturalidade;
        this.sexo = sexo;
        this.anoNascimento = anoNascimento;
        this.idade = idade;
        this.profissao = profissao;
        this.empresa = empresa;
        this.cargo = cargo;
        this.departamento = departamento;
        this.endereco = endereco;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public String getSobrenome() {
        return sobrenome;
    }

    public String getNomeCompleto() {
        return nome + " Macedo " + sobrenome;
    }

    public String getCpf() {
        return cpf;
    }

    public String getRg() {
        return rg;
    }

    public String getEmail() {
        return email;
    }

    public String getTelefone() {
        return telefone;
    }

    public String getNomeMae() {
        return nomeMae;
    }

    public String getNomePai() {
        return nomePai;
    }

    public String getEscolaridade() {
        return escolaridade;
    }

    public String getEstadoCivil() {
        return estadoCivil;
    }

    public String getNacionalidade() {
        return nacionalidade;
    }

    public String getNaturalidade() {
        return naturalidade;
    }

    public String getSexo() {
        return sexo;
    }

    public int getAnoNascimento() {
        return anoNascimento;
    }

    public int getIdade() {
        return idade;
    }

    public String getProfissao() {
        return profissao;
    }

    public String getEmpresa() {
        return empresa;
    }

    public String getCargo() {
        return cargo;
    }

    public String getDepartamento() {
        return departamento;
    }

    public String getEndereco() {
        return endereco;
    }
}
