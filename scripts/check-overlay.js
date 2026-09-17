const { chromium } = require("playwright");
const fs = require("fs");

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
  await page.goto("http://localhost:3000", { waitUntil: "load", timeout: 30000 });
  await page.waitForTimeout(3000);

  // Next.js dev overlay renders inside a custom element / shadow DOM.
  const badge = await page.evaluate(() => {
    const el = document.querySelector("nextjs-portal");
    if (!el || !el.shadowRoot) return null;
    const btn = el.shadowRoot.querySelector('[data-nextjs-dev-tools-button]') ||
      el.shadowRoot.querySelector('button[aria-label*="issue" i]') ||
      el.shadowRoot.querySelector('[aria-label*="Issues" i]');
    return btn ? btn.outerHTML.slice(0, 2000) : "no badge button found; portal children: " + el.shadowRoot.innerHTML.slice(0, 3000);
  });
  fs.writeFileSync("shots/overlay-debug.txt", String(badge));
  await page.screenshot({ path: "shots/overlay-full.png" });
  await browser.close();
  console.log("done");
})();
