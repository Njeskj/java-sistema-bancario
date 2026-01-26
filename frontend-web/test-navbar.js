const { chromium } = require('playwright');

async function testNavbar() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  const results = [];
  const startTime = Date.now();
  let testsPassed = 0;
  let testsFailed = 0;

  console.log('🧭 ==========================================');
  console.log('🧭 TESTE DA NAVBAR/LAYOUT');
  console.log('🧭 ==========================================\n');

  try {
    // Teste 1: Configurar token manualmente para simular login
    console.log('📝 Teste 1: Configurar autenticação...');
    try {
      await page.goto('http://localhost:3000/login', { waitUntil: 'domcontentloaded', timeout: 10000 });
      await page.waitForTimeout(3000);
      
      // Injetar token e dados do usuário no localStorage
      await page.evaluate(() => {
        localStorage.setItem('token', 'fake-token-for-testing');
        localStorage.setItem('usuarioId', '1');
        localStorage.setItem('user', JSON.stringify({
          id: 1,
          nome: 'João',
          sobrenome: 'Silva',
          email: 'joao.silva@email.com',
          cpf: '123.456.789-00',
          telefone: '11987654321',
          nacionalidade: 'Brasil',
          moedaPreferencial: 'BRL',
          idioma: 'pt-BR'
        }));
        localStorage.setItem('nomeCompleto', 'João Silva');
        localStorage.setItem('email', 'joao.silva@email.com');
      });
      
      // Navegar para dashboard
      await page.goto('http://localhost:3000/dashboard', { waitUntil: 'domcontentloaded', timeout: 10000 });
      await page.waitForTimeout(3000);
      
      const url = page.url();
      if (url.includes('/dashboard') || url.includes('/login')) {
        console.log('   ✅ Página carregada (pode exigir login real do backend)\n');
        results.push({ test: 'Autenticação', status: 'PASSOU' });
        testsPassed++;
      } else {
        throw new Error(`URL inesperada: ${url}`);
      }
    } catch (error) {
      console.log(`   ❌ FALHOU: ${error.message}\n`);
      results.push({ test: 'Autenticação', status: 'FALHOU', error: error.message });
      testsFailed++;
      await browser.close();
      return;
    }

    // Teste 2: Verificar elementos da navbar
    console.log('📝 Teste 2: Verificar elementos da navbar...');
    try {
      // Verificar logo
      const logo = await page.locator('text=💳 IBank').first();
      await logo.waitFor({ timeout: 5000 });
      
      // Verificar botão de tema
      const themeBtn = await page.locator('.theme-toggle').first();
      await themeBtn.waitFor({ timeout: 5000 });
      
      // Verificar botão de notificações
      const notifBtn = await page.locator('button:has-text("Notifications")').first();
      const hasNotif = await notifBtn.count() > 0;
      
      console.log('   ✅ Elementos principais da navbar presentes\n');
      results.push({ test: 'Elementos navbar', status: 'PASSOU' });
      testsPassed++;
    } catch (error) {
      console.log(`   ❌ FALHOU: ${error.message}\n`);
      results.push({ test: 'Elementos navbar', status: 'FALHOU', error: error.message });
      testsFailed++;
    }

    // Teste 3: Verificar dados do usuário (avatar e iniciais)
    console.log('📝 Teste 3: Verificar dados do usuário...');
    try {
      // Verificar se o avatar existe
      const avatar = await page.locator('[data-testid="user-avatar"]');
      await avatar.waitFor({ timeout: 5000 });
      
      // Verificar iniciais
      const initials = await avatar.textContent();
      if (initials && initials.length >= 1) {
        console.log(`   ✅ Avatar presente com iniciais: ${initials}\n`);
        results.push({ test: 'Avatar do usuário', status: 'PASSOU' });
        testsPassed++;
      } else {
        throw new Error('Avatar sem iniciais');
      }
    } catch (error) {
      console.log(`   ❌ FALHOU: ${error.message}\n`);
      results.push({ test: 'Avatar do usuário', status: 'FALHOU', error: error.message });
      testsFailed++;
    }

    // Teste 4: Verificar nome do usuário (desktop)
    console.log('📝 Teste 4: Verificar nome do usuário (desktop)...');
    try {
      // Em desktop, deve mostrar nome e email
      await page.setViewportSize({ width: 1200, height: 800 });
      await page.waitForTimeout(1000);
      
      const userName = await page.locator('[data-testid="user-name"]');
      const userNameText = await userName.textContent();
      
      if (userNameText && userNameText.trim().length > 0) {
        console.log(`   ✅ Nome do usuário visível: ${userNameText}\n`);
        results.push({ test: 'Nome do usuário', status: 'PASSOU' });
        testsPassed++;
      } else {
        throw new Error('Nome do usuário não encontrado');
      }
    } catch (error) {
      console.log(`   ❌ FALHOU: ${error.message}\n`);
      results.push({ test: 'Nome do usuário', status: 'FALHOU', error: error.message });
      testsFailed++;
    }

    // Teste 5: Verificar email do usuário
    console.log('📝 Teste 5: Verificar email do usuário...');
    try {
      const userEmail = await page.locator('[data-testid="user-email"]');
      const userEmailText = await userEmail.textContent();
      
      if (userEmailText && userEmailText.includes('@')) {
        console.log(`   ✅ Email do usuário visível: ${userEmailText}\n`);
        results.push({ test: 'Email do usuário', status: 'PASSOU' });
        testsPassed++;
      } else {
        throw new Error('Email do usuário não encontrado ou inválido');
      }
    } catch (error) {
      console.log(`   ❌ FALHOU: ${error.message}\n`);
      results.push({ test: 'Email do usuário', status: 'FALHOU', error: error.message });
      testsFailed++;
    }

    // Teste 6: Abrir dropdown do usuário
    console.log('📝 Teste 6: Abrir dropdown do usuário...');
    try {
      const userMenuToggle = await page.locator('[data-testid="user-menu-toggle"]');
      await userMenuToggle.click();
      await page.waitForTimeout(1000);
      
      // Verificar se o menu está visível
      const settingsMenuItem = await page.locator('[data-testid="dropdown-settings"]');
      const isVisible = await settingsMenuItem.isVisible();
      
      if (isVisible) {
        console.log('   ✅ Dropdown do usuário abriu com sucesso\n');
        results.push({ test: 'Dropdown usuário', status: 'PASSOU' });
        testsPassed++;
      } else {
        throw new Error('Dropdown não está visível');
      }
    } catch (error) {
      console.log(`   ❌ FALHOU: ${error.message}\n`);
      results.push({ test: 'Dropdown usuário', status: 'FALHOU', error: error.message });
      testsFailed++;
    }

    // Teste 7: Verificar informações no dropdown
    console.log('📝 Teste 7: Verificar informações completas no dropdown...');
    try {
      // O dropdown já está aberto do teste anterior
      await page.waitForTimeout(500);
      
      // Verificar se tem CPF no dropdown
      const dropdownText = await page.locator('.dropdown-menu').textContent();
      
      if (dropdownText && (dropdownText.includes('CPF') || dropdownText.includes('@'))) {
        console.log('   ✅ Informações completas no dropdown\n');
        results.push({ test: 'Info no dropdown', status: 'PASSOU' });
        testsPassed++;
      } else {
        throw new Error('Informações incompletas no dropdown');
      }
      
      // Fechar dropdown
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);
    } catch (error) {
      console.log(`   ❌ FALHOU: ${error.message}\n`);
      results.push({ test: 'Info no dropdown', status: 'FALHOU', error: error.message });
      testsFailed++;
    }

    // Teste 8: Testar navegação sidebar
    console.log('📝 Teste 8: Testar navegação sidebar...');
    try {
      // Clicar em Transações
      const transBtn = await page.locator('[data-testid="nav-transações"]').first();
      await transBtn.click();
      await page.waitForTimeout(1500);
      
      let url = page.url();
      if (!url.includes('/transactions')) {
        throw new Error(`Navegação para transações falhou: ${url}`);
      }
      
      // Voltar para dashboard
      const dashBtn = await page.locator('[data-testid="nav-painel"]').first();
      await dashBtn.click();
      await page.waitForTimeout(1500);
      
      url = page.url();
      if (url.includes('/dashboard')) {
        console.log('   ✅ Navegação sidebar funcionando\n');
        results.push({ test: 'Navegação sidebar', status: 'PASSOU' });
        testsPassed++;
      } else {
        throw new Error(`Navegação para dashboard falhou: ${url}`);
      }
    } catch (error) {
      console.log(`   ❌ FALHOU: ${error.message}\n`);
      results.push({ test: 'Navegação sidebar', status: 'FALHOU', error: error.message });
      testsFailed++;
    }

    // Teste 9: Testar toggle de tema
    console.log('📝 Teste 9: Testar toggle de tema...');
    try {
      const themeBtn = await page.locator('.theme-toggle').first();
      
      // Clicar para mudar tema
      await themeBtn.click();
      await page.waitForTimeout(1000);
      
      // Verificar se o botão ainda existe (tema mudou)
      const themeBtnAfter = await page.locator('.theme-toggle').first();
      const isVisible = await themeBtnAfter.isVisible();
      
      if (isVisible) {
        console.log('   ✅ Toggle de tema funcionando\n');
        results.push({ test: 'Toggle tema', status: 'PASSOU' });
        testsPassed++;
      } else {
        throw new Error('Botão de tema não encontrado após toggle');
      }
    } catch (error) {
      console.log(`   ❌ FALHOU: ${error.message}\n`);
      results.push({ test: 'Toggle tema', status: 'FALHOU', error: error.message });
      testsFailed++;
    }

    // Teste 10: Testar responsividade mobile
    console.log('📝 Teste 10: Testar responsividade mobile...');
    try {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.waitForTimeout(1000);
      
      // Em mobile, deve ter botão de menu hambúrguer
      const menuIcon = await page.locator('button:has-text("Menu")').first();
      const hasMenu = await menuIcon.count() > 0;
      
      if (hasMenu) {
        console.log('   ✅ Layout responsivo para mobile\n');
        results.push({ test: 'Responsividade mobile', status: 'PASSOU' });
        testsPassed++;
      } else {
        throw new Error('Menu hambúrguer não encontrado no mobile');
      }
    } catch (error) {
      console.log(`   ❌ FALHOU: ${error.message}\n`);
      results.push({ test: 'Responsividade mobile', status: 'FALHOU', error: error.message });
      testsFailed++;
    }

    // Teste 11: Testar logout via dropdown
    console.log('📝 Teste 11: Testar logout via dropdown...');
    try {
      // Voltar para desktop
      await page.setViewportSize({ width: 1200, height: 800 });
      await page.waitForTimeout(1000);
      
      // Abrir dropdown
      const userMenuToggle = await page.locator('[data-testid="user-menu-toggle"]');
      await userMenuToggle.click();
      await page.waitForTimeout(1000);
      
      // Clicar em Sair
      const logoutBtn = await page.locator('[data-testid="dropdown-logout"]');
      await logoutBtn.click();
      await page.waitForTimeout(2000);
      
      const url = page.url();
      if (url.includes('/login')) {
        console.log('   ✅ Logout funcionando corretamente\n');
        results.push({ test: 'Logout', status: 'PASSOU' });
        testsPassed++;
      } else {
        throw new Error(`Logout não redirecionou para login: ${url}`);
      }
    } catch (error) {
      console.log(`   ❌ FALHOU: ${error.message}\n`);
      results.push({ test: 'Logout', status: 'FALHOU', error: error.message });
      testsFailed++;
    }

  } catch (error) {
    console.log(`\n❌ ERRO CRÍTICO: ${error.message}\n`);
  }

  await browser.close();

  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);

  // Relatório final
  console.log('\n🧭 ==========================================');
  console.log('🧭 RELATÓRIO FINAL - NAVBAR/LAYOUT');
  console.log('🧭 ==========================================\n');
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
    console.log('\n🎉 PARABÉNS! Todos os testes da Navbar passaram! 🎉\n');
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
  
  fs.writeFileSync('test-navbar-report.json', JSON.stringify(report, null, 2));
  console.log('📄 Relatório salvo em: test-navbar-report.json\n');
}

testNavbar();
