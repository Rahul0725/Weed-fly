import { chromium } from 'playwright';
import GIFEncoder from 'gif-encoder-2';
import { PNG } from 'pngjs';
import path from 'path';
import fs from 'fs';

const ARTIFACT_DIR = '/home/codespace/.gemini/antigravity-cli/brain/a6ced550-166e-48b9-b948-3074b2cedee9';

async function recordLiveGameplayGif() {
  console.log('🎬 Recording Live Gameplay Animated GIF (60 FPS Simulation)...');

  const width = 640;
  const height = 360;

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
  });

  const context = await browser.newContext({ viewport: { width, height } });
  const page = await context.newPage();

  console.log('🌐 Loading game at http://127.0.0.1:5173...');
  await page.goto('http://127.0.0.1:5173', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(600);

  // Launch flight
  await page.keyboard.press('Space');
  await page.waitForTimeout(300);

  const encoder = new GIFEncoder(width, height);
  encoder.setDelay(80); // ~12 fps sampled GIF
  encoder.setRepeat(0); // Loop forever
  encoder.start();

  const totalFrames = 30; // 30 frames animation
  console.log(`🎥 Capturing ${totalFrames} consecutive flight frames...`);

  for (let frame = 0; frame < totalFrames; frame++) {
    // Flap periodically
    if (frame % 4 === 0) {
      await page.keyboard.press('Space');
    }

    const dataUrl = await page.evaluate(() => document.querySelector('canvas')?.toDataURL('image/png'));
    if (dataUrl) {
      const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
      const pngBuffer = Buffer.from(base64Data, 'base64');
      const png = PNG.sync.read(pngBuffer);

      // Read RGBA pixels and add to GIF frame
      encoder.addFrame(png.data);
    }
    await page.waitForTimeout(80);
  }

  encoder.finish();
  const gifBuffer = encoder.out.getData();
  const gifPath = path.join(ARTIFACT_DIR, 'live_gameplay_flight.gif');
  fs.writeFileSync(gifPath, gifBuffer);

  console.log(`✅ Animated GIF successfully created at: ${gifPath} (${Math.round(gifBuffer.length / 1024)} KB)`);
  await browser.close();
}

recordLiveGameplayGif().catch(err => {
  console.error('GIF Recording Error:', err);
  process.exit(1);
});
