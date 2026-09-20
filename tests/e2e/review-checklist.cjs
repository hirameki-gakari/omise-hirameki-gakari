/**
 * ブラウザでの確認(レビュー項目): 390x844 / 320x568 / PC の画面で、5つの条件パターン・条件の変更と選び直し・
 * 「別のお店をひらめく」の連続操作・ダブルタップ・候補不足と0件の説明・営業時間不明の表示・
 * データ読み込み失敗の説明と再読み込み、を確認する。
 * 実行方法(リポジトリの直下で):
 *   npm install --no-save puppeteer-core          # 初回のみ。Google Chrome が必要(別の場所なら CHROME_PATH を指定)
 *   python3 -m http.server 8765 --bind 127.0.0.1 & # 検証用サーバー(終わったら停止)
 *   node tests/e2e/review-checklist.cjs
 * 通信は 127.0.0.1 とフォントのみ許可(外部への送信は遮断)。実店舗への電話・予約は行わない。
 */
const os = require("os");
const OUT_DIR = process.env.E2E_OUT || os.tmpdir();   // スクリーンショットの保存先
// 依頼された検証項目を実ブラウザで確認する(390x844 / 320x568 / PC)
const puppeteer = require("puppeteer-core");
const CHROME = process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PAGE_URL = "http://127.0.0.1:8765/index.html";
const sleep = ms => new Promise(r => setTimeout(r, ms));
let pass = 0, fail = 0;
const ok = (c, m) => { if(c){ pass++; console.log("  OK  " + m); } else { fail++; console.log("  NG  " + m); } };

async function open(browser, vp, opts = {}){
  const page = await browser.newPage();
  const errors = [], reqs = [];
  page.on("pageerror", e => errors.push("pageerror: " + e.message));
  page.on("console", m => { if(m.type() === "error" && !/Failed to load resource|net::ERR/.test(m.text())) errors.push("console: " + m.text()); });
  await page.emulateMediaFeatures([{name: "prefers-reduced-motion", value: "no-preference"}]);
  await page.evaluateOnNewDocument(() => { window.dataLayer = []; });
  await page.setViewport(vp);
  await page.setRequestInterception(true);
  page.on("request", req => {
    const u = req.url(); reqs.push(u);
    if(opts.block && opts.block.some(b => u.includes(b))) return req.abort();
    (u.startsWith("http://127.0.0.1") || u.startsWith("data:") || /fonts\.(googleapis|gstatic)\.com/.test(u)) ? req.continue() : req.abort();
  });
  await page.goto(PAGE_URL, {waitUntil: "load"});
  await page.evaluate(() => document.fonts.ready); await sleep(500);
  return {page, errors, reqs};
}
const pick = (page, cLabel, mLabel) => page.evaluate((c, m) => {
  [...document.querySelectorAll("#companion-chips .chip")].find(b => b.textContent.trim().startsWith(c)).click();
  [...document.querySelectorAll("#mood-chips .chip")].find(b => b.textContent.trim() === m).click();
}, cLabel, mLabel);
const go = async page => { await page.evaluate(() => document.getElementById("btn-hirameki").click()); await sleep(900); };
const state = page => page.evaluate(() => {
  const q = s => document.querySelector(s), rc = el => { const r = el.getBoundingClientRect(); return {top: Math.round(r.top), bottom: Math.round(r.bottom)}; };
  const card = q(".result-card");
  return {
    name: q("#r-name").textContent, copy: q("#r-copy").textContent, cond: q("#cond-text").textContent,
    chips: [...document.querySelectorAll("#r-meta span")].map(s => s.textContent), head: q("#r-reasons-head").textContent,
    reasons: [...document.querySelectorAll("#r-reasons li")].map(l => l.textContent), go: q("#r-go-label").textContent, goHref: q("#r-go").href,
    map: q("#r-map").hidden ? null : q("#r-map").href, mapText: q("#r-map").textContent, tel: q("#r-tel").hidden ? null : q("#r-tel").textContent,
    notice: q("#result-notice").hidden ? null : q("#result-notice").textContent, empty: !q("#result-empty").hidden, infonote: q("#r-infonote").hidden ? null : q("#r-infonote").textContent,
    triad: [...document.querySelectorAll("#triad-cards .triad-card")].map(a => ({name: a.querySelector(".triad-name").textContent, meta: a.querySelector(".triad-meta").textContent, link: a.querySelector(".triad-link").textContent})),
    nearby: [...document.querySelectorAll("#nearby-list .nearby-card")].map(a => ({name: a.querySelector(".nm").textContent, gn: a.querySelector(".gn").textContent, pr: a.querySelector(".pr").textContent, nl: a.querySelector(".nl").textContent})),
    more: [...document.querySelectorAll("#r-more-list dt")].map((dt, i) => dt.textContent + ":" + document.querySelectorAll("#r-more-list dd")[i].textContent), moreOpen: q("#r-more").open,
    sr: q("#sr-status").textContent, mascot: q("#r-mascot").naturalWidth > 0, vh: innerHeight, y: Math.round(scrollY), docW: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth,
    nameR: rc(q("#r-name")), cardR: rc(card), btn: q("#r-reroll").disabled, resultVisible: !q("#screen-result").hidden, selectVisible: !q("#screen-select").hidden
  };
});
const events = page => page.evaluate(() => Array.from(window.dataLayer).map(a => Array.from(a)).filter(a => a[0] === "event").map(a => a[1]));
const yen = t => { const m = t.match(/¥([\d,]+)〜([\d,]+)/); return m ? [+m[1].replace(/,/g, ""), +m[2].replace(/,/g, "")] : null; };

const PATTERNS = [
  ["ひとり", "サクッと"], ["家族", "家族みんなで"], ["夫婦", "ゆっくり話したい"], ["仕事仲間", "飲みたい"], ["友達", "コスパ重視"]
];

(async () => {
  const browser = await puppeteer.launch({executablePath: CHROME, headless: "new", args: ["--no-sandbox"]});

  for(const [vpName, vp] of [["390×844", {width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true}], ["320×568", {width: 320, height: 568, deviceScaleFactor: 2, isMobile: true, hasTouch: true}]]){
    console.log("\n■ " + vpName);
    const {page, errors} = await open(browser, vp);
    let s = await state(page);
    ok(s.docW === s.cw, "選択画面: 横はみ出しがない");
    const btnRect = await page.evaluate(() => { const r = document.getElementById("btn-hirameki").getBoundingClientRect(); return {top: r.top, bottom: r.bottom, h: r.height}; });
    ok(btnRect.bottom <= vp.height && btnRect.h >= 44, "選択画面: 提案ボタンが最初から画面内に見えている(高さ" + Math.round(btnRect.h) + "px)");
    const chipH = await page.evaluate(() => Math.min(...[...document.querySelectorAll(".chip")].map(c => c.getBoundingClientRect().height)));
    ok(chipH >= 44, "選択ボタンの高さが44px以上(最小 " + chipH.toFixed(1) + "px)");

    // 未選択・片方だけ選択では検索できない
    ok(await page.evaluate(() => document.getElementById("btn-hirameki").disabled), "未選択: 提案ボタンが無効");
    await page.evaluate(() => document.querySelectorAll("#companion-chips .chip")[0].click());
    ok(await page.evaluate(() => document.getElementById("btn-hirameki").disabled), "片方だけ選択: 提案ボタンが無効");
    await page.evaluate(() => document.getElementById("btn-hirameki").click()); await sleep(200);
    s = await state(page);
    ok(s.selectVisible && !s.resultVisible, "片方だけ選択で押しても、結果画面に進まない");
    const pressed = await page.evaluate(() => [...document.querySelectorAll("#companion-chips .chip")].map(c => c.getAttribute("aria-pressed")));
    ok(pressed[0] === "true" && pressed.slice(1).every(v => v === "false"), "選択状態が aria-pressed で伝わる(選択=true、他=false)");
    ok(await page.evaluate(() => document.getElementById("companion-chips").getAttribute("role") === "group" && !!document.getElementById("companion-chips").getAttribute("aria-labelledby")), "選択肢のグループに名前がある(role=group + aria-labelledby)");

    // 5つの条件
    for(const [c, m] of PATTERNS){
      await page.evaluate(() => { document.getElementById("r-restart") && document.getElementById("r-restart").click(); });
      await page.evaluate(() => { const b = document.getElementById("r-restart"); if(b && b.offsetParent) b.click(); });
      await sleep(150);
      await page.evaluate(() => { document.getElementById("screen-select").hidden = false; });
      await pick(page, c, m); await go(page);
      s = await state(page);
      const tag = "[" + c + "×" + m + "] ";
      if(s.empty){ ok(false, tag + "結果が0件(空の結果)になった"); continue; }
      ok(s.resultVisible && s.cond.includes(m), tag + "結果が表示され、条件バーに条件が出る: " + s.cond);
      ok(s.docW === s.cw, tag + "横はみ出しなし");
      ok(s.chips.length >= 3 && s.chips.length <= 4 && new Set(s.chips).size === s.chips.length, tag + "要点の表示が3〜4個で重複なし: " + s.chips.join(" / "));
      ok(s.chips.some(t => t.startsWith("一人あたり ¥")), tag + "一人あたりの予算がある");
      ok(s.chips.some(t => /駅から約|区/.test(t) || /阿佐ヶ谷|高円寺/.test(t)), tag + "最寄り駅またはエリアがある");
      ok(s.reasons.length >= 1 && s.reasons.length <= 2, tag + "理由は1〜2件(" + s.reasons.length + "件): " + s.reasons.join(" | "));
      ok(!/評価\d|口コミ|\d+件|お座敷/.test(s.reasons.join("")), tag + "評価点・口コミ件数・お座敷を理由に使っていない");
      ok(s.go.length > 4 && !/ここに行ってみる/.test(s.go), tag + "行き先ボタンの文言が遷移先を示す: 「" + s.go + "」");
      const host = new URL(s.goHref).hostname;
      ok((/tabelog/.test(host) && /食べログ/.test(s.go)) || (/hotpepper/.test(host) && /ホットペッパー/.test(s.go)) || (/google/.test(host) && /Googleマップ/.test(s.go)) || (!/tabelog|hotpepper|google|hitosara|ikyu|tablecheck/.test(host)), tag + "ボタンの文言とリンク先(" + host + ")が一致");
      ok(s.mapText.includes("Googleマップで見る") || s.map === null, tag + "地図ボタンの文言");
      ok(s.moreOpen === false && s.more.some(x => x.startsWith("営業時間:")) && s.more.some(x => x.startsWith("出典:")), tag + "詳細は折りたたまれ、営業時間・出典を含む");
      ok(s.sr.includes(s.name), tag + "結果更新が読み上げ領域に出る");
      const shown = [s.name].concat(s.triad.map(t => t.name), s.nearby.map(t => t.name));
      ok(new Set(shown).size === shown.length, tag + "本命・穴場・冒険・ほかの候補に同じ店がない");
      if(m === "コスパ重視"){
        const prices = [yen(s.chips.find(t => t.startsWith("一人あたり")))].concat(s.triad.map(t => yen(t.meta)), s.nearby.map(t => yen(t.pr)));
        ok(prices.every(p => p && p[1] <= 4000), tag + "全枠で予算上限が4,000円以下: " + JSON.stringify(prices));
      }
      if(c === "家族" && m === "家族みんなで") ok(!/菓|ケーキ|ジェラート|かき氷/.test(s.chips[0] + s.triad.map(t => t.meta).join("")), tag + "スイーツ専門店が出ない");
      ok(s.triad.every(t => t.link.endsWith("›")) && s.nearby.every(n => n.nl.endsWith("›")), tag + "穴場・冒険・ほかの候補にも遷移先の文言がある");
    }

    // 条件を変える(選択を保持)/ はじめから選び直す
    await pick(page, "夫婦", "ゆっくり話したい");
    await page.evaluate(() => { document.getElementById("screen-select").hidden = false; document.getElementById("screen-result").hidden = true; });
    await go(page);
    await page.evaluate(() => document.getElementById("r-change").click()); await sleep(500);
    s = await state(page);
    const kept = await page.evaluate(() => ({c: document.querySelector("#companion-chips .chip.on") && document.querySelector("#companion-chips .chip.on").textContent, m: document.querySelector("#mood-chips .chip.on") && document.querySelector("#mood-chips .chip.on").textContent, dis: document.getElementById("btn-hirameki").disabled}));
    ok(s.selectVisible && !s.resultVisible && /夫婦/.test(kept.c) && kept.m === "ゆっくり話したい" && !kept.dis, "条件を変える: 選択画面に戻り、前の選択が保たれる(" + kept.c + " / " + kept.m + ")");
    await pick(page, "夫婦", "コスパ重視"); await go(page);
    s = await state(page);
    ok(s.resultVisible && s.cond.includes("コスパ重視"), "条件を変えて再提案できる: " + s.cond);
    await page.evaluate(() => document.getElementById("r-restart").click()); await sleep(400);
    const cleared = await page.evaluate(() => ({on: document.querySelectorAll(".chip.on").length, dis: document.getElementById("btn-hirameki").disabled}));
    ok(cleared.on === 0 && cleared.dis, "はじめから選び直す: 選択が消え、提案ボタンが無効");

    // 「別のお店をひらめく」を6回連続 + 連打
    await pick(page, "友達", "飲みたい"); await go(page);
    let prev = await state(page); let allOk = true; const names = [prev.name]; const copies = [prev.copy];
    for(let i = 0; i < 6; i++){
      await page.evaluate(() => document.getElementById("r-reroll").scrollIntoView({block: "center"})); await sleep(350);
      await page.tap("#r-reroll"); await sleep(1300);
      const n = await state(page);
      const good = n.name !== prev.name && n.copy !== prev.copy && !/考え中/.test(n.copy) && n.nameR.top >= 0 && n.nameR.bottom <= n.vh && !n.btn && n.mascot && n.docW === n.cw;
      if(!good){ allOk = false; console.log("    再提案#" + (i + 1) + " NG", JSON.stringify({prev: prev.name, now: n.name, copy: n.copy, nameR: n.nameR, vh: n.vh})); }
      names.push(n.name); copies.push(n.copy); prev = n;
    }
    console.log("  店: " + names.join(" → "));
    ok(allOk, "再提案6回: 毎回 別の店・別のセリフ・店名が画面内・ひらり画像あり・横はみ出しなし");
    ok(new Set(names).size === names.length, "再提案6回で、同じ本命が繰り返されない");
    await page.evaluate(() => document.getElementById("r-reroll").scrollIntoView({block: "center"})); await sleep(400);
    const evBefore = (await events(page)).filter(e => e === "reroll").length;
    await page.tap("#r-reroll"); await sleep(40); await page.tap("#r-reroll");   // ダブルタップ
    await sleep(1500);
    const evMid = (await events(page)).filter(e => e === "reroll").length;
    ok(evMid - evBefore === 1, "ダブルタップでも切り替えは1回(二重処理なし)");
    await page.evaluate(() => { const b = document.getElementById("r-reroll"); for(let i = 0; i < 10; i++) b.click(); }); await sleep(1500);
    const evAfter = (await events(page)).filter(e => e === "reroll").length;
    ok(evAfter - evMid === 1, "10連打でも切り替えは1回");
    s = await state(page);
    ok(!s.btn && s.mascot, "連打のあとも操作できる状態に戻る(ボタン有効・ひらり画像あり)");
    ok(errors.length === 0, "JavaScriptエラーなし" + (errors.length ? " → " + errors.join(" / ") : ""));
    await page.close();
  }

  // ---- 候補不足・条件に合う店がない場合(実データ) ----
  console.log("\n■ 候補不足・0件・営業時間不明(390×844)");
  {
    const {page, errors} = await open(browser, {width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true});
    // 条件に合う店が0軒の組み合わせ(実データ)を探して、UIで確認
    const combos = await page.evaluate(() => {
      const out = {};
      for(const c of COMPANIONS) for(const m of MOODS){ const p = Recommend.pickPicks(RESTAURANTS, c.id, m.id, buildContext()); out[c.label + "|" + m.label] = {status: p.status, n: p.qualifiedCount}; }
      return out;
    });
    const relaxedKey = Object.keys(combos).find(k => combos[k].status === "relaxed");
    const fewKey = Object.keys(combos).find(k => combos[k].status === "few");
    console.log("  実データの例: relaxed=" + relaxedKey + " / few=" + fewKey);
    if(relaxedKey){
      const [c, m] = relaxedKey.split("|"); await pick(page, c.slice(0, 2), m); await go(page); let s = await state(page);
      ok(s.notice && /ゆるめて/.test(s.notice) && s.triad.length === 0 && s.nearby.length === 0, "条件に合う店が0軒: 「条件をゆるめた」と説明し、穴場・冒険・ほかの候補は出さない: " + s.notice);
      ok(await page.evaluate(() => document.getElementById("r-change").offsetParent !== null), "条件を変える導線がある");
    }
    if(fewKey){
      await page.evaluate(() => document.getElementById("r-change").click()); await sleep(300);
      const [c, m] = fewKey.split("|"); await pick(page, c.slice(0, 2), m); await go(page); const s = await state(page);
      ok(s.notice && /軒でした/.test(s.notice), "条件に合う店が1〜2軒: 件数を説明する: " + s.notice);
      ok(s.triad.length + 1 <= combos[fewKey].n, "足りない枠を、条件外の店で埋めない(表示 " + (s.triad.length + 1) + "軒 ≤ 該当 " + combos[fewKey].n + "軒)");
    }
    // 空の結果(該当0軒かつ近い店もない場合)の表示
    await page.evaluate(() => { window.__orig = Recommend.pickPicks; Recommend.pickPicks = () => ({status: "none", qualifiedCount: 0, pool: [], honban: null, anaba: null, boken: null}); });
    await page.evaluate(() => document.getElementById("r-change").click()); await sleep(300);
    await pick(page, "ひとり", "サクッと"); await go(page);
    let s = await state(page);
    ok(s.empty, "候補が0軒のとき、説明の画面が出る");
    ok(await page.evaluate(() => document.getElementById("re-body").textContent.includes("条件を変える") && document.getElementById("re-change").offsetParent !== null && document.querySelector(".result-card").offsetParent === null), "空の結果: 説明と「条件を変える」があり、カードは出ない");
    await page.evaluate(() => document.getElementById("re-change").click()); await sleep(300);
    s = await state(page);
    ok(s.selectVisible && !s.resultVisible, "空の結果から、条件を変えて戻れる");
    await page.evaluate(() => { Recommend.pickPicks = window.__orig; });

    // 営業時間不明・食い違いのある店の表示
    const force = id => page.evaluate(i => { const r = RESTAURANTS.find(x => x.id === i); Recommend.pickPicks = () => ({status: "ok", qualifiedCount: 5, pool: [], honban: {r, bucket: 1, score: 1}, anaba: null, boken: null}); }, id);
    for(const [id, expects] of [["asagaya-curry-kankan", {chip: "営業時間未確認", note: /間借り/, more: "営業時間:未確認"}], ["koenji-tomochin", {chip: "営業時間未確認", note: /営業時間変更のお知らせ/, more: "営業時間:未確認"}], ["koenji-tonkotsu-souten", {note: /公式サイトと食べログ/, more: /出典:公式サイト/}], ["koenji-katsuraya", {chip: /中野区本町・新中野駅から約340m/}]]){
      await force(id);
      await pick(page, "ひとり", "サクッと"); await go(page); s = await state(page);
      const nm = s.name;
      if(expects.chip) ok(s.chips.some(t => expects.chip instanceof RegExp ? expects.chip.test(t) : t === expects.chip), nm + ": 表示「" + (expects.chip instanceof RegExp ? expects.chip : expects.chip) + "」 / 実際: " + s.chips.join(" / "));
      if(expects.note) ok(s.infonote && expects.note.test(s.infonote), nm + ": 注意書き「" + (s.infonote || "なし").slice(0, 40) + "…」");
      if(expects.more) ok(s.more.some(x => expects.more instanceof RegExp ? expects.more.test(x) : x === expects.more), nm + ": 詳細に「" + (expects.more) + "」");
      await page.evaluate(() => document.getElementById("r-change").click()); await sleep(250);
    }
    // 折りたたみを開くと出典と注意書き
    await force("koenji-tonkotsu-souten"); await pick(page, "ひとり", "サクッと"); await go(page);
    await page.evaluate(() => { document.querySelector("#r-more summary").click(); });
    s = await state(page);
    ok(s.moreOpen && s.more.some(x => /席数:約14席/.test(x)) && s.more.some(x => /出典:公式サイト\(2026年9月20日確認\)/.test(x)), "蒼翔: 詳細を開くと席数(約14席)と出典・確認日が見える");
    ok(errors.length === 0, "JavaScriptエラーなし" + (errors.length ? " → " + errors.join(" / ") : ""));
    await page.close();
  }

  // ---- データ読み込み失敗 ----
  console.log("\n■ データ読み込み失敗");
  for(const blocked of ["data/restaurants.js", "data/store-info.js", "lib/recommend.js"]){
    const {page, reqs} = await open(browser, {width: 390, height: 844, isMobile: true, hasTouch: true}, {block: [blocked]});
    const st = await page.evaluate(() => ({err: !document.getElementById("load-error").hidden, dis: document.getElementById("btn-hirameki").disabled, text: document.getElementById("load-error").textContent.trim().slice(0, 30), retry: !!document.querySelector("#load-error button")}));
    ok(st.err && st.dis && st.retry, blocked + " が読めない: 説明と再読み込みボタンを表示し、提案ボタンは無効 (" + st.text + "…)");
    const before = reqs.filter(u => u.includes(blocked)).length;
    await Promise.all([page.waitForNavigation({waitUntil: "load"}).catch(() => {}), page.evaluate(() => document.querySelector("#load-error button").click())]);
    await sleep(300);
    ok(reqs.filter(u => u.includes(blocked)).length > before, blocked + ": 「もう一度読み込む」で再取得を試みる");
    await page.close();
  }
  {
    const {page} = await open(browser, {width: 390, height: 844, isMobile: true, hasTouch: true});
    ok(await page.evaluate(() => document.getElementById("load-error").hidden), "正常時: 読み込みエラーは出ない");
    await page.close();
  }

  // ---- PC ----
  console.log("\n■ PC 1280×900");
  {
    const {page, errors} = await open(browser, {width: 1280, height: 900});
    await pick(page, "夫婦", "ゆっくり話したい"); await go(page);
    let s = await state(page);
    ok(s.docW === s.cw && s.mascot && s.chips.length >= 3, "PC: 結果が表示され、横はみ出しなし・ひらり画像あり");
    await page.evaluate(() => document.getElementById("r-reroll").scrollIntoView({block: "center"})); await sleep(300);
    await page.click("#r-reroll"); await sleep(1300);
    const n = await state(page);
    ok(n.name !== s.name && n.nameR.top >= 0 && n.nameR.bottom <= n.vh, "PC: 再提案で別の店に切り替わり、店名が画面内に見える");
    await page.screenshot({path: OUT_DIR + "/ui-pc-result.png"});
    ok(errors.length === 0, "JavaScriptエラーなし");
    await page.close();
  }

  await browser.close();
  console.log("\n結果: OK " + pass + " / NG " + fail);
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
