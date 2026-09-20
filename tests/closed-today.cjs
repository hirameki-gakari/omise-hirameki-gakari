#!/usr/bin/env node
/**
 * 「提案してはいけない店を出さない」ことの検証。
 *   node tests/closed-today.cjs
 * 全曜日 × 時間帯(3・11・15・19・23時) × 全「誰と×気分」(5×10)で、提案(本命・穴場・冒険・ほかの候補)に
 * 次の店が混ざらないことを、実装(lib/recommend.js)とは独立した基準で確認する。
 *   - 閉店・除外リスト(STORE_CLOSED)の店
 *   - 今日が毎週の定休日の店
 *   - 今日の営業が終わった店(閉店まで45分を切り、この後の営業もない店)
 * あわせて、除外リストが実際に効いていること、STORE_INFO にid重複がないこと、曜日の境界を確認する。
 */
const fs = require("fs");
const path = require("path");
const {ROOT, RESTAURANTS, STORE_CLOSED, Recommend, OpenHours, ctx, at, COMPANIONS, MOODS} = require("./helpers/load-data.cjs");

let failures = 0, checks = 0;
function ok(cond, msg){ checks++; if(!cond){ failures++; console.log("NG", msg); } }

// 検証対象(lib/recommend.js)とは独立した判定基準
function oracleUnavailable(r, now){
  if(r.closed) return true;
  const wk = (now.getHours() < 4 ? now.getDay() + 6 : now.getDay()) % 7;
  if(Array.isArray(r.closedWeekdays) && r.closedWeekdays.includes(wk)) return true;
  const st = OpenHours.statusAt(OpenHours.parseHours(r.hours), now);
  return !!st && st.state === "finished";
}

const HOURS = [3, 11, 15, 19, 23];
for(let wd = 0; wd < 7; wd++){
  for(const hour of HOURS){
    const now = at(wd, hour);
    for(const c of COMPANIONS) for(const m of MOODS){
      for(let k = 0; k < 4; k++){
        const picks = Recommend.pickPicks(RESTAURANTS, c, m, ctx(now));
        const shown = [picks.honban, picks.anaba, picks.boken].concat(picks.pool).filter(Boolean).map(x => x.r);
        shown.forEach(r => {
          checks++;
          if(oracleUnavailable(r, now)){ failures++; console.log("NG", "曜日" + wd, hour + "時", c, m, r.id); }
        });
      }
    }
  }
}

// 除外リスト(STORE_CLOSED)の全店が実際に除外されていること(同じidが STORE_INFO 側にあっても上書きされない)
const closedIds = Object.keys(STORE_CLOSED);
ok(closedIds.length >= 12, "STORE_CLOSED の件数が想定より少ない: " + closedIds.length);
closedIds.forEach(id => {
  const r = RESTAURANTS.find(x => x.id === id);
  if(!r){ ok(false, "STORE_CLOSED に存在しないid: " + id); return; }
  ok(!!r.closed, "除外が効いていない: " + id);
  ok(Recommend.isUnavailable(r, at(0, 12)), "isUnavailable が false: " + id);
});

// STORE_INFO 内のidの重複(後ろの定義が前を上書きして、意図しない値になる)を検出
const infoSrc = fs.readFileSync(path.join(ROOT, "data/store-info.js"), "utf8");
const infoBody = infoSrc.slice(infoSrc.indexOf("const STORE_INFO = {"));
const keys = [...infoBody.matchAll(/^  "([a-z0-9\-]+)":\{/gm)].map(m => m[1]);
const dup = keys.filter((k, i) => keys.indexOf(k) !== i);
ok(!dup.length, "STORE_INFO にidの重複: " + [...new Set(dup)].join(", "));

// 境界: 深夜3時台は前日扱い、4時以降は当日
ok(Recommend.todayWeekday(new Date(2026, 8, 21, 2, 0)) === 0, "月曜2時は日曜扱い");
ok(Recommend.todayWeekday(new Date(2026, 8, 21, 4, 0)) === 1, "月曜4時は月曜");
ok(Recommend.todayWeekday(new Date(2026, 8, 20, 3, 59)) === 6, "日曜3:59は土曜扱い");

console.log("検証 " + checks + " 件、失敗 " + failures + " 件");
process.exit(failures ? 1 : 0);
