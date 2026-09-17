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

async function gotoContact(page) {
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
  await page.waitForTimeout(800);
}

(async () => {
  const browser = await chromium.launch({ executablePath: EXE });

  for (const w of [390, 768, 1440, 1920]) {
    const context = await browser.newContext({ viewport: { width: w, height: w >= 1440 ? 1000 : 1600 } });
    const page = await context.newPage();
    const consoleErrors = [];
    page.on("console", (m) => {
      if (m.type() === "error" && !m.text().includes("404")) consoleErrors.push(m.text());
    });

    await gotoContact(page);

    // Closed state
    await page.screenshot({ path: path.join(outDir, `ms-closed-${w}.png`) });

    // Open state
    const field = await page.$("#services-select");
    await field.click();
    await page.waitForTimeout(350);
    await page.screenshot({ path: path.join(outDir, `ms-open-${w}.png`) });

    // Search
    await page.keyboard.type("Cruise");
    await page.waitForTimeout(250);
    await page.screenshot({ path: path.join(outDir, `ms-search-${w}.png`) });
    await page.keyboard.press("Control+a");
    await page.keyboard.press("Delete");
    await page.waitForTimeout(150);

    // Select a few via keyboard: ArrowDown + Enter twice
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(outDir, `ms-selected-in-panel-${w}.png`) });

    // Close via Escape -> focus should return to field
    await page.keyboard.press("Escape");
    await page.waitForTimeout(300);
    const focused = await page.evaluate(() => document.activeElement?.id);
    console.log(`[${w}] focus after Escape:`, focused);
    await page.screenshot({ path: path.join(outDir, `ms-chips-${w}.png`) });

    // Validation error: submit empty form (only contact-submit clicked, other fields empty)
    const submitBtn = await page.$("#contact-submit");
    await submitBtn.click();
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(outDir, `ms-error-check-${w}.png`) });

    console.log(`[${w}] console errors:`, consoleErrors);
    await context.close();
  }

  await browser.close();
  console.log("done");
})();
