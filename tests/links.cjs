#!/usr/bin/env node
/**
 * 「ここに行ってみる」の行き先・電話・地図リンクの検証。
 *   node tests/links.cjs
 * - 行き先は 予約 > 公式 > 食べログ > 地図 の順になっている
 * - 食べログURLがある店は、地図(検索)に落ちない
 * - 電話番号は 0X-XXXX-XXXX 形式のみ(食べログ経由の050番号・非公開表記は入れない)
 * - 地図検索は店名+住所で行う(住所がある店)
 * - 閉店として除外した店の連絡先は、リンク先を持たなくてよい(提案に出ないため対象外)
 */
const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");
const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const data = ["restaurants", "store-info", "store-contact"].map(f => fs.readFileSync(path.join(ROOT, "data", f + ".js"), "utf8")).join("\n");

function extractFunction(source, name){
  const start = source.indexOf("function " + name + "(");
  if(start === -1) throw new Error(name + " が見つかりません");
  let depth = 0, i = source.indexOf("{", start);
  for(; i < source.length; i++){
    if(source[i] === "{") depth++;
    else if(source[i] === "}"){ depth--; if(depth === 0) break; }
  }
  return source.slice(start, i + 1);
}
const fns = ["mapsUrl", "destinationOf", "goUrl"].map(n => extractFunction(html, n)).join("\n");
const S = new Function(data + "\n" + fns + "\nreturn {RESTAURANTS, mapsUrl, destinationOf, goUrl};")();

let failures = 0, checks = 0;
function ok(cond, msg){ checks++; if(!cond){ failures++; console.log("NG", msg); } }

S.RESTAURANTS.filter(r => !r.closed).forEach(r => {
  const url = S.goUrl(r), dest = S.destinationOf(r);
  // 食べログ・地図は必ずhttps。店の公式サイトは、店側がhttps未対応(例: とらや椿山)ならhttpを許容する
  ok(dest === "official" || dest === "reservation" ? /^https?:\/\//.test(url) : /^https:\/\//.test(url), r.id + " の行き先が不正: " + url);
  if(r.reservationUrl) ok(dest === "reservation" && url === r.reservationUrl, r.id + " 予約URLが最優先でない");
  else if(r.officialUrl) ok(dest === "official" && url === r.officialUrl, r.id + " 公式URLが2番手でない");
  else if(r.tabelogUrl) ok(dest === "tabelog" && url === r.tabelogUrl, r.id + " 食べログURLが3番手でない");
  else ok(dest === "maps" && url.includes("google.com/maps"), r.id + " 最後は地図になる");
  if(r.tabelogUrl) ok(/^https:\/\/tabelog\.com\/tokyo\/A\d+\/A\d+\/\d+\/$/.test(r.tabelogUrl), r.id + " 食べログURLの形式: " + r.tabelogUrl);
  if(r.tel) ok(/^0\d{1,4}-\d{1,4}-\d{3,4}$/.test(r.tel) && !r.tel.startsWith("050"), r.id + " 電話番号の形式: " + r.tel);
  if(r.address){
    ok(/^(杉並区|中野区)/.test(r.address), r.id + " 住所の形式: " + r.address);
    ok(decodeURIComponent(S.mapsUrl(r)).includes(r.address), r.id + " 地図検索に住所が入っていない");
  }
});
// 食べログURLが店ごとに一意(別の店に同じページを割り当てていない)
const seen = {};
S.RESTAURANTS.filter(r => r.tabelogUrl).forEach(r => { (seen[r.tabelogUrl] = seen[r.tabelogUrl] || []).push(r.id); });
Object.entries(seen).forEach(([u, ids]) => ok(ids.length === 1, "食べログURLが重複: " + u + " " + ids.join(",")));

console.log("検証 " + checks + " 件、失敗 " + failures + " 件");
process.exit(failures ? 1 : 0);
