const { chromium } = require("playwright");

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

(async () => {
  const browser = await chromium.launch({ executablePath: EXE });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.evaluate(() => sessionStorage.setItem("pc-preloader-shown", "1"));
  await page.reload({ waitUntil: "domcontentloaded", timeout: 30000 });
  await page.waitForTimeout(2600);

  const section = await page.$("#contact");
  const box = await section.boundingBox();
  console.log("section box:", box);

  // Scroll to just before the section, then step down through it,
  // recording the left column's top offset each time.
  const startY = box.y - 200;
  for (let offset = -100; offset < box.height; offset += 150) {
    await page.evaluate((y) => window.scrollTo(0, y), Math.max(0, startY + offset + 200));
    await page.waitForTimeout(150);
    const info = await page.evaluate(() => {
      const grid = document.querySelector("#contact .grid");
      const left = grid.children[0];
      const rect = left.getBoundingClientRect();
      const cs = getComputedStyle(left);
      return { top: rect.top, position: cs.position, cssTop: cs.top, scrollY: window.scrollY };
    });
    console.log(`offset=${offset}`, JSON.stringify(info));
  }

  await browser.close();
})();
