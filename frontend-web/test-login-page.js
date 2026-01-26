const { chromium } = require('playwright');

async function testLoginPage() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  const results = [];
  const startTime = Date.now();
  let testsPassed = 0;
  let testsFailed = 0;

  console.log('🔐 ==========================================');
  console.log('🔐 TESTE DA PÁGINA DE LOGIN');
  console.log('🔐 ==========================================\n');

  try {
    // Teste 1: Acessar a página de login
    console.log('📝 Teste 1: Acessar a página de login...');
    try {
      await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);
      
      const url = page.url();
      if (url.includes('/login')) {
        console.log('   ✅ Página de login carregada com sucesso\n');
        results.push({ test: 'Acessar página de login', status: 'PASSOU' });
        testsPassed++;
      } else {
        throw new Error(`URL incorreta: ${url}`);
      }
    } catch (error) {
      console.log(`   ❌ FALHOU: ${error.message}\n`);
      results.push({ test: 'Acessar página de login', status: 'FALHOU', error: error.message });
      testsFailed++;
    }

    // Teste 2: Verificar elementos principais
    console.log('📝 Teste 2: Verificar elementos principais...');
    try {
      // Verificar título
      const title = await page.locator('text=iBank').first();
      await title.waitFor({ timeout: 5000 });
      
      // Verificar subtítulo
      const subtitle = await page.locator('text=Acesse sua conta');
      await subtitle.waitFor({ timeout: 5000 });
      
      // Verificar campo de email
      const emailInput = await page.locator('[data-testid="input-email"]');
      await emailInput.waitFor({ timeout: 5000 });
      
      // Verificar campo de senha
      const passwordInput = await page.locator('[data-testid="input-password"]');
      await passwordInput.waitFor({ timeout: 5000 });
      
      // Verificar botão de login
      const loginBtn = await page.locator('[data-testid="btn-login"]');
      await loginBtn.waitFor({ timeout: 5000 });
      
      console.log('   ✅ Todos os elementos principais estão presentes\n');
      results.push({ test: 'Elementos principais', status: 'PASSOU' });
      testsPassed++;
    } catch (error) {
      console.log(`   ❌ FALHOU: ${error.message}\n`);
      results.push({ test: 'Elementos principais', status: 'FALHOU', error: error.message });
      testsFailed++;
    }

    // Teste 3: Verificar link "Esqueceu a senha?"
    console.log('📝 Teste 3: Verificar link "Esqueceu a senha?"...');
    try {
      const forgotPasswordLink = await page.locator('[data-testid="link-forgot-password"]');
      await forgotPasswordLink.waitFor({ timeout: 5000 });
      const isVisible = await forgotPasswordLink.isVisible();
      
      if (isVisible) {
        console.log('   ✅ Link "Esqueceu a senha?" visível\n');
        results.push({ test: 'Link esqueceu senha', status: 'PASSOU' });
        testsPassed++;
      } else {
        throw new Error('Link não está visível');
      }
    } catch (error) {
      console.log(`   ❌ FALHOU: ${error.message}\n`);
      results.push({ test: 'Link esqueceu senha', status: 'FALHOU', error: error.message });
      testsFailed++;
    }

    // Teste 4: Verificar seção "Não tem uma conta?"
    console.log('📝 Teste 4: Verificar seção "Não tem uma conta?"...');
    try {
      const signupText = await page.locator('text=Não tem uma conta?');
      await signupText.waitFor({ timeout: 5000 });
      
      const signupBtn = await page.locator('[data-testid="btn-go-to-register"]');
      await signupBtn.waitFor({ timeout: 5000 });
      
      const btnText = await signupBtn.textContent();
      if (btnText.includes('Criar Conta')) {
        console.log('   ✅ Seção de cadastro presente com botão correto\n');
        results.push({ test: 'Seção criar conta', status: 'PASSOU' });
        testsPassed++;
      } else {
        throw new Error(`Texto do botão incorreto: ${btnText}`);
      }
    } catch (error) {
      console.log(`   ❌ FALHOU: ${error.message}\n`);
      results.push({ test: 'Seção criar conta', status: 'FALHOU', error: error.message });
      testsFailed++;
    }

    // Teste 5: Verificar botão "Voltar para página inicial"
    console.log('📝 Teste 5: Verificar botão "Voltar para página inicial"...');
    try {
      const backBtn = await page.locator('[data-testid="btn-back-to-home"]');
      await backBtn.waitFor({ timeout: 5000 });
      const isVisible = await backBtn.isVisible();
      
      if (isVisible) {
        console.log('   ✅ Botão voltar para home presente\n');
        results.push({ test: 'Botão voltar home', status: 'PASSOU' });
        testsPassed++;
      } else {
        throw new Error('Botão não está visível');
      }
    } catch (error) {
      console.log(`   ❌ FALHOU: ${error.message}\n`);
      results.push({ test: 'Botão voltar home', status: 'FALHOU', error: error.message });
      testsFailed++;
    }

    // Teste 6: Testar preenchimento de campos
    console.log('📝 Teste 6: Testar preenchimento de campos...');
    try {
      const emailInput = await page.locator('[data-testid="input-email"] input');
      await emailInput.fill('teste@email.com');
      
      const passwordInput = await page.locator('[data-testid="input-password"] input');
      await passwordInput.fill('senha123');
      
      await page.waitForTimeout(500);
      
      const emailValue = await emailInput.inputValue();
      const passwordValue = await passwordInput.inputValue();
      
      if (emailValue === 'teste@email.com' && passwordValue === 'senha123') {
        console.log('   ✅ Campos preenchidos corretamente\n');
        results.push({ test: 'Preenchimento de campos', status: 'PASSOU' });
        testsPassed++;
      } else {
        throw new Error('Valores dos campos não correspondem');
      }
    } catch (error) {
      console.log(`   ❌ FALHOU: ${error.message}\n`);
      results.push({ test: 'Preenchimento de campos', status: 'FALHOU', error: error.message });
      testsFailed++;
    }

    // Teste 7: Testar navegação para Register
    console.log('📝 Teste 7: Testar navegação para Register...');
    try {
      const signupBtn = await page.locator('[data-testid="btn-go-to-register"]');
      await signupBtn.click();
      await page.waitForTimeout(1500);
      
      const url = page.url();
      if (url.includes('/register')) {
        console.log('   ✅ Navegação para Register funcionando\n');
        results.push({ test: 'Navegação para Register', status: 'PASSOU' });
        testsPassed++;
        
        // Voltar para login
        await page.goto('http://localhost:3000/login');
        await page.waitForTimeout(1000);
      } else {
        throw new Error(`URL incorreta após clicar em Register: ${url}`);
      }
    } catch (error) {
      console.log(`   ❌ FALHOU: ${error.message}\n`);
      results.push({ test: 'Navegação para Register', status: 'FALHOU', error: error.message });
      testsFailed++;
    }

    // Teste 8: Testar navegação para Home
    console.log('📝 Teste 8: Testar navegação para Home...');
    try {
      const backBtn = await page.locator('[data-testid="btn-back-to-home"]');
      await backBtn.click();
      await page.waitForTimeout(1000);
      
      const url = page.url();
      if (url === 'http://localhost:3000/') {
        console.log('   ✅ Navegação para Home funcionando\n');
        results.push({ test: 'Navegação para Home', status: 'PASSOU' });
        testsPassed++;
        
        // Voltar para login
        await page.goto('http://localhost:3000/login');
        await page.waitForTimeout(1000);
      } else {
        throw new Error(`URL incorreta após voltar: ${url}`);
      }
    } catch (error) {
      console.log(`   ❌ FALHOU: ${error.message}\n`);
      results.push({ test: 'Navegação para Home', status: 'FALHOU', error: error.message });
      testsFailed++;
    }

    // Teste 9: Testar validação de campos vazios
    console.log('📝 Teste 9: Testar validação de campos vazios...');
    try {
      // Limpar campos
      const emailInput = await page.locator('[data-testid="input-email"] input');
      await emailInput.fill('');
      
      const passwordInput = await page.locator('[data-testid="input-password"] input');
      await passwordInput.fill('');
      
      // Tentar fazer login
      const loginBtn = await page.locator('[data-testid="btn-login"]');
      await loginBtn.click();
      await page.waitForTimeout(1500);
      
      // Verificar se ainda está na página de login (não fez login)
      const url = page.url();
      if (url.includes('/login')) {
        console.log('   ✅ Validação de campos vazios funcionando\n');
        results.push({ test: 'Validação campos vazios', status: 'PASSOU' });
        testsPassed++;
      } else {
        throw new Error('Login deveria ter falhado com campos vazios');
      }
    } catch (error) {
      console.log(`   ❌ FALHOU: ${error.message}\n`);
      results.push({ test: 'Validação campos vazios', status: 'FALHOU', error: error.message });
      testsFailed++;
    }

    // Teste 10: Testar responsividade (mobile)
    console.log('📝 Teste 10: Testar responsividade (mobile)...');
    try {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.waitForTimeout(1000);
      
      // Verificar se os elementos principais ainda estão visíveis
      const emailInput = await page.locator('[data-testid="input-email"]');
      const isEmailVisible = await emailInput.isVisible();
      
      const loginBtn = await page.locator('[data-testid="btn-login"]');
      const isBtnVisible = await loginBtn.isVisible();
      
      if (isEmailVisible && isBtnVisible) {
        console.log('   ✅ Página responsiva para mobile\n');
        results.push({ test: 'Responsividade mobile', status: 'PASSOU' });
        testsPassed++;
      } else {
        throw new Error('Elementos não visíveis em viewport mobile');
      }
    } catch (error) {
      console.log(`   ❌ FALHOU: ${error.message}\n`);
      results.push({ test: 'Responsividade mobile', status: 'FALHOU', error: error.message });
      testsFailed++;
    }

  } catch (error) {
    console.log(`\n❌ ERRO CRÍTICO: ${error.message}\n`);
  }

  await browser.close();

  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);

  // Relatório final
  console.log('\n🔐 ==========================================');
  console.log('🔐 RELATÓRIO FINAL - LOGIN');
  console.log('🔐 ==========================================\n');
  console.log(`⏱️  Tempo de execução: ${duration}s`);
  console.log(`✅ Testes passou: ${testsPassed}`);
  console.log(`❌ Testes falhou: ${testsFailed}`);
  console.log(`📊 Total de testes: ${testsPassed + testsFailed}\n`);

  results.forEach((result, index) => {
    const icon = result.status === 'PASSOU' ? '✅' : '❌';
    console.log(`${icon} ${index + 1}. ${result.test}: ${result.status}`);
    if (result.error) {
      console.log(`   Erro: ${result.error}`);
    }
  });

  if (testsFailed === 0) {
    console.log('\n🎉 PARABÉNS! Todos os testes da página de Login passaram! 🎉\n');
  } else {
    console.log(`\n⚠️  ${testsFailed} teste(s) falharam. Verifique os erros acima.\n`);
  }

  // Salvar relatório em JSON
  const fs = require('fs');
  const report = {
    timestamp: new Date().toISOString(),
    duration: `${duration}s`,
    testsPassed,
    testsFailed,
    total: testsPassed + testsFailed,
    results
  };
  
  fs.writeFileSync('test-login-page-report.json', JSON.stringify(report, null, 2));
  console.log('📄 Relatório salvo em: test-login-page-report.json\n');
}

testLoginPage();
