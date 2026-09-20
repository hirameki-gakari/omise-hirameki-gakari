/**
 * ブラウザでの確認: 「別のお店をひらめく」の操作(390px幅・PC・動きを減らす設定)と、既存機能の退行確認。
 * 実行方法(リポジトリの直下で):
 *   npm install --no-save puppeteer-core          # 初回のみ。Google Chrome が必要(別の場所なら CHROME_PATH を指定)
 *   python3 -m http.server 8765 --bind 127.0.0.1 & # 検証用サーバー(終わったら停止)
 *   node tests/e2e/reroll-ux.cjs
 * 通信は 127.0.0.1 とフォントのみ許可(Googleアナリティクスなど外部への送信は遮断)。実店舗への電話・予約は行わない。
 */
const os = require("os");
const OUT_DIR = process.env.E2E_OUT || os.tmpdir();   // スクリーンショットの保存先
const puppeteer = require("puppeteer-core");
const CHROME = process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const URL = "http://127.0.0.1:8765/index.html";
const OUT = OUT_DIR;
const sleep = ms => new Promise(r => setTimeout(r, ms));
let pass = 0, fail = 0;
const ok = (c, m) => { if(c){ pass++; console.log("  OK  " + m); } else { fail++; console.log("  NG  " + m); } };

async function open(browser, opts){
  const page = await browser.newPage();
  const errors = [], bad = [];
  page.on("pageerror", e => errors.push("pageerror: " + e.message));
  page.on("console", m => { if(m.type() === "error" && !/Failed to load resource/.test(m.text())) errors.push("console: " + m.text()); });
  page.on("response", r => { if(r.url().startsWith("http://127.0.0.1") && r.status() >= 400 && !/favicon\.ico/.test(r.url())) bad.push(r.status() + " " + r.url()); });
  await page.setRequestInterception(true);
  page.on("request", req => { const u = req.url(); (u.startsWith("http://127.0.0.1") || u.startsWith("data:") || /fonts\.(googleapis|gstatic)\.com/.test(u)) ? req.continue() : req.abort(); });
  await page.evaluateOnNewDocument(() => { window.dataLayer = []; });
  if(opts.mobile) await page.setViewport({width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true});
  else await page.setViewport({width: 1280, height: 900});
  await page.emulateMediaFeatures([{name: "prefers-reduced-motion", value: opts.reduce ? "reduce" : "no-preference"}]);
  await page.goto(URL, {waitUntil: "load"});
  await sleep(500);
  return {page, errors, bad};
}
const events = page => page.evaluate(() => Array.from(window.dataLayer).map(a => Array.from(a)).filter(a => a[0] === "event").map(a => a[1]));
async function startResult(page, companionIdx = 0, moodIdx = 0){
  await page.evaluate((c, m) => {
    document.querySelectorAll("#companion-chips .chip")[c].click();
    document.querySelectorAll("#mood-chips .chip")[m].click();
    document.getElementById("btn-hirameki").click();
  }, companionIdx, moodIdx);
  await page.waitForFunction(() => !document.getElementById("screen-result").hidden && document.getElementById("r-name").textContent);
  await sleep(700);
}
const snap = page => page.evaluate(() => {
  const q = s => document.querySelector(s), rect = el => { const r = el.getBoundingClientRect(); return {top: Math.round(r.top), bottom: Math.round(r.bottom), left: Math.round(r.left), right: Math.round(r.right)}; };
  const card = q(".result-card"), plate = q("#r-plate"), photo = q("#r-photo");
  const vis = photo && !photo.hidden ? photo : plate;
  const mascot = q("#r-mascot");
  return {
    name: q("#r-name").textContent, copy: q("#r-copy").textContent, btn: q("#r-reroll .rl").textContent, disabled: q("#r-reroll").disabled,
    thinking: card.classList.contains("is-thinking"), mascotSrc: mascot.getAttribute("src"), mascotOk: mascot.complete && mascot.naturalWidth > 0,
    scrollY: Math.round(window.scrollY), vh: window.innerHeight, docW: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth,
    card: rect(card), visual: rect(vis), nameR: rect(q("#r-name")), copyR: rect(q(".r-copy-row")), btnR: rect(q("#r-reroll")),
    nameHit: (() => { const n = q("#r-name"), r = n.getBoundingClientRect(); const el = document.elementFromPoint(r.left + 8, r.top + r.height / 2); return !!el && (el === n || n.contains(el)); })()
  };
});
const scrollToBtn = async page => { await page.evaluate(() => document.getElementById("r-reroll").scrollIntoView({block: "center"})); await sleep(400); };

(async () => {
  const browser = await puppeteer.launch({executablePath: CHROME, headless: "new", args: ["--no-sandbox"]});

  console.log("\n■ スマホ幅(390px・タッチ)");
  {
    const {page, errors, bad} = await open(browser, {mobile: true});
    await startResult(page);
    const first = await snap(page);
    console.log("  最初の提案:", first.name, "|", first.copy);
    ok(first.mascotOk && first.mascotSrc.includes("reveal"), "ひらりの画像が表示されている(最初の提案)");
    ok(first.docW === first.cw, "横にはみ出していない(最初の提案)");

    // 1〜7: 押す→切り替わる→セリフ→自動スクロール→店名表示
    await scrollToBtn(page);
    const before = await snap(page);
    console.log("  押す前: scrollY=" + before.scrollY + " / カード上端=" + before.card.top + "px(画面外) / ボタン位置=" + before.btnR.top + "px");
    ok(before.card.top < 0, "押す前は、店舗カードが画面の上に外れている(=ユーザーは下部にいる)");
    await page.tap("#r-reroll");
    await sleep(60);
    const mid = await snap(page);
    ok(mid.disabled && mid.btn === "ひらり、考え中…" && mid.thinking, "押した直後: ボタンが「ひらり、考え中…」になり無効化、カードが薄くなる");
    ok(mid.copy === "ひらり、考え中…" && mid.mascotSrc.includes("thinking"), "押した直後: ひらりが考え中のポーズ・セリフになる");
    // スクロールの推移(なめらかか)
    const ys = [mid.scrollY];
    for(let i = 0; i < 24; i++){ await sleep(40); ys.push(await page.evaluate(() => Math.round(window.scrollY))); }
    const distinct = new Set(ys).size;
    const monotonic = ys.every((y, i) => i === 0 || y <= ys[i - 1]);
    console.log("  スクロール推移(px):", ys.filter((_, i) => i % 3 === 0).join(" → "));
    ok(distinct >= 4 && monotonic, "スクロールはジャンプせず、なめらかに上へ動く(途中経過 " + distinct + " 段階)");
    await sleep(600);
    const after = await snap(page);
    console.log("  押した後: ", after.name, "|", after.copy, "| カード上端=" + after.card.top + "px");
    ok(after.name !== before.name, "本当に別の店に切り替わった(" + before.name + " → " + after.name + ")");
    ok(after.copy !== before.copy && !/考え中/.test(after.copy), "ひらりのセリフが変わった(「" + before.copy + "」→「" + after.copy + "」)");
    ok(after.card.top >= 0 && after.card.top <= 40, "カードが画面上部に来ている(上端 " + after.card.top + "px)");
    ok(after.visual.top >= 0 && after.visual.bottom <= after.vh, "店舗の写真(プレート)が画面内に収まっている");
    ok(after.nameR.top >= 0 && after.nameR.bottom <= after.vh && after.nameHit, "店舗名が画面内で、何にも隠れていない");
    ok(after.copyR.top >= 0 && after.copyR.bottom <= after.vh, "ひらりのひとことが画面内に収まっている");
    ok(after.mascotOk && after.mascotSrc.includes("reveal"), "ひらりの画像が表示されている(切り替え後)");
    ok(!after.thinking && !after.disabled && after.btn === "別のお店をひらめく", "ボタンと見た目が元に戻っている");
    ok(after.docW === after.cw, "横にはみ出していない(切り替え後)");
    await page.screenshot({path: OUT + "/mobile-after-reroll.png"});
    await page.evaluate(() => window.scrollTo(0, 0)); await sleep(300);

    // 8: 連続で押す
    console.log("\n  --- 連続して押す(6回) ---");
    let prev = after, allOk = true; const names = [after.name], copies = [after.copy];
    for(let i = 0; i < 6; i++){
      await scrollToBtn(page);
      await page.tap("#r-reroll");
      await sleep(1100);
      const s = await snap(page);
      const good = s.name !== prev.name && s.copy !== prev.copy && !/考え中/.test(s.copy) && s.nameR.top >= 0 && s.nameR.bottom <= s.vh && !s.disabled && s.mascotOk;
      if(!good){ allOk = false; console.log("    #" + (i + 1), "NG", JSON.stringify({n: s.name, c: s.copy, y: s.nameR})); }
      names.push(s.name); copies.push(s.copy); prev = s;
    }
    console.log("  店:", names.join(" / ")); console.log("  セリフ:", copies.join(" | "));
    ok(allOk, "6回連続で、毎回 別の店・別のセリフ・店名が画面内に表示された");

    // 9: 連打(考え中に何度もタップ)
    console.log("\n  --- 連打 ---");
    await scrollToBtn(page);
    const evBefore = (await events(page)).filter(e => e === "reroll").length;
    await page.evaluate(() => {
      window.__renders = 0;
      new MutationObserver(() => window.__renders++).observe(document.getElementById("r-name"), {childList: true, characterData: true, subtree: true});
      const b = document.getElementById("r-reroll");
      for(let i = 0; i < 8; i++) b.click();      // 同じフレームで8連打
    });
    await sleep(90);
    for(let i = 0; i < 5; i++){ await page.evaluate(() => document.getElementById("r-reroll").click()); await sleep(30); } // 考え中にさらに連打
    await sleep(1200);
    const evAfter = (await events(page)).filter(e => e === "reroll").length;
    const renders = await page.evaluate(() => window.__renders);
    console.log("  reroll計測: +" + (evAfter - evBefore) + " 回 / 店名の書き換え: " + renders + " 回");
    ok(evAfter - evBefore === 1, "13回連打しても、切り替えは1回だけ(二重処理なし)");
    ok(renders === 1, "店名の書き換えも1回だけ");
    const s2 = await snap(page); ok(!s2.disabled && !s2.thinking && s2.btn === "別のお店をひらめく", "連打のあと、ボタンが正常な状態に戻る");

    // 考え中に「はじめから選び直す」
    console.log("\n  --- 切り替え中に「はじめから選び直す」 ---");
    await page.evaluate(() => { document.getElementById("r-reroll").click(); setTimeout(() => document.getElementById("r-restart").click(), 50); });
    await sleep(700);
    const restartState = await page.evaluate(() => ({sel: !document.getElementById("screen-select").hidden, res: document.getElementById("screen-result").hidden, btn: document.querySelector("#r-reroll .rl").textContent, dis: document.getElementById("r-reroll").disabled}));
    ok(restartState.sel && restartState.res && !restartState.dis && restartState.btn === "別のお店をひらめく", "選び直しへ戻っても、画面・ボタンが壊れない");
    await startResult(page, 1, 2);
    await scrollToBtn(page); await page.tap("#r-reroll"); await sleep(1100);
    const s3 = await snap(page);
    ok(s3.nameR.top >= 0 && s3.mascotOk && !s3.disabled, "選び直したあとも、再提案が正常に動く");

    // 10: 既存機能のデグレなし
    console.log("\n  --- 既存機能 ---");
    const reg = await page.evaluate(() => ({
      triad: document.querySelectorAll("#triad-cards .triad-card").length, nearby: document.querySelectorAll("#nearby-list .nearby-card").length,
      go: document.getElementById("r-go").href, tel: document.getElementById("r-tel").hidden ? null : document.getElementById("r-tel").textContent, map: document.getElementById("r-map").href,
      meta: document.querySelectorAll("#r-meta span").length, reasons: document.querySelectorAll("#r-reasons li").length, footer: !!document.querySelector('a[href="privacy.html"]'),
      intro: !!document.querySelector(".mascot-intro")
    }));
    console.log("  ", JSON.stringify(reg));
    ok(reg.triad >= 1 && reg.nearby >= 1 && reg.reasons >= 1 && reg.meta >= 3 && /^https?:/.test(reg.go) && /google\.com\/maps/.test(reg.map), "穴場・冒険カード、近くの店、理由、メタ情報、行き先、地図リンクが表示される");
    ok(reg.footer, "フッターのプライバシーポリシーへのリンクが残っている");
    const evs = await events(page);
    ok(evs.includes("hirameki_start") && evs.includes("reroll"), "計測イベント(hirameki_start / reroll)が送られている");
    ok(errors.length === 0, "JavaScriptエラーなし" + (errors.length ? " → " + errors.join(" / ") : ""));
    ok(bad.length === 0, "ローカルファイルの読み込み失敗(404等)なし" + (bad.length ? " → " + bad.join(" / ") : ""));
    await page.close();
  }

  console.log("\n■ ページ先頭でカードが見えている状態(スマホ):余計なスクロールをしない");
  {
    const {page, errors} = await open(browser, {mobile: true});
    await startResult(page);
    await page.evaluate(() => window.scrollTo(0, 0)); await sleep(300);
    const b = await snap(page);
    await page.evaluate(() => document.getElementById("r-reroll").click()); await sleep(1000);
    const a = await snap(page);
    console.log("  scrollY " + b.scrollY + " → " + a.scrollY + " / カード上端 " + b.card.top + " → " + a.card.top);
    ok(b.scrollY === a.scrollY, "店名・ひとことがすでに画面内なら、スクロールを動かさない");
    ok(a.name !== b.name && errors.length === 0, "店は切り替わり、エラーもない");
    await page.close();
  }

  console.log("\n■ PC幅(1280px)");
  {
    const {page, errors} = await open(browser, {mobile: false});
    await startResult(page);
    const b = await snap(page);
    ok(b.docW === b.cw, "横にはみ出していない");
    await page.screenshot({path: OUT + "/pc-before.png"});
    await page.evaluate(() => document.getElementById("r-reroll").scrollIntoView({block: "center"})); await sleep(400);
    const b2 = await snap(page);
    await page.click("#r-reroll"); await sleep(1300);
    const a = await snap(page);
    console.log("  PC: 押す前 scrollY=" + b2.scrollY + " カード上端=" + b2.card.top + " → 押した後 scrollY=" + a.scrollY + " カード上端=" + a.card.top);
    ok(a.name !== b.name && a.copy !== b.copy && !/考え中/.test(a.copy), "PCでも別の店・別のセリフに切り替わる");
    ok(a.nameR.top >= 0 && a.nameR.bottom <= a.vh && a.nameHit, "PCでも店名が画面内に見えている");
    ok(a.docW === a.cw && a.mascotOk, "レイアウト崩れなし・ひらりの画像あり");
    await page.screenshot({path: OUT + "/pc-after.png"});
    ok(errors.length === 0, "JavaScriptエラーなし");
    await page.close();
  }

  console.log("\n■ 動きを減らす設定(prefers-reduced-motion)");
  {
    const {page, errors} = await open(browser, {mobile: true, reduce: true});
    await startResult(page); await scrollToBtn(page);
    const b = await snap(page);
    await page.evaluate(() => document.getElementById("r-reroll").click());
    await sleep(500);
    const a = await snap(page);
    ok(a.name !== b.name && a.card.top >= 0 && a.card.top <= 40, "動きを減らす設定でも、切り替わってカード位置へ移動する(アニメーションなしで)");
    ok(errors.length === 0, "JavaScriptエラーなし");
    await page.close();
  }

  await browser.close();
  console.log("\n結果: OK " + pass + " / NG " + fail);
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
