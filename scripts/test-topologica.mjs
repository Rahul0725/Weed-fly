import { chromium } from 'playwright';
import { createServer } from 'http';
import handler from 'serve-handler';

async function testGame() {
  const server = createServer((req, res) => {
    return handler(req, res, { public: 'dist' });
  });

  server.listen(4173, async () => {
    console.log('Test server running at http://localhost:4173');

    const browser = await chromium.launch({
      headless: true,
      args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist']
    });

    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 }
    });

    const page = await context.newPage();

    const consoleMessages = [];
    page.on('console', msg => {
      consoleMessages.push(`[${msg.type()}] ${msg.text()}`);
    });

    page.on('pageerror', err => {
      consoleMessages.push(`[PAGE ERROR] ${err.toString()}`);
    });

    await page.goto('http://localhost:4173');
    await page.waitForTimeout(1000);

    const title = await page.title();
    console.log('Page Title:', title);

    const startButton = page.locator('button:has-text("Initiate Resonance")');
    if (await startButton.isVisible()) {
      console.log('Initiate Resonance button is visible! Clicking...');
      await startButton.click();
      await page.waitForTimeout(1500);
    }

    const hud = page.locator('text=Harmonic Tensor Dials');
    const isHudVisible = await hud.isVisible();
    console.log('HUD Visible:', isHudVisible);

    const snapButton = page.locator('button:has-text("3:2 Fifth")');
    if (await snapButton.isVisible()) {
      console.log('Clicking 3:2 Fifth snap button...');
      await snapButton.click();
      await page.waitForTimeout(500);
    }

    console.log('All Console Logs during test:');
    consoleMessages.forEach(m => console.log('  ', m));

    await browser.close();
    server.close();
    console.log('Test completed successfully!');
    process.exit(0);
  });
}

testGame().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
