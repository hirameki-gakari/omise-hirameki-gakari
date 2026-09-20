#!/usr/bin/env node
/**
 * 営業時間の読み取り(parseHours)と、今開いているかの判定(statusAt)の検証。
 *   node tests/open-hours.cjs
 */
const fs = require("fs");
const path = require("path");
const OH = require(path.join(__dirname, "..", "lib/open-hours.js"));

let failures = 0, checks = 0;
function eq(a, b, msg){ checks++; if(JSON.stringify(a) !== JSON.stringify(b)){ failures++; console.log("NG", msg, "\n   実際:", JSON.stringify(a), "\n   期待:", JSON.stringify(b)); } }
// 2026-09-20 は日曜。曜日 wd(0=日)・時刻 h:m のDate
const at = (wd, h, m) => new Date(2026, 8, 20 + wd, h, m || 0);
const day = (slots, d) => slots[d].map(x => OH.hhmm(x[0]) + "-" + OH.hhmm(x[1]));

// ---- 読み取り ----
let p = OH.parseHours("月〜土 17:00〜翌2:00 / 日 15:00〜24:00");
eq(day(p, 1), ["17:00-翌2:00"], "月〜土・翌2時");
eq(day(p, 0), ["15:00-翌0:00"], "日・24時");
p = OH.parseHours("月、火、木、金: 16:00～23:00（料理L.O.22:00）、土、日: 11:30～23:00");
eq([1,2,3,4,5,6,0].map(d => p[d].length), [1,1,0,1,1,1,1], "曜日を読点で並べる書式(水は営業枠なし)");
p = OH.parseHours("火・水・木・金 16:00～23:30（L.O.料理22:30）、土・祝日 12:00～23:30");
eq(day(p, 6), ["12:00-23:30"], "「土・祝日」を土曜として読む(祝日を日曜と誤読しない)");
eq(day(p, 0), [], "「土・祝日」で日曜に営業枠が付かない");
p = OH.parseHours("水〜日 11:30〜15:00、17:30〜22:00");
eq(day(p, 3), ["11:30-15:00", "17:30-22:00"], "昼夜2枠");
p = OH.parseHours("11:30〜22:00");
eq([0,1,2,3,4,5,6].every(d => p[d].length === 1), true, "曜日指定なしは全日");
p = OH.parseHours("05:00〜翌5:00(24時間営業)");
eq(day(p, 2), ["5:00-翌5:00"], "24時間営業の表記");
p = OH.parseHours("平日 11:30〜15:30 / 土日祝 11:30〜16:00");
eq([day(p, 3), day(p, 6), day(p, 0)], [["11:30-15:30"], ["11:30-16:00"], ["11:30-16:00"]], "平日・土日祝");
p = OH.parseHours("[月]17:00〜24:00(L.O.23:00) [日・水〜金・土・祝・祝前]17:00〜26:00(L.O.25:00)");
eq([day(p, 1), day(p, 5), day(p, 2)], [["17:00-翌0:00"], ["17:00-翌2:00"], []], "角括弧の曜日指定");

// 曖昧な書式は「不明」(null)にする
["火 ランチのみ 11:30〜14:00", "11:00〜22:00(日曜は21:00まで)", "ランチ 12:00〜14:30 ※平日ランチの営業日は不定期",
 "営業時間 不定期", "", null, "Instagram参照"].forEach(x => eq(OH.parseHours(x), null, "不明扱い: " + x));

// ---- 判定(2026-09-20=日曜〜) ----
const store = OH.parseHours("月〜日 17:00〜23:00");
eq(OH.statusAt(store, at(1, 15)), {state: "later", opens: 17 * 60}, "開店前(15:00)は later");
eq(OH.statusAt(store, at(1, 17)).state, "open", "開店ちょうど(17:00)は open");
eq(OH.statusAt(store, at(1, 22, 15)).state, "open", "閉店まで45分ちょうどは open");
eq(OH.statusAt(store, at(1, 22, 16)).state, "finished", "閉店まで45分を切ったら finished");
eq(OH.statusAt(store, at(1, 23, 30)).state, "finished", "閉店後は finished");
// 前日から続く深夜営業
const late = OH.parseHours("月〜土 17:00〜翌2:00");
eq(OH.statusAt(late, at(2, 1, 0)).state, "open", "火曜1:00は月曜夜の続きで open");
eq(OH.statusAt(late, at(2, 1, 0)).closes, 120, "閉店は2:00");
eq(OH.statusAt(late, at(2, 3, 0)).state, "later", "火曜3:00は今夜の開店待ち(later)");
eq(OH.statusAt(late, at(0, 1, 0)).state, "open", "日曜1:00は土曜夜の続きで open(日曜自体の営業枠がなくても)");
eq(OH.statusAt(late, at(0, 12, 0)), null, "日曜昼は営業枠が無い曜日なので判定しない(null)");
eq(OH.statusAt(null, at(1, 12, 0)), null, "営業時間が読み取れない店は判定しない(null)");
eq(OH.label(OH.statusAt(store, at(1, 15))), "通常は17:00から営業", "ラベル(開店前)");
eq(OH.label(OH.statusAt(store, at(1, 19))), "通常は営業中(〜23:00)", "ラベル(営業中)");
eq(OH.label(OH.statusAt(late, at(2, 1))), "通常は営業中(〜2:00)", "ラベル(深夜・翌日表記にしない)");
eq(OH.label(OH.statusAt(OH.parseHours("月〜土 17:30〜24:00"), at(1, 19))), "通常は営業中(〜24:00)", "ラベル(24時閉店は24:00)");

// ---- 実データ ----
const data = ["restaurants", "store-info", "store-contact"].map(f => fs.readFileSync(path.join(__dirname, "..", "data", f + ".js"), "utf8")).join("\n");
const R = new Function(data + "; return RESTAURANTS;")();
const withHours = R.filter(r => r.hours && !r.closed);
const parsed = withHours.filter(r => OH.parseHours(r.hours));
checks++; if(parsed.length / withHours.length < 0.9){ failures++; console.log("NG 営業時間の読み取り率が90%未満", parsed.length, "/", withHours.length); }
// 定休曜日と食い違う営業枠(曜日指定のある書式で)は、店側の定休日データを優先して提案から外すので許容する。ただし件数の急増は検知する
let conflicts = 0;
parsed.forEach(r => {
  const sl = OH.parseHours(r.hours);
  const explicit = /[月火水木金土日平]/.test(r.hours.replace(/\(.*?\)|（.*?）/g, "").replace(/[0-9:：〜～\-–\s/、（）()LOフードドリンク料理ラスト入店翌]/g, ""));
  (r.closedWeekdays || []).forEach(d => { if(explicit && sl[d].length) conflicts++; });
});
checks++; if(conflicts > 5){ failures++; console.log("NG 定休曜日と営業時間の食い違いが多すぎる", conflicts); }

console.log("検証 " + checks + " 件、失敗 " + failures + " 件");
process.exit(failures ? 1 : 0);
