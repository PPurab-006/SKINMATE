const puppeteer = require("puppeteer-core");
const fs = require("fs");
const path = require("path");

const OUTPUT_DIR = path.resolve(__dirname, "../assets/screen-recordings");

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const browser = await puppeteer.launch({
    executablePath: "/usr/bin/google-chrome",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--hide-scrollbars"
    ],
    headless: "new"
  });

  // 1. VERTICAL 9:16 CAPTURE (1080 x 1920)
  console.log("=== Capturing 9:16 Vertical High-Res Frames ===");
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 2 });
  await page.goto("http://127.0.0.1:5173", { waitUntil: "networkidle0" });
  await sleep(1000);

  // Scene 3: Homepage Hero & Discovery
  await page.screenshot({ path: path.join(OUTPUT_DIR, "v_scene3_hero.png") });
  console.log("Captured v_scene3_hero.png");

  // Hover over "Discover Your Skin & Hair"
  const skinBtnHandle = await page.evaluateHandle(() => {
    const btns = Array.from(document.querySelectorAll("button"));
    return btns.find(b => b.innerText.includes("Discover Your Skin & Hair"));
  });
  if (skinBtnHandle) {
    const box = await skinBtnHandle.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await sleep(300);
      await page.screenshot({ path: path.join(OUTPUT_DIR, "v_scene3_hover.png") });
    }
  }

  // Navigate to My Skin & Hair
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll("button"));
    const b = btns.find(x => x.innerText.includes("Discover Your Skin & Hair") || x.innerText.includes("My Skin & Hair"));
    if (b) b.click();
  });
  await sleep(1200);

  // Scene 4: Skin Analysis Diagnostic Overview
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await sleep(400);
  await page.screenshot({ path: path.join(OUTPUT_DIR, "v_scene4_biometrics_cards.png") });
  console.log("Captured v_scene4_biometrics_cards.png");

  // Scroll to Diagnostic Portrait & Targeted Recommendations
  await page.evaluate(() => {
    const target = document.querySelector(".grid") || document.body;
    window.scrollBy({ top: 620, behavior: "instant" });
  });
  await sleep(600);
  await page.screenshot({ path: path.join(OUTPUT_DIR, "v_scene4_split_view.png") });
  console.log("Captured v_scene4_split_view.png");

  // Close-up on Targeted Recommendation card
  await page.evaluate(() => {
    window.scrollBy({ top: 200, behavior: "instant" });
  });
  await sleep(400);
  await page.screenshot({ path: path.join(OUTPUT_DIR, "v_scene4_recommendation_focus.png") });
  console.log("Captured v_scene4_recommendation_focus.png");

  // Scene 5: Routine Curator (The Hero Feature)
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll("button"));
    const b = btns.find(x => x.innerText.includes("My Routine"));
    if (b) b.click();
  });
  await sleep(1000);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await sleep(400);

  // Shot 5A: Assembled Routine Overview (Morning Sequence + Harmonious Pairing + Budget)
  await page.screenshot({ path: path.join(OUTPUT_DIR, "v_scene5_routine_assembled.png") });
  console.log("Captured v_scene5_routine_assembled.png");

  // Scroll down slightly to center the steps
  await page.evaluate(() => window.scrollBy({ top: 180, behavior: "instant" }));
  await sleep(300);
  await page.screenshot({ path: path.join(OUTPUT_DIR, "v_scene5_routine_steps.png") });
  console.log("Captured v_scene5_routine_steps.png");

  // Shot 5B: Open Replace modal on Gentle Cleanser
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll("button"));
    const replaceBtn = btns.find(b => b.innerText.includes("Replace"));
    if (replaceBtn) replaceBtn.click();
  });
  await sleep(700);
  await page.screenshot({ path: path.join(OUTPUT_DIR, "v_scene5_replace_modal.png") });
  console.log("Captured v_scene5_replace_modal.png");

  // Shot 5C: Select Alternative (e.g. CeraVe or Derma Co)
  await page.evaluate(() => {
    const selectBtns = Array.from(document.querySelectorAll("button")).filter(b => b.innerText.includes("Select Formula"));
    if (selectBtns.length > 0) {
      // Click the first alternative (The Derma Co or CeraVe)
      selectBtns[0].click();
    }
  });
  await sleep(800);
  await page.screenshot({ path: path.join(OUTPUT_DIR, "v_scene5_routine_updated.png") });
  console.log("Captured v_scene5_routine_updated.png");

  // Shot 5D: Save Routine feedback
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll("button"));
    const saveBtn = btns.find(b => b.innerText.includes("Save Routine"));
    if (saveBtn) saveBtn.click();
  });
  await sleep(600);
  await page.screenshot({ path: path.join(OUTPUT_DIR, "v_scene5_routine_saved.png") });
  console.log("Captured v_scene5_routine_saved.png");

  // 2. HORIZONTAL 16:9 CAPTURE (1920 x 1080)
  console.log("=== Capturing 16:9 Horizontal High-Res Frames ===");
  const pageH = await browser.newPage();
  await pageH.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 });
  await pageH.goto("http://127.0.0.1:5173", { waitUntil: "networkidle0" });
  await sleep(1000);

  // Scene 3 Horizontal
  await pageH.screenshot({ path: path.join(OUTPUT_DIR, "h_scene3_hero.png") });
  console.log("Captured h_scene3_hero.png");

  // Scene 4 Horizontal: My Skin & Hair
  await pageH.evaluate(() => {
    const btns = Array.from(document.querySelectorAll("button"));
    const b = btns.find(x => x.innerText.includes("My Skin & Hair"));
    if (b) b.click();
  });
  await sleep(1000);
  await pageH.evaluate(() => window.scrollBy({ top: 380, behavior: "instant" }));
  await sleep(400);
  await pageH.screenshot({ path: path.join(OUTPUT_DIR, "h_scene4_analysis.png") });
  console.log("Captured h_scene4_analysis.png");

  // Scene 5 Horizontal: Routine Curator
  await pageH.evaluate(() => {
    const btns = Array.from(document.querySelectorAll("button"));
    const b = btns.find(x => x.innerText.includes("My Routine"));
    if (b) b.click();
  });
  await sleep(1000);
  await pageH.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await sleep(400);
  await pageH.screenshot({ path: path.join(OUTPUT_DIR, "h_scene5_routine.png") });
  console.log("Captured h_scene5_routine.png");

  // Open modal in horizontal view
  await pageH.evaluate(() => {
    const btns = Array.from(document.querySelectorAll("button"));
    const replaceBtn = btns.find(b => b.innerText.includes("Replace"));
    if (replaceBtn) replaceBtn.click();
  });
  await sleep(700);
  await pageH.screenshot({ path: path.join(OUTPUT_DIR, "h_scene5_modal.png") });
  console.log("Captured h_scene5_modal.png");

  await browser.close();
  console.log("=== All High-Res Real App Captures Completed Successfully! ===");
})();
