const { chromium } = require("playwright");
const sizes = [
  { w: 2400, h: 1350, name: "1920at80pct" },
  { w: 1707, h: 960, name: "1366at80pct" },
];
(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.LOCALAPPDATA + "\\ms-playwright\\chromium-1243\\chrome-win64\\chrome.exe",
  });
  for (const size of sizes) {
    const context = await browser.newContext({ viewport: { width: size.w, height: size.h } });
    const page = await context.newPage();
    await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
    await page.waitForTimeout(2800);
    await page.screenshot({ path: `shots/${size.name}-hero.png` });

    const sections = ["about", "services", "work", "contact"];
    for (const id of sections) {
      await page.evaluate((sid) => {
        window.__lenis.scrollTo(document.getElementById(sid), { immediate: true, force: true, offset: -30 });
      }, id);
      await page.waitForTimeout(400);
      await page.screenshot({ path: `shots/${size.name}-${id}-top.png` });
    }
    await context.close();
  }
  await browser.close();
})();
