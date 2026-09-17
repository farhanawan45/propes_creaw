const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const EXE =
  process.env.LOCALAPPDATA +
  String.fromCharCode(92) +
  "ms-playwright" +
  String.fromCharCode(92) +
  "chromium-1243" +
  String.fromCharCode(92) +
  "chrome-win64" +
  String.fromCharCode(92) +
  "chrome.exe";
const outDir = "shots";
fs.mkdirSync(outDir, { recursive: true });

(async () => {
  const browser = await chromium.launch({ executablePath: EXE });

  for (const w of [390, 768, 1440, 1920]) {
    const context = await browser.newContext({ viewport: { width: w, height: w >= 1440 ? 900 : 844 } });
    const page = await context.newPage();
    await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.evaluate(() => sessionStorage.setItem("pc-preloader-shown", "1"));
    await page.reload({ waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForTimeout(2600);

    const section = await page.$("#work");
    const box = await section.boundingBox();

    // Position 1: top of Work section (card 1 visible)
    await page.evaluate((y) => window.scrollTo(0, y), box.y - 50);
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(outDir, `stack-p1-${w}.png`) });

    // Position 2: partway through (card stacking)
    await page.evaluate((y) => window.scrollTo(0, y), box.y + box.height * 0.45);
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(outDir, `stack-p2-${w}.png`) });

    // Position 3: near the end (last card)
    await page.evaluate((y) => window.scrollTo(0, y), box.y + box.height * 0.9);
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(outDir, `stack-p3-${w}.png`) });

    await context.close();
  }
  await browser.close();
  console.log("done");
})();
