const puppeteer = require("puppeteer-core");
const fs = require("fs");
const path = require("path");

const OUTPUT_DIR = path.resolve(__dirname, "../assets/screen-recordings/raw_frames");
const PORTRAIT_PATH = path.resolve(__dirname, "../assets/screen-recordings/demo_portrait.jpg");

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function injectCursor(page) {
  await page.evaluate(() => {
    if (document.getElementById("demo-mouse-cursor")) return;
    const cursor = document.createElement("div");
    cursor.id = "demo-mouse-cursor";
    cursor.innerHTML = `
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" style="filter: drop-shadow(0 2px 5px rgba(0,0,0,0.35));">
        <path d="M4 2L18 12L11 14L8 21L4 2Z" fill="#1A3026" stroke="#FFFFFF" stroke-width="2"/>
      </svg>
      <div id="demo-cursor-click" style="position: absolute; width: 34px; height: 34px; border-radius: 50%; border: 2px solid #D4B991; top: -5px; left: -5px; opacity: 0; pointer-events: none; transition: transform 0.22s, opacity 0.22s;"></div>
    `;
    cursor.style.position = "fixed";
    cursor.style.zIndex = "9999999";
    cursor.style.pointerEvents = "none";
    cursor.style.transform = "translate(0, 0)";
    cursor.style.top = "0px";
    cursor.style.left = "0px";
    document.body.appendChild(cursor);

    window.__moveDemoCursor = (x, y) => {
      cursor.style.left = `${x}px`;
      cursor.style.top = `${y}px`;
    };

    window.__clickDemoCursor = () => {
      const ring = document.getElementById("demo-cursor-click");
      if (ring) {
        ring.style.transform = "scale(1.5)";
        ring.style.opacity = "1";
        setTimeout(() => {
          ring.style.transform = "scale(0.8)";
          ring.style.opacity = "0";
        }, 220);
      }
    };
  });
}

async function moveCursor(page, targetX, targetY) {
  await page.evaluate((x, y) => {
    if (window.__moveDemoCursor) window.__moveDemoCursor(x, y);
  }, targetX, targetY);
  await page.mouse.move(targetX, targetY, { steps: 8 });
  await sleep(100);
}

async function clickAt(page, targetX, targetY) {
  await moveCursor(page, targetX, targetY);
  await page.evaluate(() => {
    if (window.__clickDemoCursor) window.__clickDemoCursor();
  });
  await page.mouse.click(targetX, targetY);
  await sleep(250);
}

(async () => {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  console.log("Launching Chrome for 1080p Hackathon Demo Walkthrough...");
  const browser = await puppeteer.launch({
    executablePath: "/usr/bin/google-chrome",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--hide-scrollbars",
      "--window-size=1920,1080"
    ],
    headless: "new"
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
  await page.goto("http://127.0.0.1:5173", { waitUntil: "networkidle0" });
  await sleep(800);
  await injectCursor(page);

  // =========================================================================
  // SCENE 1: Introduction (Homepage Overview)
  // =========================================================================
  console.log("--- Capturing Scene 1: Homepage & Editorial Hero ---");
  await moveCursor(page, 960, 360);
  await page.screenshot({ path: path.join(OUTPUT_DIR, "s1_01_home_hero.png") });

  await moveCursor(page, 720, 480);
  await page.screenshot({ path: path.join(OUTPUT_DIR, "s1_02_home_cards.png") });

  // Scroll down to trending
  await page.evaluate(() => window.scrollBy({ top: 380, behavior: "instant" }));
  await sleep(400);
  await moveCursor(page, 960, 520);
  await page.screenshot({ path: path.join(OUTPUT_DIR, "s1_03_home_trending.png") });

  // Scroll back up and hover on "Discover Your Skin & Hair" CTA
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await sleep(400);

  const ctaBox = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll("button"));
    const b = btns.find(x => x.innerText.includes("Discover Your Skin & Hair"));
    if (!b) return null;
    const r = b.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  });

  if (ctaBox) {
    await moveCursor(page, ctaBox.x, ctaBox.y);
    await page.screenshot({ path: path.join(OUTPUT_DIR, "s1_04_home_cta_hover.png") });
    await clickAt(page, ctaBox.x, ctaBox.y);
  } else {
    // Fallback click on nav button
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll("nav button"));
      const b = btns.find(x => x.innerText.includes("My Skin & Hair"));
      if (b) b.click();
    });
  }

  await sleep(1000);
  await injectCursor(page);

  // =========================================================================
  // SCENE 2: Photo Upload and YouCam Integration
  // =========================================================================
  console.log("--- Capturing Scene 2: Upload and YouCam Integration ---");
  // Click "New Analysis" button to open capture dropzone
  const newScanBox = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll("button"));
    const b = btns.find(x => x.innerText.includes("New Analysis"));
    if (!b) return null;
    const r = b.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  });

  if (newScanBox) {
    await clickAt(page, newScanBox.x, newScanBox.y);
    await sleep(600);
    await injectCursor(page);
  }

  // 1. Capture dropzone interface
  await moveCursor(page, 960, 430);
  await page.screenshot({ path: path.join(OUTPUT_DIR, "s2_01_upload_dropzone.png") });

  // 2. Hover on sample portrait button (demonstrating portrait selection)
  const p1Box = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll("button"));
    const b = btns.find(x => x.innerText.includes("Portrait 1"));
    if (!b) return null;
    const r = b.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  });

  if (p1Box) {
    await moveCursor(page, p1Box.x, p1Box.y);
    await page.screenshot({ path: path.join(OUTPUT_DIR, "s2_02_sample_portrait_hover.png") });
    await clickAt(page, p1Box.x, p1Box.y);
  }

  // 3. Capturing real-time YouCam analyzing spinner and stages
  console.log("Capturing analysis processing stages...");
  await sleep(400);
  await page.screenshot({ path: path.join(OUTPUT_DIR, "s2_03_analyzing_stage1.png") });
  await sleep(700);
  await page.screenshot({ path: path.join(OUTPUT_DIR, "s2_04_analyzing_stage2.png") });
  await sleep(700);
  await page.screenshot({ path: path.join(OUTPUT_DIR, "s2_05_analyzing_stage3.png") });
  await sleep(700);
  await page.screenshot({ path: path.join(OUTPUT_DIR, "s2_06_analyzing_stage4.png") });

  // Wait for analysis to complete and results to render
  await sleep(1500);
  await injectCursor(page);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await sleep(500);

  // =========================================================================
  // SCENE 3: Analysis Results
  // =========================================================================
  console.log("--- Capturing Scene 3: Analysis Results & Biometrics ---");
  // 1. Biometric Overview Cards
  await moveCursor(page, 960, 360);
  await page.screenshot({ path: path.join(OUTPUT_DIR, "s3_01_biometric_overview.png") });

  // 2. Scroll to Diagnostic Portrait
  await page.evaluate(() => window.scrollBy({ top: 320, behavior: "instant" }));
  await sleep(400);
  await moveCursor(page, 620, 520);
  await page.screenshot({ path: path.join(OUTPUT_DIR, "s3_02_diagnostic_portrait_pore.png") });

  // 3. Click on "Surface Smoothness" tag to demonstrate interactive optical layers
  const smoothnessBox = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll("button"));
    const b = btns.find(x => x.innerText.includes("Surface Smoothness"));
    if (!b) return null;
    const r = b.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  });

  if (smoothnessBox) {
    await clickAt(page, smoothnessBox.x, smoothnessBox.y);
    await sleep(400);
    await page.screenshot({ path: path.join(OUTPUT_DIR, "s3_03_diagnostic_portrait_smoothness.png") });
  }

  // 4. Scroll to Consumer Care Guidance
  await page.evaluate(() => window.scrollBy({ top: 400, behavior: "instant" }));
  await sleep(400);
  await moveCursor(page, 960, 480);
  await page.screenshot({ path: path.join(OUTPUT_DIR, "s3_04_consumer_guidance.png") });

  // =========================================================================
  // SCENE 4: Product Discovery
  // =========================================================================
  console.log("--- Capturing Scene 4: Product Discovery ---");
  // Scroll up to Targeted Recommendations on the results screen
  await page.evaluate(() => window.scrollTo({ top: 360, behavior: "instant" }));
  await sleep(400);
  await moveCursor(page, 1340, 480);
  await page.screenshot({ path: path.join(OUTPUT_DIR, "s4_01_targeted_recommendations.png") });

  // Hover over the cleanser formulation rationale
  await moveCursor(page, 1340, 530);
  await page.screenshot({ path: path.join(OUTPUT_DIR, "s4_02_cleanser_rationale.png") });

  // Navigate to Discover & Shop (Marketplace)
  const shopBox = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll("nav button"));
    const b = btns.find(x => x.innerText.includes("Discover & Shop"));
    if (!b) return null;
    const r = b.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  });

  if (shopBox) {
    await clickAt(page, shopBox.x, shopBox.y);
    await sleep(1000);
    await injectCursor(page);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await sleep(400);

    // Marketplace Catalogue overview
    await moveCursor(page, 960, 420);
    await page.screenshot({ path: path.join(OUTPUT_DIR, "s4_03_marketplace_catalogue.png") });

    // Click on Cleansers filter
    const cleanserFilterBox = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll("button"));
      const b = btns.find(x => x.innerText.includes("Cleansers") || x.innerText.includes("Gentle Cleanser"));
      if (!b) return null;
      const r = b.getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    });

    if (cleanserFilterBox) {
      await clickAt(page, cleanserFilterBox.x, cleanserFilterBox.y);
      await sleep(500);
      await page.screenshot({ path: path.join(OUTPUT_DIR, "s4_04_marketplace_filtered.png") });
    }
  }

  // =========================================================================
  // SCENE 5: ROUTINE CURATOR (HERO SECTION)
  // =========================================================================
  console.log("--- Capturing Scene 5: Routine Curator Hero Section ---");
  // Navigate to My Routine
  const routineBox = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll("nav button"));
    const b = btns.find(x => x.innerText.includes("My Routine"));
    if (!b) return null;
    const r = b.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  });

  if (routineBox) {
    await clickAt(page, routineBox.x, routineBox.y);
    await sleep(1000);
    await injectCursor(page);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await sleep(400);

    // 1. Routine Overview: Budget status ₹898, Formula Harmony badge
    await moveCursor(page, 960, 310);
    await page.screenshot({ path: path.join(OUTPUT_DIR, "s5_01_routine_overview.png") });

    // 2. Step Sequence
    await moveCursor(page, 960, 560);
    await page.screenshot({ path: path.join(OUTPUT_DIR, "s5_02_step_sequence.png") });

    // 3. Click "Replace" on Step 1
    const replaceBox = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll("button"));
      const b = btns.find(x => x.innerText.includes("Replace"));
      if (!b) return null;
      const r = b.getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    });

    if (replaceBox) {
      await clickAt(page, replaceBox.x, replaceBox.y);
      await sleep(800);
      await injectCursor(page);

      // 4. Compatibility Alternatives Modal
      await moveCursor(page, 960, 480);
      await page.screenshot({ path: path.join(OUTPUT_DIR, "s5_03_compatibility_modal.png") });

      // 5. Hover on The Derma Co alternative
      const selectBox = await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll("button"));
        const b = btns.find(x => x.innerText.includes("Select Formula"));
        if (!b) return null;
        const r = b.getBoundingClientRect();
        return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
      });

      if (selectBox) {
        await moveCursor(page, selectBox.x, selectBox.y);
        await page.screenshot({ path: path.join(OUTPUT_DIR, "s5_04_modal_select_hover.png") });
        await clickAt(page, selectBox.x, selectBox.y);
        await sleep(800);
        await injectCursor(page);

        // 6. Modal closed, total recalculated to ₹948
        await moveCursor(page, 960, 310);
        await page.screenshot({ path: path.join(OUTPUT_DIR, "s5_05_recalculated_budget_948.png") });
      }

      // 7. Hover on Formula Harmony badge
      await moveCursor(page, 1340, 260);
      await page.screenshot({ path: path.join(OUTPUT_DIR, "s5_06_formula_harmony_detail.png") });
    }
  }

  // =========================================================================
  // SCENE 6: My Lists
  // =========================================================================
  console.log("--- Capturing Scene 6: Save Routine & My Lists ---");
  // Click "Save Routine"
  const saveBox = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll("button"));
    const b = btns.find(x => x.innerText.includes("Save Routine"));
    if (!b) return null;
    const r = b.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  });

  if (saveBox) {
    await clickAt(page, saveBox.x, saveBox.y);
    await sleep(250);
    await page.screenshot({ path: path.join(OUTPUT_DIR, "s6_01_save_routine_toast.png") });
    await sleep(800);
  }

  // Navigate to My Lists
  const listsBox = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll("nav button"));
    const b = btns.find(x => x.innerText.includes("My Lists"));
    if (!b) return null;
    const r = b.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  });

  if (listsBox) {
    await clickAt(page, listsBox.x, listsBox.y);
    await sleep(1000);
    await injectCursor(page);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await sleep(400);

    // My Lists Overview
    await moveCursor(page, 960, 380);
    await page.screenshot({ path: path.join(OUTPUT_DIR, "s6_02_my_lists_overview.png") });

    // Hover on saved product / saved regimen item
    await moveCursor(page, 960, 540);
    await page.screenshot({ path: path.join(OUTPUT_DIR, "s6_03_my_lists_saved_items.png") });
  }

  console.log("All demo screens captured successfully!");
  await browser.close();
})();
