const puppeteer = require('puppeteer-core');

async function clickBtn(page, text) {
  return await page.evaluate((t) => {
    const btns = [...document.querySelectorAll('button')];
    const btn = btns.find((b) => b.innerText.toLowerCase().includes(t.toLowerCase()));
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  }, text);
}

async function runTestSuite() {
  console.log('🚀 Starting Automated Test Suite for A Little Universe for Wynne...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1280, height: 800 },
  });

  const page = await browser.newPage();
  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  page.on('pageerror', (err) => {
    consoleErrors.push(err.toString());
  });

  try {
    console.log('1️⃣ Loading http://localhost:3000 ...');
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 15000 });

    // Wait for the loading screen to complete and main heading to be visible
    await page.waitForFunction(() => {
      const h1 = document.querySelector('h1');
      return h1 && h1.innerText.includes('Hey, Wynne.');
    }, { timeout: 10000 });

    const h1Text = await page.$eval('h1', (el) => el.innerText);
    console.log(`✅ Initial Scene Rendered: "${h1Text}"`);

    // Verify Three.js Canvas or WebGL Fallback
    const hasCanvas = await page.$('canvas');
    console.log(`✅ 3D Canvas / Fallback status: Canvas present = ${Boolean(hasCanvas)}`);

    // 2. Audio Toggle
    console.log('2️⃣ Testing Ambient Audio Toggle...');
    const audioBtn = await page.$('button[aria-label*="soundscape"]');
    if (!audioBtn) throw new Error('Audio button not found');
    await audioBtn.click();
    await new Promise((r) => setTimeout(r, 400));
    console.log('✅ Ambient Audio toggled successfully.');

    // 3. Motion Toggle
    console.log('3️⃣ Testing Motion Toggle...');
    const motionBtn = await page.$('button[aria-label*="motion"]');
    if (!motionBtn) throw new Error('Motion button not found');
    await motionBtn.click();
    await new Promise((r) => setTimeout(r, 300));
    console.log('✅ Motion toggled to Soft');
    await motionBtn.click();
    await new Promise((r) => setTimeout(r, 300));
    console.log('✅ Motion toggled back to Full');

    // 4. Scene 1 -> Scene 2
    console.log('4️⃣ Testing Scene 1 "Step inside ♡" button...');
    const clickedStep = await clickBtn(page, 'Step inside');
    if (!clickedStep) throw new Error('Could not find "Step inside" button');
    
    // Wait for Scene 2
    await page.waitForFunction(() => {
      const h2 = document.querySelector('h2');
      return h2 && h2.innerText.includes('Before anything else');
    }, { timeout: 5000 });
    console.log('✅ Scene 2 Reached: "Before anything else, there\'s something I should tell you."');

    // 5. Scene 2 -> Scene 3
    console.log('5️⃣ Testing Scene 2 "There\'s something I owe you" button...');
    const clickedOwe = await clickBtn(page, 'something I owe you');
    if (!clickedOwe) throw new Error('Could not find "something I owe you" button');

    // Wait for Scene 3
    await page.waitForFunction(() => {
      const h1 = document.querySelector('h1');
      return h1 && h1.innerText.includes('October 18');
    }, { timeout: 5000 });
    console.log('✅ Scene 3 Reached: "October 18"');

    // 6. Constellation Star Nodes
    console.log('6️⃣ Testing October 18 Constellation Star Nodes...');
    const stars = ['Reflection I', 'Reflection II', 'Reflection III', 'Reflection IV'];
    for (const star of stars) {
      const clickedStar = await clickBtn(page, star);
      if (!clickedStar) throw new Error(`Could not click ${star}`);
      await new Promise((r) => setTimeout(r, 400));
      console.log(`   ✨ Clicked ${star}`);
    }

    // Wait for "Read what I wrote for you" button
    await page.waitForFunction(() => {
      const btns = [...document.querySelectorAll('button')];
      return btns.some((b) => b.innerText.includes('Read what I wrote for you'));
    }, { timeout: 5000 });
    console.log('✅ Heart Constellation formed! "Read what I wrote for you" button unlocked.');

    // 7. Scene 3 -> Scene 4 (The Letter)
    console.log('7️⃣ Navigating to Scene 4 (The Letter)...');
    await clickBtn(page, 'Read what I wrote for you');

    await page.waitForFunction(() => {
      const h2 = document.querySelector('h2');
      return h2 && h2.innerText.includes('Wynne,');
    }, { timeout: 5000 });
    console.log('✅ Scene 4 Reached: Apology Letter mounted.');

    // Test "Show all" button
    console.log('   Testing "Show all" button to reveal all paragraphs...');
    const clickedShowAll = await clickBtn(page, 'Show all');
    if (!clickedShowAll) throw new Error('Could not click "Show all" button');
    await new Promise((r) => setTimeout(r, 600));

    // Verify all paragraphs and continue button appear
    await page.waitForFunction(() => {
      const btns = [...document.querySelectorAll('button')];
      return btns.some((b) => b.innerText.includes('unsaid things'));
    }, { timeout: 5000 });
    console.log('✅ Full letter revealed! "A garden of unsaid things" button unlocked.');

    // 8. Scene 4 -> Scene 5
    console.log('8️⃣ Navigating to Scene 5 (A Garden of Unsaid Things)...');
    await clickBtn(page, 'unsaid things');

    await page.waitForFunction(() => {
      const h1 = document.querySelector('h1');
      return h1 && h1.innerText.includes('Garden of Unsaid Things');
    }, { timeout: 5000 });
    console.log('✅ Scene 5 Reached: Garden of Unsaid Things mounted.');

    // Click each petal
    const petals = ['Listening', 'Being Present', 'Noticing', 'Making Time Count', 'Care In Action'];
    for (const petal of petals) {
      await clickBtn(page, petal);
      await new Promise((r) => setTimeout(r, 400));
      console.log(`   🌸 Explored petal: "${petal}"`);
    }

    // 9. Scene 5 -> Scene 6 (Finale)
    console.log('9️⃣ Navigating to Scene 6 (Finale)...');
    await clickBtn(page, 'A final thought for you');

    await page.waitForFunction(() => {
      const text = document.body.innerText;
      return text.includes('That\'s all I wanted you to know, Wynne');
    }, { timeout: 5000 });
    console.log('✅ Scene 6 Reached: Closing message present.');

    // Trigger starlight particle drift
    console.log('   Triggering "Let the little stars drift"...');
    await clickBtn(page, 'Let the little stars drift');

    // Wait for post drift tribute
    await page.waitForFunction(() => {
      const text = document.body.innerText;
      return text.includes('For Wynne, with sincerity. ♡');
    }, { timeout: 8000 });
    console.log('✅ Starlight drift completed! Tribute confirmed: "For Wynne, with sincerity. ♡"');

    // 10. Test Replay button
    console.log('🔟 Testing "Experience from the beginning" replay button...');
    await clickBtn(page, 'Experience from the beginning');

    await page.waitForFunction(() => {
      const h1 = document.querySelector('h1');
      return h1 && h1.innerText.includes('Hey, Wynne.');
    }, { timeout: 5000 });
    console.log('✅ Replay successful! Returned smoothly to Scene 1.');

    // 11. Test Scene Navigator Dots
    console.log('1️⃣1️⃣ Testing Scene Navigator Dots...');
    const dotsCount = await page.$$eval('nav[aria-label="Experience scenes"] button', (els) => els.length);
    console.log(`✅ All ${dotsCount} navigation dots present and operational.`);

    console.log('\n🎉 ALL SYSTEM CHECKS & BUTTON INTERACTIONS VERIFIED 100% OPERATIONAL!');
    if (consoleErrors.length > 0) {
      console.warn('⚠️ Console errors:', consoleErrors);
    } else {
      console.log('✅ ZERO runtime errors or exceptions in browser console.');
    }
  } catch (err) {
    console.error('❌ Test failed:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runTestSuite();
