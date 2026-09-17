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
  const w = process.argv[2] ? Number(process.argv[2]) : 1440;
  const h = w >= 1440 ? 1400 : 2200;
  const context = await browser.newContext({ viewport: { width: w, height: h } });
  const page = await context.newPage();
  await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.evaluate(() => sessionStorage.setItem("pc-preloader-shown", "1"));
  await page.reload({ waitUntil: "domcontentloaded", timeout: 30000 });
  await page.waitForTimeout(2600);
  await page.evaluate(() => {
    const el = document.getElementById("contact");
    const lenis = window.__lenis;
    if (lenis) lenis.scrollTo(el, { immediate: true, force: true });
    else el?.scrollIntoView();
  });
  await page.waitForTimeout(1000);
  const el = await page.$("#contact");
  await el.screenshot({ path: path.join(outDir, `contact-${w}.png`) });
  await browser.close();
  console.log("done");
})();
