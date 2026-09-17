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
  page.on("console", (m) => {
    if (m.type() === "error" || m.type() === "warning") {
      console.log("CONSOLE:", m.type(), m.text().slice(0, 3000));
    }
  });
  page.on("pageerror", (e) => console.log("PAGEERROR:", e.message.slice(0, 3000)));

  await page.goto("http://localhost:3000", { waitUntil: "load", timeout: 30000 });
  await page.waitForTimeout(9000);
  await browser.close();
})();
