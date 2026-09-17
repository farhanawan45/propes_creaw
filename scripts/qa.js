const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const EXE = process.env.LOCALAPPDATA + String.fromCharCode(92) + "ms-playwright" + String.fromCharCode(92) + "chromium-1243" + String.fromCharCode(92) + "chrome-win64" + String.fromCharCode(92) + "chrome.exe";
const HEIGHTS = { 390: 844, 768: 1024, 1440: 900, 1920: 1080 };
const outDir = "shots";
fs.mkdirSync(outDir, { recursive: true });

async function scrollShots(page, w, prefix) {
  const sections = ["home", "about", "services", "work", "contact"];
  for (const id of sections) {
    await page.evaluate((sid) => {
      const lenis = window.__lenis;
      const el = document.getElementById(sid);
      if (!el) return;
      if (lenis) lenis.scrollTo(el, { immediate: true, force: true });
      else window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY);
    }, id);
    await page.waitForTimeout(700);
    await page.screenshot({ path: path.join(outDir, `${prefix}-${w}-${id}.png`) });
  }
  // footer
  await page.evaluate(() => {
    const lenis = window.__lenis;
    const footer = document.querySelector("footer");
    if (lenis) lenis.scrollTo(footer, { immediate: true, force: true });
  });
  await page.waitForTimeout(700);
  await page.screenshot({ path: path.join(outDir, `${prefix}-${w}-footer.png`) });
}

(async () => {
  const browser = await chromium.launch({ executablePath: EXE });

  for (const w of [390, 768, 1440, 1920]) {
    const h = HEIGHTS[w];
    const context = await browser.newContext({ viewport: { width: w, height: h } });
    const page = await context.newPage();
    await page.goto("http://localhost:3000", { waitUntil: "load", timeout: 30000 });
    await page.waitForTimeout(3200); // preloader
    await scrollShots(page, w, "scroll");
    await context.close();
  }

  // Hover states at 1440
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    await page.goto("http://localhost:3000", { waitUntil: "load" });
    await page.waitForTimeout(3200);

    await page.hover('header a:has-text("About")', { force: true });
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(outDir, "hover-nav-about.png") });

    await page.hover('header >> text=Get a Quote', { force: true });
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(outDir, "hover-cta.png") });

    await page.evaluate(() => window.__lenis.scrollTo(document.getElementById("services"), { immediate: true, force: true }));
    await page.waitForTimeout(1200);
    await page.screenshot({ path: path.join(outDir, "services-entrance.png") });

    const dot = page.locator("[data-orbit-dot]").nth(3);
    await dot.hover({ force: true });
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(outDir, "hover-service-node.png") });

    await page.evaluate(() => window.__lenis.scrollTo(document.getElementById("work"), { immediate: true, force: true }));
    await page.waitForTimeout(700);
    await page.screenshot({ path: path.join(outDir, "work-view.png") });

    await context.close();
  }

  // Menu + preloader first-visit
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    await page.goto("http://localhost:3000", { waitUntil: "load" });
    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(outDir, "preloader-mid.png") });
    await page.waitForTimeout(3000);
    await page.click('[aria-label="Open menu"]');
    await page.waitForTimeout(700);
    await page.screenshot({ path: path.join(outDir, "fullscreen-menu.png") });
    await context.close();
  }

  await browser.close();
  console.log("DONE");
})();
