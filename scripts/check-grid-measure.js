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
  for (const w of [1440, 1920]) {
    const context = await browser.newContext({ viewport: { width: w, height: 1000 } });
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
    await page.waitForTimeout(800);

    const measurements = await page.evaluate(() => {
      const section = document.getElementById("contact");
      const grid = section.querySelector(".grid");
      const cols = grid.children;
      const left = cols[0].getBoundingClientRect();
      const right = cols[1].getBoundingClientRect();
      const container = grid.parentElement.getBoundingClientRect();
      const cs = getComputedStyle(grid);
      return {
        containerLeft: container.left,
        containerRight: container.right,
        containerWidth: container.width,
        containerCenter: container.left + container.width / 2,
        gridTemplateColumns: cs.gridTemplateColumns,
        columnGap: cs.columnGap,
        leftColWidth: left.width,
        leftColLeft: left.left,
        leftColRight: left.right,
        rightColWidth: right.width,
        rightColLeft: right.left,
        rightColRight: right.right,
        gapBetween: right.left - left.right,
      };
    });
    console.log(`--- viewport ${w} ---`);
    console.log(JSON.stringify(measurements, null, 2));
    await context.close();
  }
  await browser.close();
})();
