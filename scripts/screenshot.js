const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");

const HEIGHTS = { 390: 844, 768: 1024, 1440: 900, 1920: 1080 };
const outDir = process.argv[2] || "shots";
const url = process.argv[3] || "http://localhost:3000";
const widthsArg = process.argv[4];
const widths = widthsArg ? widthsArg.split(",").map(Number) : Object.keys(HEIGHTS).map(Number);

const SECTIONS = ["home", "about", "services", "services-mid", "work", "work-mid", "contact", "footer-cta", "footer-bottom"];

// Pinned + scrubbed sections need extra wheel scroll after landing on
// their start, otherwise the scrub progress (and therefore the reveal
// animation) is still at 0 — landing exactly on a pinned trigger's start
// is a real scroll position, but it's the *pre-animation* one.
// footer-bottom reuses the footer-cta landing spot, then wheels further
// down (more reliable than computing a Lenis scrollTo offset by hand).
const EXTRA_SCROLL = {
  "services-mid": 1.05,
  "work-mid": 1.1,
  "footer-bottom": 1.4,
};

(async () => {
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch({
    executablePath:
      process.env.LOCALAPPDATA + "\\ms-playwright\\chromium-1243\\chrome-win64\\chrome.exe",
  });

  const allErrors = [];

  for (const w of widths) {
    const h = HEIGHTS[w] || 1080;
    const context = await browser.newContext({ viewport: { width: w, height: h } });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (err) => errors.push(`pageerror: ${err.message}`));
    page.on("console", (msg) => {
      if (msg.type() === "error" && !msg.text().includes("404 (Not Found)")) {
        errors.push(`console: ${msg.text()}`);
      }
    });
    page.on("response", (res) => {
      if (res.status() >= 400 && !res.url().includes("/videos/intro.mp4")) {
        errors.push(`HTTP ${res.status()}: ${res.url()}`);
      }
    });

    await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
    await page.waitForTimeout(2800); // preloader

    // Scroll all the way down in small steps first, so every
    // ScrollTrigger-based reveal/pin along the way actually fires
    // (a synthetic fullPage screenshot never dispatches scroll events).
    const scrollHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    const steps = Math.ceil(scrollHeight / (h * 0.5));
    for (let i = 0; i <= steps; i++) {
      await page.mouse.wheel(0, h * 0.5);
      await page.waitForTimeout(90);
    }
    await page.waitForTimeout(500);

    // Now walk back through named sections for section-level screenshots.
    // Lenis intercepts native scroll, so use its own scrollTo API (same
    // one the app itself uses) rather than window.scrollTo/scrollIntoView,
    // which Lenis would otherwise immediately fight/override.
    for (const id of SECTIONS) {
      const baseId = id === "footer-bottom" ? "footer-cta" : id.replace("-mid", "");
      await page.evaluate((sectionId) => {
        const lenis = window.__lenis;
        const target =
          sectionId === "footer-cta" ? document.querySelector("footer") : document.getElementById(sectionId);
        if (!target) return;

        if (lenis) {
          lenis.scrollTo(target, { immediate: true, force: true });
        } else {
          const y = target.getBoundingClientRect().top + window.scrollY;
          window.scrollTo(0, y);
        }
      }, baseId);
      await page.waitForTimeout(400);

      if (EXTRA_SCROLL[id]) {
        const extraSteps = 14;
        for (let i = 0; i < extraSteps; i++) {
          await page.mouse.wheel(0, (h * EXTRA_SCROLL[id]) / extraSteps);
          await page.waitForTimeout(70);
        }
        await page.waitForTimeout(400);
      }

      await page.screenshot({ path: path.join(outDir, `${w}-${id}.png`) });
    }

    await context.close();
    if (errors.length) {
      allErrors.push(`--- ${w}px ---`);
      allErrors.push(...errors);
    }
  }

  await browser.close();

  if (allErrors.length) {
    console.log("CONSOLE_ERRORS:");
    allErrors.forEach((e) => console.log(e));
  } else {
    console.log("NO_CONSOLE_ERRORS");
  }
})();
