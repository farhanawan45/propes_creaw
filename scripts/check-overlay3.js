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

async function getIssueCount(page) {
  return page.evaluate(() => {
    const el = document.querySelector("nextjs-portal");
    if (!el || !el.shadowRoot) return null;
    const btn = el.shadowRoot.querySelector("#next-logo");
    if (!btn) return "no button";
    return btn.getAttribute("aria-label");
  });
}

(async () => {
  const browser = await chromium.launch({ executablePath: EXE });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  const errors = [];
  page.on("console", (m) => {
    if (m.type() === "error" || m.type() === "warning") errors.push(m.text().slice(0, 500));
  });
  page.on("pageerror", (e) => errors.push("PAGEERROR: " + e.message.slice(0, 500)));

  await page.goto("http://localhost:3000", { waitUntil: "load", timeout: 30000 });
  await page.evaluate(() => sessionStorage.setItem("pc-preloader-shown", "1"));
  await page.reload({ waitUntil: "load", timeout: 30000 });
  await page.waitForTimeout(3000);
  console.log("after load:", await getIssueCount(page));

  await page.evaluate(() => {
    const el = document.getElementById("contact");
    const lenis = window.__lenis;
    if (lenis) lenis.scrollTo(el, { immediate: true, force: true });
    else el?.scrollIntoView();
  });
  await page.waitForTimeout(1000);
  console.log("after scroll to contact:", await getIssueCount(page));

  const dateBtn = await page.$("#eventDate");
  if (dateBtn) {
    await dateBtn.click();
    await page.waitForTimeout(500);
    console.log("after opening date picker:", await getIssueCount(page));
    await page.keyboard.press("Escape");
  }

  const nameInput = await page.$("#fullName");
  if (nameInput) {
    await nameInput.click();
    await nameInput.type("Test");
  }
  await page.waitForTimeout(300);
  console.log("after typing name:", await getIssueCount(page));

  const submitBtn = await page.$("#contact-submit");
  if (submitBtn) {
    await submitBtn.click();
    await page.waitForTimeout(500);
    console.log("after submit click (validation):", await getIssueCount(page));
  }

  console.log("--- console/page errors seen ---");
  for (const e of errors) console.log(e);

  await page.screenshot({ path: "shots/overlay-contact-check.png" });
  await browser.close();
})();
