const { chromium } = require("playwright");
const { AxeBuilder } = require("@axe-core/playwright");

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
  // Skip preloader on first visit.
  await page.evaluate(() => sessionStorage.setItem("pc-preloader-shown", "1"));
  await page.reload({ waitUntil: "load" });
  await page.waitForTimeout(4000);

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();

  const contrastViolations = results.violations.filter((v) => v.id === "color-contrast");
  const otherViolations = results.violations.filter((v) => v.id !== "color-contrast");

  console.log(`Total violations: ${results.violations.length}`);
  console.log(`Contrast violations: ${contrastViolations.length}`);
  for (const v of contrastViolations) {
    console.log(`\n[${v.id}] ${v.help}`);
    for (const node of v.nodes) {
      console.log(`  - ${node.target.join(" ")}`);
      console.log(`    ${node.failureSummary?.replace(/\n/g, " ")}`);
    }
  }
  if (otherViolations.length) {
    console.log(`\nOther violations:`);
    for (const v of otherViolations) {
      console.log(`[${v.id}] ${v.help} (${v.nodes.length} nodes)`);
      for (const node of v.nodes.slice(0, 3)) {
        console.log(`  - ${node.target.join(" ")}`);
      }
    }
  }

  await browser.close();
  process.exit(results.violations.length > 0 ? 1 : 0);
})();
