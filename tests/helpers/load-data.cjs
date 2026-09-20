/**
 * テスト用: 画面(index.html)と同じ手順で店舗データを読み込む。
 *   const {RESTAURANTS, STORE_INFO, STORE_CLOSED, STORE_CONTACT, Recommend, OpenHours, ctx} = require("./helpers/load-data.cjs");
 * data/*.js を順に評価し、営業時間を営業枠に変換し、確認済みデータによる補正を適用する。
 */
const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..", "..");
const OpenHours = require(path.join(ROOT, "lib/open-hours.js"));
const Recommend = require(path.join(ROOT, "lib/recommend.js"));

const files = ["restaurants", "store-info", "store-contact"];
const src = files.map(f => fs.readFileSync(path.join(ROOT, "data", f + ".js"), "utf8")).join("\n");
const loaded = new Function(src + "; return {RESTAURANTS, STORE_INFO, STORE_CLOSED, STORE_CONTACT};")();
const RESTAURANTS = loaded.RESTAURANTS;
RESTAURANTS.forEach(r => { r.openSlots = OpenHours.parseHours(r.hours); });
Recommend.applyEvidenceCaps(RESTAURANTS);

/* 推薦に渡す文脈。now は指定日時、randomは差し替え可能(既定は乱数) */
function ctx(now, extra){
  return Object.assign({now: now || new Date(), history: [], seenIds: new Set(), shownGenres: new Set(), random: Math.random}, extra || {});
}
/* 2026-09-20(日)を基準に、曜日 wd(0=日)・時刻 h:m の Date */
function at(wd, h, m){ return new Date(2026, 8, 20 + wd, h, m || 0); }

module.exports = {
  ROOT, src, RESTAURANTS, STORE_INFO: loaded.STORE_INFO, STORE_CLOSED: loaded.STORE_CLOSED, STORE_CONTACT: loaded.STORE_CONTACT,
  Recommend, OpenHours, ctx, at,
  COMPANIONS: ["solo", "couple", "family", "friends", "colleagues"],
  MOODS: ["drinking", "hearty", "calm", "lively", "indulgent", "budget", "stylish", "adventurous", "familyFun", "quick"]
};
