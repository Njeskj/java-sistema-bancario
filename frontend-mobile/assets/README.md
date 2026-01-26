# IBank Mobile Assets

Este diretório contém os assets do aplicativo mobile.

## Ícones Necessários

Para que o app mobile funcione corretamente, você precisa adicionar os seguintes arquivos de imagem nesta pasta:

### 1. **icon.png**
- Dimensões: 1024x1024 pixels
- Formato: PNG com transparência
- Uso: Ícone principal do app

### 2. **splash.png**
- Dimensões: 1242x2436 pixels (iPhone X)
- Formato: PNG
- Uso: Tela de abertura do aplicativo

### 3. **adaptive-icon.png**
- Dimensões: 1024x1024 pixels
- Formato: PNG com transparência
- Uso: Ícone adaptativo para Android

### 4. **favicon.png**
- Dimensões: 48x48 pixels
- Formato: PNG
- Uso: Favicon para versão web

## Como Criar os Ícones

### Opção 1: Usar ferramentas online
- [Icon Kitchen](https://icon.kitchen/) - Gerador gratuito de ícones
- [App Icon Generator](https://www.appicon.co/) - Gerador de ícones para apps

### Opção 2: Usar Figma/Photoshop
1. Crie um design quadrado 1024x1024
2. Use as cores do IBank: #1976d2 (azul principal)
3. Adicione um ícone de banco (💳, 🏦) ou as letras "IB"
4. Exporte nos formatos necessários

### Opção 3: Temporário - Usar cor sólida
Para testes rápidos, você pode criar imagens simples com fundo azul (#1976d2).

## Estrutura de Cores do IBank

- **Primária**: #1976d2 (Azul)
- **Secundária**: #424242 (Cinza escuro)
- **Sucesso**: #4caf50 (Verde)
- **Erro**: #f44336 (Vermelho)
- **Background**: #1976d2 (para splash)

## Status Atual

⚠️ **ATENÇÃO**: Os arquivos de imagem ainda não foram criados. O app mobile não vai compilar sem eles.

### Solução Temporária

Executar este comando para criar placeholders:

**Windows (PowerShell):**
```powershell
# Criar imagens placeholder SVG (funcionará no Expo)
@"
<svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
  <rect width="1024" height="1024" fill="#1976d2"/>
  <text x="50%" y="50%" font-size="200" fill="white" text-anchor="middle" dy=".3em" font-family="Arial">IB</text>
</svg>
"@ | Out-File -FilePath "icon.svg" -Encoding utf8

# Copiar para outros formatos (temporário)
Copy-Item icon.svg adaptive-icon.svg
```

Depois, converta SVG para PNG usando:
- [CloudConvert](https://cloudconvert.com/svg-to-png)
- [SVGOMG](https://jakearchibald.github.io/svgomg/)

---

**Nota**: Para produção, você DEVE substituir estes placeholders por ícones profissionais.
