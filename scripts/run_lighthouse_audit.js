import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

async function runLighthouseAndAccessibilityAudit() {
  console.log('🛡️ Running Automated Accessibility & Performance Audit...');

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext();
  const page = await context.newPage();
  const startTime = Date.now();
  await page.goto('http://127.0.0.1:5173', { waitUntil: 'domcontentloaded' });
  const loadTimeMs = Date.now() - startTime;

  const results = await new AxeBuilder({ page }).analyze();

  console.log('----------------------------------------------------');
  console.log(`⏱️ DOM Load Time: ${loadTimeMs} ms`);
  console.log(`♿ Accessibility Violations: ${results.violations.length}`);
  console.log(`✨ Accessibility Passes: ${results.passes.length}`);
  console.log('----------------------------------------------------');

  console.log('✅ Automated Audit Completed Successfully!');
  await browser.close();
}

runLighthouseAndAccessibilityAudit().catch(err => {
  console.error('Audit Error:', err);
  process.exit(1);
});
