const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  console.log('Navegando para http://java.local:3000/login...');
  await page.goto('http://java.local:3000/login', { waitUntil: 'networkidle' });

  // Aguardar o formulário de login carregar
  await page.waitForSelector('input[type="email"]', { timeout: 10000 });

  // Capturar screenshot
  await page.screenshot({ path: 'login-screenshot.png', fullPage: true });
  console.log('Screenshot salva como login-screenshot.png');

  // Verificar posição do Paper (container do formulário)
  const paperBox = await page.locator('div[class*="MuiPaper-root"]').first().boundingBox();
  
  if (paperBox) {
    console.log('\n=== INFORMAÇÕES DO LAYOUT ===');
    console.log(`Posição X: ${paperBox.x}px`);
    console.log(`Posição Y: ${paperBox.y}px`);
    console.log(`Largura: ${paperBox.width}px`);
    console.log(`Altura: ${paperBox.height}px`);
    
    const viewportWidth = 1920;
    const viewportHeight = 1080;
    
    const centerX = viewportWidth / 2;
    const centerY = viewportHeight / 2;
    const elementCenterX = paperBox.x + (paperBox.width / 2);
    const elementCenterY = paperBox.y + (paperBox.height / 2);
    
    console.log(`\nCentro da viewport: (${centerX}, ${centerY})`);
    console.log(`Centro do elemento: (${elementCenterX}, ${elementCenterY})`);
    
    const offsetX = Math.abs(centerX - elementCenterX);
    const offsetY = Math.abs(centerY - elementCenterY);
    
    console.log(`\nDesvio horizontal: ${offsetX.toFixed(2)}px`);
    console.log(`Desvio vertical: ${offsetY.toFixed(2)}px`);
    
    // Considerar centralizado se desvio < 50px
    const isCentered = offsetX < 50 && offsetY < 50;
    
    if (isCentered) {
      console.log('\n✅ O formulário ESTÁ CENTRALIZADO na tela');
    } else {
      console.log('\n❌ O formulário NÃO ESTÁ CENTRALIZADO na tela');
      console.log(`   Precisa ajustar ${offsetX > 50 ? 'horizontalmente' : ''} ${offsetY > 50 ? 'verticalmente' : ''}`);
    }
  } else {
    console.log('\n❌ Não foi possível encontrar o formulário de login');
  }

  // Verificar se há algum elemento acima do formulário
  const bodyBox = await page.locator('body').boundingBox();
  console.log(`\n=== INFORMAÇÕES DO BODY ===`);
  console.log(`Body height: ${bodyBox.height}px`);
  console.log(`Viewport height: 1080px`);

  // Manter navegador aberto por 5 segundos para visualização
  console.log('\nMantenha a janela aberta para inspeção visual...');
  await page.waitForTimeout(5000);

  await browser.close();
})();
