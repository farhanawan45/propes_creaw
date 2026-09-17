const { chromium } = require("playwright");
const url = process.argv[2] || "http://localhost:3000";
const w = Number(process.argv[3]) || 1440;
const h = Number(process.argv[4]) || 900;

(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.LOCALAPPDATA + String.fromCharCode(92) + "ms-playwright" + String.fromCharCode(92) + "chromium-1243" + String.fromCharCode(92) + "chrome-win64" + String.fromCharCode(92) + "chrome.exe",
  });
  const context = await browser.newContext({ viewport: { width: w, height: h } });
  const page = await context.newPage();
  page.on("console", async (m) => {
    if (m.type() === "warning" || m.type() === "error") {
      const args = await Promise.all(m.args().map((a) => a.jsonValue().catch(() => "?")));
      console.log(m.type().toUpperCase(), JSON.stringify(args));
      const loc = m.location();
      console.log("  at", loc.url, loc.lineNumber);
    }
  });
  await page.goto(url, { waitUntil: "load", timeout: 30000 });
  await page.waitForTimeout(4000);
  await browser.close();
})();
