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
  await page.evaluate(() => sessionStorage.setItem("pc-preloader-shown", "1"));
  await page.reload({ waitUntil: "load", timeout: 30000 });
  await page.waitForTimeout(4000);

  const text = await page.evaluate(() => {
    const el = document.querySelector("nextjs-portal");
    if (!el || !el.shadowRoot) return null;
    return el.shadowRoot.innerHTML;
  });
  fs.writeFileSync("shots/overlay-full-dump.html", String(text));

  // Try clicking the dev tools button to expand the menu
  const btn = await page.evaluateHandle(() => {
    const el = document.querySelector("nextjs-portal");
    return el && el.shadowRoot ? el.shadowRoot.querySelector("#next-logo") : null;
  });
  if (btn) {
    const box = await btn.asElement()?.boundingBox();
    if (box) {
      await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
      await page.waitForTimeout(600);
      await page.screenshot({ path: "shots/overlay-menu.png" });
      const menuText = await page.evaluate(() => {
        const el = document.querySelector("nextjs-portal");
        return el && el.shadowRoot ? el.shadowRoot.innerHTML : null;
      });
      fs.writeFileSync("shots/overlay-menu-dump.html", String(menuText));
    }
  }

  await browser.close();
  console.log("done");
})();
