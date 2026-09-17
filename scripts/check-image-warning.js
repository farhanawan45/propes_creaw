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
  for (const w of [390, 768, 1440]) {
    const context = await browser.newContext({ viewport: { width: w, height: w >= 1440 ? 900 : 1400 } });
    const page = await context.newPage();
    const warnings = [];
    page.on("console", (m) => {
      if (m.type() === "warning" && m.text().includes('has "fill"')) warnings.push(m.text());
    });

    // Genuine fresh navigation, no sessionStorage trick, no reload.
    await page.goto("http://localhost:3000", { waitUntil: "load", timeout: 30000 });
    await page.waitForTimeout(9000); // let the real preloader finish
    await page.evaluate(() => {
      const el = document.getElementById("work");
      const lenis = window.__lenis;
      if (lenis) lenis.scrollTo(el, { immediate: true, force: true });
      else el?.scrollIntoView();
    });
    await page.waitForTimeout(2000);

    console.log(`viewport ${w}: fill-height-0 warnings:`, warnings.length);
    for (const wm of warnings) console.log(" -", wm.slice(0, 160));
    await context.close();
  }
  await browser.close();
})();
