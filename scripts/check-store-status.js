#!/usr/bin/env node
/**
 * 掲載店の「閉店・移転・休業」と、連絡先(電話・住所)の変化を、食べログのページから確認する。
 * 読み取り専用。data/ 配下のファイルは一切書き換えない。
 *
 *   node scripts/check-store-status.js                 # 全店を確認(約10分)
 *   node scripts/check-store-status.js --limit 10      # 先頭10店だけ(動作確認用)
 *   node scripts/check-store-status.js --stale-months 9 # 「最新の口コミが古い」の基準(既定 8か月)
 *   node scripts/check-store-status.js --out report.md  # 結果をMarkdownで保存
 *
 * 出力:
 *   1. 閉店・移転・休業の表示が出た店 … 提案から外す候補(data/store-info.js の STORE_CLOSED に追記する行も表示)
 *   2. 最新の口コミが古い店 … 閉店の疑い。現地・SNSで確認してから判断する(表示が出ていない店も含む)
 *   3. 電話番号・住所が食べログ上で変わった店 … data/store-contact.js の更新候補
 *   4. 取得できなかった店
 *
 * 終了コード: 0=要対応なし / 2=1または3に該当あり / 1=実行エラー
 *
 * 注意: 食べログの表示は遅れることがある。閉店の最終判断は、現地・公式SNS・電話などで確認すること。
 *       アクセス先に負荷をかけないよう、1リクエストごとに間隔を空ける(--sleep ミリ秒、既定 700)。
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15";

function arg(name, def){
  const i = process.argv.indexOf("--" + name);
  return i === -1 ? def : (process.argv[i + 1] === undefined || process.argv[i + 1].startsWith("--") ? true : process.argv[i + 1]);
}
const LIMIT = parseInt(arg("limit", "0"), 10) || 0;
const STALE_MONTHS = parseInt(arg("stale-months", "8"), 10);
const SLEEP = parseInt(arg("sleep", "700"), 10);
const OUT = arg("out", null);

const sleep = ms => new Promise(r => setTimeout(r, ms));
const src = ["restaurants", "store-info", "store-contact"]
  .map(f => fs.readFileSync(path.join(ROOT, "data", f + ".js"), "utf8")).join("\n");
const RESTAURANTS = new Function(src + "; return RESTAURANTS;")();

async function get(url){
  for(let i = 0; i < 3; i++){
    try{
      const res = await fetch(url, {headers: {"User-Agent": UA, "Accept-Language": "ja"}});
      if(res.status === 200) return await res.text();
      if(res.status === 404) return "404";
    }catch(e){ /* 再試行 */ }
    await sleep(1500);
  }
  return null;
}

function decode(s){
  return s.replace(/&amp;/g, "&").replace(/&#39;/g, "'").replace(/&quot;/g, '"');
}

function latestVisit(html){
  const months = [...html.matchAll(/(\d{4})\/(\d{2})訪問/g)].map(m => m[1] + "/" + m[2]).sort();
  return months.length ? months[months.length - 1] : null;
}

function monthsAgo(ym, now){
  const [y, m] = ym.split("/").map(Number);
  return (now.getFullYear() - y) * 12 + (now.getMonth() + 1 - m);
}

(async () => {
  const now = new Date();
  let targets = RESTAURANTS.filter(r => !r.closed && r.tabelogUrl);
  if(LIMIT) targets = targets.slice(0, LIMIT);
  const skipped = RESTAURANTS.filter(r => !r.closed && !r.tabelogUrl).map(r => r.name);

  const flagged = [], stale = [], changed = [], failed = [];
  let n = 0;
  for(const r of targets){
    n++;
    process.stderr.write("\r確認中 " + n + "/" + targets.length + " ");
    const page = await get(r.tabelogUrl);
    await sleep(SLEEP);
    if(!page || page === "404"){ failed.push({r, why: page === "404" ? "ページが見つからない(404)" : "取得失敗"}); continue; }

    const title = decode((page.match(/<title>([^<]*)/) || [])[1] || "");
    const flag = (title.match(/【(閉店|移転|休業|一時休業|閉業)[^】]*】/) || [])[0] || null;
    if(flag){ flagged.push({r, flag, title}); }

    // 連絡先の変化(食べログのJSON-LD)
    const tel = (page.match(/"telephone"\s*:\s*"([^"]+)"/) || [])[1] || null;
    const addr = (page.match(/"streetAddress"\s*:\s*"([^"]+)"/) || [])[1] || null;
    const telNow = tel && /^0\d{1,4}-\d{1,4}-\d{3,4}$/.test(tel) ? tel : null;
    const diffs = [];
    if(r.tel && telNow && r.tel !== telNow) diffs.push("電話 " + r.tel + " → " + telNow);
    if(r.tel && !telNow) diffs.push("電話 " + r.tel + " → (掲載なし)");
    // 住所は「丁目・番地まで」(建物名・階を除く)で比べる
    const street = v => v.replace(/^(杉並区|中野区)/, "").trim().split(/\s+/)[0];
    if(r.address && addr && street(r.address) !== street(addr)) diffs.push("住所 " + r.address + " → " + addr);
    if(diffs.length) changed.push({r, diffs});

    // 最新の口コミ月(古ければ閉店の疑い)
    if(!flag){
      const rv = await get(r.tabelogUrl + "dtlrvwlst/?SrtT=nod&lc=0&rvw_part=all&PG=1");
      await sleep(SLEEP);
      const ym = rv && rv !== "404" ? latestVisit(rv) : null;
      if(ym && monthsAgo(ym, now) >= STALE_MONTHS) stale.push({r, ym, ago: monthsAgo(ym, now)});
      else if(!ym && rv) stale.push({r, ym: "(口コミなし)", ago: 999});
    }
  }
  process.stderr.write("\n");

  // ---- レポート ----
  const L = [];
  const date = now.toISOString().slice(0, 10);
  L.push("# 掲載店の状況チェック " + date, "");
  L.push("確認 " + targets.length + " 店 / 閉店等の表示 " + flagged.length + " / 口コミが古い " + stale.length +
         " / 連絡先の変化 " + changed.length + " / 取得できず " + failed.length + (skipped.length ? " / 食べログURLなし " + skipped.length : ""), "");

  L.push("## 1. 閉店・移転・休業の表示が出た店", "");
  if(!flagged.length) L.push("なし", "");
  flagged.forEach(x => L.push("- **" + x.r.name + "** " + x.flag + "　" + x.r.tabelogUrl));
  if(flagged.length){
    L.push("", "data/store-info.js の STORE_CLOSED に追記する候補(内容を確認してから):", "", "```js");
    flagged.forEach(x => L.push('  "' + x.r.id + '":"' + x.flag.replace(/[【】]/g, "") + '(食べログ表示・' + date + ')",'));
    L.push("```", "");
  }

  L.push("## 2. 最新の口コミが" + STALE_MONTHS + "か月以上前の店(閉店の疑い・要確認)", "");
  if(!stale.length) L.push("なし", "");
  stale.sort((a, b) => b.ago - a.ago).forEach(x => L.push("- " + x.r.name + "　最新の訪問 " + x.ym + "　" + x.r.tabelogUrl));
  if(stale.length) L.push("", "口コミが少ない小さな店も含まれる。閉店の根拠にはならないので、現地・公式SNSで確認する。", "");

  L.push("## 3. 電話番号・住所が変わった店", "");
  if(!changed.length) L.push("なし", "");
  changed.forEach(x => L.push("- " + x.r.name + "　" + x.diffs.join(" / ")));
  if(changed.length) L.push("", "data/store-contact.js の更新候補。移転の場合は店名・エリア・最寄駅も見直す。", "");

  if(failed.length){
    L.push("## 4. 取得できなかった店", "");
    failed.forEach(x => L.push("- " + x.r.name + "　" + x.why + "　" + x.r.tabelogUrl));
    L.push("");
  }
  if(skipped.length) L.push("食べログURLがなく確認していない店: " + skipped.join("、"), "");

  const report = L.join("\n");
  console.log(report);
  if(OUT){ fs.writeFileSync(path.resolve(OUT), report + "\n"); console.error("保存しました: " + OUT); }
  process.exit(flagged.length || changed.length ? 2 : 0);
})().catch(e => { console.error(e); process.exit(1); });
