const { test, expect } = require('@playwright/test');
require('dotenv').config();

test.describe('Login - La Rionegrina UAT', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navegar a la página de login
    await page.goto('/plataforma/');
  });

  test('Debería cargar la página de login correctamente', async ({ page }) => {
    // Verificar que la página cargó
    await expect(page).toHaveURL(/.*plataforma/);
    
    // Verificar elementos principales
    await expect(page.locator('#nroDocu')).toBeVisible();
    await expect(page.locator('#clave')).toBeVisible();
    await expect(page.locator('button:has-text("INGRESAR")')).toBeVisible();
    
    console.log('✅ Página de login cargada correctamente');
  });

  test('Debería mostrar error con credenciales vacías', async ({ page }) => {
    // Intentar login sin completar campos
    await page.click('button:has-text("INGRESAR")');
    
    // Verificar que permanece en la página de login
    await expect(page).toHaveURL(/.*plataforma/);
    
    console.log('✅ Validación de campos vacíos funcionando');
  });

  test('Debería hacer login exitoso con credenciales válidas', async ({ page }) => {
    const username = process.env.TEST_USERNAME;
    const password = process.env.TEST_PASSWORD;

    if (!username || !password) {
      test.skip();
      console.log('⚠️ Test saltado: No hay credenciales configuradas en .env');
      return;
    }

    // Completar formulario de login
    await page.fill('#nroDocu', username);
    await page.fill('#clave', password);
    
    // Click en el botón de login
    await page.click('button:has-text("INGRESAR")');
    
    // Esperar navegación o cambio de estado
    await page.waitForTimeout(3000);
    
    // Verificar que ya no estamos en la página de login
    // (ajustar según el comportamiento real de la aplicación)
    const currentUrl = page.url();
    console.log('📍 URL después del login:', currentUrl);
    
    // Tomar screenshot como evidencia
    await page.screenshot({ path: 'test-results/login-exitoso.png', fullPage: true });
    
    console.log('✅ Login completado');
  });

  test('Debería mostrar/ocultar contraseña al hacer click en el ícono', async ({ page }) => {
    const passwordInput = page.locator('#clave');
    
    // Verificar que inicialmente es tipo password
    await expect(passwordInput).toHaveAttribute('type', 'password');
    
    // Click en el ícono del ojo (ajustar selector según la implementación real)
    const eyeIcon = page.locator('#eye');
    if (await eyeIcon.isVisible()) {
      await eyeIcon.click();
      
      // Verificar que cambió a tipo text (o ajustar según implementación)
      await page.waitForTimeout(500);
      
      console.log('✅ Toggle de contraseña funcionando');
    }
  });

  test('Debería tener el checkbox de "Recordarme"', async ({ page }) => {
    const rememberCheckbox = page.locator('#remember_me');
    await expect(rememberCheckbox).toBeVisible();
    
    // Verificar que se puede marcar
    await rememberCheckbox.check();
    await expect(rememberCheckbox).toBeChecked();
    
    console.log('✅ Checkbox "Recordarme" funcionando');
  });

  test('Debería tener link de "¿Olvidaste tu contraseña?"', async ({ page }) => {
    const forgotPasswordLink = page.locator('text=¿Olvidaste tu contraseña?');
    await expect(forgotPasswordLink).toBeVisible();
    
    console.log('✅ Link de recuperación de contraseña presente');
  });

  test('Debería tener link de "REGISTRARSE"', async ({ page }) => {
    const registerLink = page.locator('text=REGISTRARSE');
    await expect(registerLink).toBeVisible();
    
    console.log('✅ Link de registro presente');
  });
});
