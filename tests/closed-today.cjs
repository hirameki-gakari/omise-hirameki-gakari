#!/usr/bin/env node
/**
 * 「今日が定休日の店を提案しない」ことの検証。
 *   node tests/closed-today.cjs
 * index.html のロジックを切り出して、全曜日 × 全「誰と×気分」(5×10)で
 * 提案(本命・穴場・冒険・近くの店)に定休曜日の店が混ざらないことを確認する。
 */
const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");
const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const data = fs.readFileSync(path.join(ROOT, "data/restaurants.js"), "utf8")
           + fs.readFileSync(path.join(ROOT, "data/store-info.js"), "utf8");

// index.html の「選択肢・重み・絞り込み・推薦選定」ブロックをそのまま切り出す(UI部分は含まない)
const from = html.indexOf("const COMPANIONS = [");
const to = html.indexOf("const MOOD_DESCRIPTOR");
if(from === -1 || to === -1) throw new Error("index.html の推薦ロジックの範囲が見つかりません");
const logic = html.slice(from, to);

const factory = new Function(`
  ${data}
  const localStorage = {getItem(){ return null; }, setItem(){}, removeItem(){}};
  const sessionStorage = localStorage;
  ${logic}
  return {RESTAURANTS, STORE_INFO, computePool, pickThreePicks, isClosedToday, todayWeekday};
`);
const S = factory();

let failures = 0, checks = 0;
const companions = ["solo","couple","family","friends","colleagues"];
const moods = ["drinking","hearty","calm","lively","indulgent","budget","stylish","adventurous","familyFun","quick"];

for(let wd = 0; wd < 7; wd++){
  // 曜日を固定するため、その曜日の昼12時のDateを使う
  const RealDate = Date;
  const base = new RealDate(2026, 8, 20 + wd, 12, 0, 0); // 2026-09-20(日)〜
  global.Date = class extends RealDate { constructor(...a){ return a.length ? new RealDate(...a) : new RealDate(base); } };
  // extractした関数はDateを直接参照するため、Functionスコープにも反映
  for(const c of companions) for(const m of moods){
    for(let k = 0; k < 20; k++){
      const picks = S.pickThreePicks(c, m);
      const pool = S.computePool(c, m);
      const shown = [picks.honban, picks.anaba, picks.boken].concat(pool).map(x => x.r);
      shown.forEach(r => { checks++; if(S.isClosedToday(r, wd)){ failures++; console.log("NG", "曜日"+wd, c, m, r.id); } });
    }
  }
  global.Date = RealDate;
}

// 境界: 深夜3時台は前日扱い、4時以降は当日
const eq = (a, b, msg) => { checks++; if(a !== b){ failures++; console.log("NG", msg, a, b); } };
eq(S.todayWeekday(new Date(2026, 8, 21, 2, 0)), 0, "月曜2時は日曜扱い");
eq(S.todayWeekday(new Date(2026, 8, 21, 4, 0)), 1, "月曜4時は月曜");
eq(S.todayWeekday(new Date(2026, 8, 20, 3, 59)), 6, "日曜3:59は土曜扱い");

console.log(`検証 ${checks} 件、失敗 ${failures} 件`);
process.exit(failures ? 1 : 0);
