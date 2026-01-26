const { chromium } = require('playwright');

async function testHomePage() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  const results = [];
  const startTime = Date.now();
  let testsPassed = 0;
  let testsFailed = 0;

  console.log('🏠 ==========================================');
  console.log('🏠 TESTE DA PÁGINA INICIAL (HOME PAGE)');
  console.log('🏠 ==========================================\n');

  try {
    // Teste 1: Acessar a página inicial
    console.log('📝 Teste 1: Acessar a página inicial...');
    try {
      await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);
      
      const url = page.url();
      if (url === 'http://localhost:3000/') {
        console.log('   ✅ Página inicial carregada com sucesso\n');
        results.push({ test: 'Acessar página inicial', status: 'PASSOU' });
        testsPassed++;
      } else {
        throw new Error(`URL incorreta: ${url}`);
      }
    } catch (error) {
      console.log(`   ❌ FALHOU: ${error.message}\n`);
      results.push({ test: 'Acessar página inicial', status: 'FALHOU', error: error.message });
      testsFailed++;
    }

    // Teste 2: Verificar elementos do header
    console.log('📝 Teste 2: Verificar elementos do header...');
    try {
      // Verificar logo
      const logo = await page.locator('text=💳 IBank').first();
      await logo.waitFor({ timeout: 5000 });
      
      // Verificar botão de login no header
      const headerLoginBtn = await page.locator('[data-testid="btn-header-login"]');
      await headerLoginBtn.waitFor({ timeout: 5000 });
      
      // Verificar botão de cadastro no header
      const headerRegisterBtn = await page.locator('[data-testid="btn-header-register"]');
      await headerRegisterBtn.waitFor({ timeout: 5000 });
      
      console.log('   ✅ Todos os elementos do header estão presentes\n');
      results.push({ test: 'Elementos do header', status: 'PASSOU' });
      testsPassed++;
    } catch (error) {
      console.log(`   ❌ FALHOU: ${error.message}\n`);
      results.push({ test: 'Elementos do header', status: 'FALHOU', error: error.message });
      testsFailed++;
    }

    // Teste 3: Verificar Hero Section
    console.log('📝 Teste 3: Verificar Hero Section...');
    try {
      // Verificar título principal
      const heroTitle = await page.locator('[data-testid="hero-title"]');
      await heroTitle.waitFor({ timeout: 5000 });
      const titleText = await heroTitle.textContent();
      
      if (titleText.includes('banco digital')) {
        console.log('   ✅ Hero title presente e correto\n');
      }
      
      // Verificar botão "Abrir Conta Grátis" no hero
      const heroRegisterBtn = await page.locator('[data-testid="btn-hero-register"]');
      await heroRegisterBtn.waitFor({ timeout: 5000 });
      
      // Verificar botão "Já Sou Cliente" no hero
      const heroLoginBtn = await page.locator('[data-testid="btn-hero-login"]');
      await heroLoginBtn.waitFor({ timeout: 5000 });
      
      console.log('   ✅ Hero Section completa com todos os elementos\n');
      results.push({ test: 'Hero Section', status: 'PASSOU' });
      testsPassed++;
    } catch (error) {
      console.log(`   ❌ FALHOU: ${error.message}\n`);
      results.push({ test: 'Hero Section', status: 'FALHOU', error: error.message });
      testsFailed++;
    }

    // Teste 4: Verificar seção de funcionalidades
    console.log('📝 Teste 4: Verificar seção de funcionalidades...');
    try {
      // Scrollar até a seção de funcionalidades
      await page.evaluate(() => window.scrollTo(0, 800));
      await page.waitForTimeout(500);
      
      // Verificar título da seção
      const featuresTitle = await page.locator('text=Por que escolher o IBank?');
      await featuresTitle.waitFor({ timeout: 5000 });
      
      // Verificar se há cards de funcionalidades (pelo menos 3)
      const featureCards = await page.locator('text=Segurança Máxima').count();
      
      if (featureCards > 0) {
        console.log('   ✅ Seção de funcionalidades presente com cards\n');
        results.push({ test: 'Seção de funcionalidades', status: 'PASSOU' });
        testsPassed++;
      } else {
        throw new Error('Nenhum card de funcionalidade encontrado');
      }
    } catch (error) {
      console.log(`   ❌ FALHOU: ${error.message}\n`);
      results.push({ test: 'Seção de funcionalidades', status: 'FALHOU', error: error.message });
      testsFailed++;
    }

    // Teste 5: Verificar seção de benefícios
    console.log('📝 Teste 5: Verificar seção de benefícios...');
    try {
      // Scrollar até a seção de benefícios
      await page.evaluate(() => window.scrollTo(0, 1800));
      await page.waitForTimeout(500);
      
      // Verificar título
      const benefitsTitle = await page.locator('text=Benefícios Exclusivos');
      await benefitsTitle.waitFor({ timeout: 5000 });
      
      // Verificar se há itens de benefícios
      const benefitItems = await page.locator('text=Conta digital 100% gratuita').count();
      
      if (benefitItems > 0) {
        console.log('   ✅ Seção de benefícios presente\n');
        results.push({ test: 'Seção de benefícios', status: 'PASSOU' });
        testsPassed++;
      } else {
        throw new Error('Nenhum benefício encontrado');
      }
    } catch (error) {
      console.log(`   ❌ FALHOU: ${error.message}\n`);
      results.push({ test: 'Seção de benefícios', status: 'FALHOU', error: error.message });
      testsFailed++;
    }

    // Teste 6: Verificar CTA Section
    console.log('📝 Teste 6: Verificar CTA Section...');
    try {
      // Scrollar até o CTA
      await page.evaluate(() => window.scrollTo(0, 2800));
      await page.waitForTimeout(500);
      
      // Verificar título do CTA
      const ctaTitle = await page.locator('text=Pronto para começar?');
      await ctaTitle.waitFor({ timeout: 5000 });
      
      // Verificar botão do CTA
      const ctaRegisterBtn = await page.locator('[data-testid="btn-cta-register"]');
      await ctaRegisterBtn.waitFor({ timeout: 5000 });
      
      console.log('   ✅ CTA Section presente com botão de ação\n');
      results.push({ test: 'CTA Section', status: 'PASSOU' });
      testsPassed++;
    } catch (error) {
      console.log(`   ❌ FALHOU: ${error.message}\n`);
      results.push({ test: 'CTA Section', status: 'FALHOU', error: error.message });
      testsFailed++;
    }

    // Teste 7: Verificar Footer
    console.log('📝 Teste 7: Verificar Footer...');
    try {
      // Scrollar até o footer
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(500);
      
      // Verificar elementos do footer
      const footerLogo = await page.locator('text=💳 IBank').last();
      await footerLogo.waitFor({ timeout: 5000 });
      
      // Verificar se há informações de contato
      const contact = await page.locator('text=0800 123 4567').count();
      
      if (contact > 0) {
        console.log('   ✅ Footer presente com informações de contato\n');
        results.push({ test: 'Footer', status: 'PASSOU' });
        testsPassed++;
      } else {
        throw new Error('Informações de contato não encontradas no footer');
      }
    } catch (error) {
      console.log(`   ❌ FALHOU: ${error.message}\n`);
      results.push({ test: 'Footer', status: 'FALHOU', error: error.message });
      testsFailed++;
    }

    // Teste 8: Testar navegação para Login
    console.log('📝 Teste 8: Testar navegação para Login...');
    try {
      // Voltar ao topo
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(500);
      
      // Clicar no botão de login do header
      const headerLoginBtn = await page.locator('[data-testid="btn-header-login"]');
      await headerLoginBtn.click();
      await page.waitForTimeout(1000);
      
      const url = page.url();
      if (url.includes('/login')) {
        console.log('   ✅ Navegação para Login funcionando\n');
        results.push({ test: 'Navegação para Login', status: 'PASSOU' });
        testsPassed++;
        
        // Voltar para a home
        await page.goto('http://localhost:3000');
        await page.waitForTimeout(1000);
      } else {
        throw new Error(`URL incorreta após clicar em Login: ${url}`);
      }
    } catch (error) {
      console.log(`   ❌ FALHOU: ${error.message}\n`);
      results.push({ test: 'Navegação para Login', status: 'FALHOU', error: error.message });
      testsFailed++;
    }

    // Teste 9: Testar navegação para Register
    console.log('📝 Teste 9: Testar navegação para Register...');
    try {
      // Clicar no botão principal de registro
      const heroRegisterBtn = await page.locator('[data-testid="btn-hero-register"]');
      await heroRegisterBtn.click();
      await page.waitForTimeout(1000);
      
      const url = page.url();
      if (url.includes('/register')) {
        console.log('   ✅ Navegação para Register funcionando\n');
        results.push({ test: 'Navegação para Register', status: 'PASSOU' });
        testsPassed++;
      } else {
        throw new Error(`URL incorreta após clicar em Register: ${url}`);
      }
    } catch (error) {
      console.log(`   ❌ FALHOU: ${error.message}\n`);
      results.push({ test: 'Navegação para Register', status: 'FALHOU', error: error.message });
      testsFailed++;
    }

    // Teste 10: Verificar responsividade (mobile)
    console.log('📝 Teste 10: Verificar responsividade (mobile)...');
    try {
      // Voltar para a home
      await page.goto('http://localhost:3000');
      await page.waitForTimeout(1000);
      
      // Definir viewport mobile
      await page.setViewportSize({ width: 375, height: 812 });
      await page.waitForTimeout(1000);
      
      // Verificar se o header ainda está visível
      const logo = await page.locator('text=💳 IBank').first();
      await logo.waitFor({ timeout: 5000 });
      
      // Verificar se o hero title está visível
      const heroTitle = await page.locator('[data-testid="hero-title"]');
      const isVisible = await heroTitle.isVisible();
      
      if (isVisible) {
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
  console.log('\n🏠 ==========================================');
  console.log('🏠 RELATÓRIO FINAL');
  console.log('🏠 ==========================================\n');
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
    console.log('\n🎉 PARABÉNS! Todos os testes da Home Page passaram! 🎉\n');
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
  
  fs.writeFileSync('test-home-page-report.json', JSON.stringify(report, null, 2));
  console.log('📄 Relatório salvo em: test-home-page-report.json\n');
}

testHomePage();
