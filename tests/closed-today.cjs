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

const OpenHours = require(path.join(ROOT, "lib/open-hours.js"));
const factory = new Function("OpenHours", `
  ${data}
  const localStorage = {getItem(){ return null; }, setItem(){}, removeItem(){}};
  const sessionStorage = localStorage;
  RESTAURANTS.forEach(r => { r.openSlots = OpenHours.parseHours(r.hours); });
  ${logic}
  return {RESTAURANTS, STORE_INFO, computePool, pickThreePicks, isClosedToday, isUnavailable, isFinishedNow, todayWeekday};
`);
const S = factory(OpenHours);

let failures = 0, checks = 0;
const companions = ["solo","couple","family","friends","colleagues"];
const moods = ["drinking","hearty","calm","lively","indulgent","budget","stylish","adventurous","familyFun","quick"];

// 検証対象(index.html の isUnavailable)とは独立した判定基準。
// 「除外された店」「今日が定休日」「今日の営業が終わった(閉店45分前を含む)」のどれかなら提案してはいけない。
function oracleUnavailable(r, now){
  if(r.closed) return true;
  const wk = (now.getHours() < 4 ? now.getDay() + 6 : now.getDay()) % 7;
  if(Array.isArray(r.closedWeekdays) && r.closedWeekdays.includes(wk)) return true;
  const slots = OpenHours.parseHours(r.hours);
  const st = OpenHours.statusAt(slots, now);
  return !!st && st.state === "finished";
}

// 全曜日 × 時間帯(深夜3時・昼11時・15時・夜19時・23時)で、
// 提案(本命・穴場・冒険・近くの店)に「定休日・閉店・今日の営業が終わった店」が混ざらないこと
const HOURS = [3, 11, 15, 19, 23];
const RealDate = Date;
for(let wd = 0; wd < 7; wd++){
  for(const hour of HOURS){
    const base = new RealDate(2026, 8, 20 + wd, hour, 0, 0); // 2026-09-20(日)〜
    global.Date = class extends RealDate { constructor(...a){ return a.length ? new RealDate(...a) : new RealDate(base); } };
    for(const c of companions) for(const m of moods){
      for(let k = 0; k < 6; k++){
        const picks = S.pickThreePicks(c, m);
        const pool = S.computePool(c, m);
        const shown = [picks.honban, picks.anaba, picks.boken].concat(pool).map(x => x.r);
        shown.forEach(r => {
          checks++;
          if(oracleUnavailable(r, base)){ failures++; console.log("NG", "曜日"+wd, hour+"時", c, m, r.id); }
        });
      }
    }
    global.Date = RealDate;
  }
}

// 除外リスト(STORE_CLOSED)の全店が実際に除外されていること。
// (同じidが STORE_INFO 側にも別途あっても、除外が上書きされない)
const closedTable = new Function(data + "; return STORE_CLOSED;")();
const closedIds = Object.keys(closedTable);
checks++; if(closedIds.length < 12){ failures++; console.log("NG STORE_CLOSED の件数が想定より少ない", closedIds.length); }
closedIds.forEach(id => {
  const r = S.RESTAURANTS.find(x => x.id === id);
  checks++; if(!r){ failures++; console.log("NG STORE_CLOSED に存在しないid", id); return; }
  checks++; if(!r.closed){ failures++; console.log("NG 除外が効いていない", id); }
  checks++; if(!S.isClosedToday(r, 0)){ failures++; console.log("NG isClosedToday が false", id); }
});

// STORE_INFO 内のidの重複(後ろの定義が前を上書きして、意図しない値になる)を検出
const infoSrc = fs.readFileSync(path.join(ROOT, "data/store-info.js"), "utf8");
const infoBody = infoSrc.slice(infoSrc.indexOf("const STORE_INFO = {"));
const keys = [...infoBody.matchAll(/^  "([a-z0-9\-]+)":\{/gm)].map(m => m[1]);
const dup = keys.filter((k, i) => keys.indexOf(k) !== i);
checks++; if(dup.length){ failures++; console.log("NG STORE_INFO にidの重複", [...new Set(dup)].join(", ")); }

// 境界: 深夜3時台は前日扱い、4時以降は当日
const eq = (a, b, msg) => { checks++; if(a !== b){ failures++; console.log("NG", msg, a, b); } };
eq(S.todayWeekday(new Date(2026, 8, 21, 2, 0)), 0, "月曜2時は日曜扱い");
eq(S.todayWeekday(new Date(2026, 8, 21, 4, 0)), 1, "月曜4時は月曜");
eq(S.todayWeekday(new Date(2026, 8, 20, 3, 59)), 6, "日曜3:59は土曜扱い");

console.log(`検証 ${checks} 件、失敗 ${failures} 件`);
process.exit(failures ? 1 : 0);
