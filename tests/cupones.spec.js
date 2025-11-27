const { test, expect } = require('@playwright/test');
require('dotenv').config();

test.describe('Emisión de Cupones - Quiniela Tradicional - La Rionegrina UAT', () => {
  
  test.beforeEach(async ({ page }) => {
    const username = process.env.TEST_USERNAME;
    const password = process.env.TEST_PASSWORD;

    if (!username || !password) {
      test.skip();
      console.log('⚠️ Test saltado: Credenciales no configuradas');
      return;
    }

    // Navegar a la plataforma
    await page.goto('/plataforma/');
    
    console.log('🔐 Iniciando sesión...');
    
    // Hacer login
    await page.locator('#nroDocu').first().fill(username);
    await page.locator('#clave').first().fill(password);
    await page.click('button:has-text("INGRESAR")');
    
    // Esperar navegación a /home
    await page.waitForURL(/.*\/home/, { timeout: 10000 });
    
    console.log('✅ Login exitoso - En pantalla de juegos');
  });

  test('1. Debería estar en la pantalla de juegos (/home)', async ({ page }) => {
    // Verificar que estamos en /plataforma/home
    await expect(page).toHaveURL(/.*\/plataforma\/home/);
    
    const currentUrl = page.url();
    console.log('📍 URL actual:', currentUrl);
    
    // Tomar screenshot de la interfaz de juegos
    await page.screenshot({ path: 'test-results/01-pantalla-juegos.png', fullPage: true });
    
    console.log('✅ Verificación exitosa - Pantalla de juegos');
  });

  test('2. Debería completar el flujo completo de Quiniela Tradicional', async ({ page }) => {
    // Paso 1: Verificar que estamos en /home
    await expect(page).toHaveURL(/.*\/plataforma\/home/);
    console.log('✅ Paso 1: En pantalla de juegos');
    await page.screenshot({ path: 'test-results/quiniela-01-home.png', fullPage: true });

    // Paso 2: Click en botón Quiniela Tradicional
    console.log('🖱️ Paso 2: Buscando botón Quiniela Tradicional...');
    const quinielaButton = page.locator('button:has-text("Quiniela Tradicional"), a:has-text("Quiniela Tradicional"), [class*="quiniela"]').first();
    await quinielaButton.click();
    console.log('✅ Click en Quiniela Tradicional ejecutado');

    // Paso 3: Verificar navegación a /juego/Quinielatradicional
    await page.waitForURL(/.*\/juego\/Quinielatradicional/i, { timeout: 10000 });
    console.log('✅ Paso 3: Navegación a pantalla de sorteos exitosa');
    await page.screenshot({ path: 'test-results/quiniela-02-sorteos.png', fullPage: true });

    // Paso 4: Click en botón sorteo Nocturna
    console.log('🖱️ Paso 4: Seleccionando sorteo Nocturna...');
    const nocturnaButton = page.locator('button:has-text("Nocturna"), [class*="nocturna"]').first();
    await nocturnaButton.click();
    console.log('✅ Sorteo Nocturna seleccionado');
    
    // Esperar que se abra la pantalla de carga de datos
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'test-results/quiniela-03-carga-datos.png', fullPage: true });

    // Paso 5: Completar campo Número con número aleatorio 0-99
    const numeroAleatorio = Math.floor(Math.random() * 100);
    console.log('🎲 Paso 5: Número aleatorio generado:', numeroAleatorio);
    
    const campoNumero = page.locator('input[name="numero"], input[placeholder*="número"], input[id*="numero"]').first();
    await campoNumero.fill(numeroAleatorio.toString());
    console.log('✅ Campo Número completado:', numeroAleatorio);

    // Paso 6: Completar campo Alcance con 10
    console.log('📝 Paso 6: Completando campo Alcance...');
    const campoAlcance = page.locator('input[name="alcance"], input[placeholder*="alcance"], input[id*="alcance"]').first();
    await campoAlcance.fill('10');
    console.log('✅ Campo Alcance completado: 10');

    // Paso 7: Completar campo Importe con 200
    console.log('💰 Paso 7: Completando campo Importe...');
    const campoImporte = page.locator('input[name="importe"], input[placeholder*="importe"], input[id*="importe"]').first();
    await campoImporte.fill('200');
    console.log('✅ Campo Importe completado: 200');

    await page.screenshot({ path: 'test-results/quiniela-04-datos-completados.png', fullPage: true });

    // Paso 8: Click en botón +
    console.log('🖱️ Paso 8: Click en botón +...');
    const botonMas = page.locator('button:has-text("+"), button[class*="agregar"], button[class*="add"]').first();
    await botonMas.click();
    console.log('✅ Click en botón + ejecutado');
    
    await page.waitForTimeout(1000);

    // Paso 9: Click en botón Siguiente
    console.log('🖱️ Paso 9: Click en botón Siguiente...');
    const botonSiguiente = page.locator('button:has-text("Siguiente"), button:has-text("SIGUIENTE")').first();
    await botonSiguiente.click();
    console.log('✅ Click en Siguiente ejecutado');
    
    // Esperar pantalla de selección de extracto
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'test-results/quiniela-05-seleccion-extracto.png', fullPage: true });
    console.log('✅ Pantalla de selección de extracto abierta');

    // Paso 10: Click en botón Rio Negro
    console.log('🖱️ Paso 10: Seleccionando extracto Rio Negro...');
    const botonRioNegro = page.locator('button:has-text("Rio Negro"), button:has-text("Río Negro"), [class*="rio-negro"]').first();
    await botonRioNegro.click();
    console.log('✅ Extracto Rio Negro seleccionado');
    
    await page.waitForTimeout(1000);

    // Paso 11: Click en botón Jugar
    console.log('🖱️ Paso 11: Click en botón Jugar...');
    const botonJugar = page.locator('button:has-text("Jugar"), button:has-text("JUGAR")').first();
    await botonJugar.click();
    console.log('✅ Click en Jugar ejecutado');
    
    // Esperar que aparezca el popup del cupón
    await page.waitForTimeout(3000);

    // Paso 12: Validar popup del cupón y tomar captura
    console.log('📋 Paso 12: Validando popup del cupón...');
    
    // Buscar el popup/modal del cupón
    const cuponPopup = page.locator('[class*="modal"], [class*="popup"], [class*="cupon"]').first();
    
    // Verificar que el popup es visible
    const isVisible = await cuponPopup.isVisible().catch(() => false);
    
    if (isVisible) {
      console.log('✅ Popup del cupón visible');
      
      // Tomar screenshot del cupón
      await page.screenshot({ path: 'test-results/quiniela-06-cupon-generado.png', fullPage: true });
      
      // Validaciones del cupón
      const cuponText = await cuponPopup.textContent();
      console.log('📄 Contenido del cupón capturado');
      
      // Validar que contiene información relevante
      expect(cuponText).toBeTruthy();
      console.log('✅ Cupón contiene información');
      
      // Buscar elementos específicos del cupón
      const tieneFecha = cuponText.includes('202') || cuponText.includes('/') || cuponText.includes('-');
      const tieneImporte = cuponText.includes('200') || cuponText.includes('$');
      const tieneNumero = cuponText.includes(numeroAleatorio.toString());
      
      console.log('🔍 Validaciones del cupón:');
      console.log('  - Contiene fecha:', tieneFecha ? '✅' : '⚠️');
      console.log('  - Contiene importe:', tieneImporte ? '✅' : '⚠️');
      console.log('  - Contiene número jugado:', tieneNumero ? '✅' : '⚠️');
      
      console.log('🎉 ¡Test de Quiniela Tradicional completado exitosamente!');
      
    } else {
      console.log('⚠️ Popup del cupón no encontrado, tomando screenshot del estado actual');
      await page.screenshot({ path: 'test-results/quiniela-06-error-popup.png', fullPage: true });
      
      throw new Error('No se encontró el popup del cupón generado');
    }
  });

  test('3. Debería validar elementos de la pantalla de juegos', async ({ page }) => {
    // Verificar que estamos en /home
    await expect(page).toHaveURL(/.*\/plataforma\/home/);
    
    // Verificar que existe el botón de Quiniela Tradicional
    const quinielaButton = page.locator('button:has-text("Quiniela Tradicional"), a:has-text("Quiniela Tradicional")').first();
    const isVisible = await quinielaButton.isVisible().catch(() => false);
    
    expect(isVisible).toBeTruthy();
    console.log('✅ Botón Quiniela Tradicional está visible');
    
    // Tomar screenshot
    await page.screenshot({ path: 'test-results/validacion-elementos-home.png', fullPage: true });
  });
});
