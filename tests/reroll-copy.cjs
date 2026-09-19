#!/usr/bin/env node
/**
 * 「別のお店をひらめく」後の、ひらりのセリフ選び(hirariRerollCopy)の検証。
 *   node tests/reroll-copy.cjs
 * - どの店のジャンルでも、空でない短いセリフが返る(スマホ幅で1行に収まる長さ)
 * - 直近3回と同じセリフは出ない
 * - ジャンル別セリフの表のキーは、genreVisual() が返す分類と対応している
 * - ジャンルに合うセリフと、汎用のセリフが、どちらも出る
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
const from = html.indexOf("const HIRARI_REROLL_GENERIC = [");
const to = html.indexOf("function renderResult(opts){");
if(from === -1 || to === -1) throw new Error("ひらりの再提案セリフの範囲が見つかりません");
const block = html.slice(from, to);
const genreVisualSrc = extractFunction(html, "genreVisual");

const S = new Function(data + "\n" + genreVisualSrc + "\n" + block + "\n" +
  "return {RESTAURANTS, GENERIC: HIRARI_REROLL_GENERIC, BY_GENRE: HIRARI_REROLL_BY_GENRE, genreVisual, hirariRerollCopy, reset(){ recentRerollLines = []; }};")();

let failures = 0, checks = 0;
function ok(cond, msg){ checks++; if(!cond){ failures++; console.log("NG", msg); } }
const len = t => [...t].length;

const all = [...S.GENERIC, ...Object.values(S.BY_GENRE).flat()];
ok(new Set(all).size === all.length, "セリフに重複がある");
ok(S.GENERIC.length >= 5, "汎用のセリフが少ない: " + S.GENERIC.length);
all.forEach(t => ok(len(t) <= 16 && len(t) >= 5, "セリフの長さが範囲外(5〜16字): " + t + " (" + len(t) + "字)"));
all.forEach(t => ok(!/undefined|null|\$\{/.test(t), "セリフに不正な文字列: " + t));

// 表のキーが genreVisual の分類に存在する
const kanjiInRules = new Set([...html.slice(html.indexOf("function genreVisual"), html.indexOf("function genreVisual") + 3000).matchAll(/kanji:"(.)"/g)].map(m => m[1]));
Object.keys(S.BY_GENRE).forEach(k => ok(kanjiInRules.has(k), "ジャンル別セリフのキー「" + k + "」が genreVisual に存在しない"));

// 全店のジャンルで、セリフが返る
const stores = S.RESTAURANTS.filter(r => !r.closed);
stores.forEach(r => { S.reset(); const t = S.hirariRerollCopy(r); ok(typeof t === "string" && len(t) >= 5, r.id + " でセリフが返らない"); });

// 直近3回と同じセリフは出ない(ジャンルが偏っていても)
for(const genre of ["焼肉", "バー", "ラーメン", "カフェ", "不明なジャンル", "食堂"]){
  S.reset();
  const seq = [];
  for(let i = 0; i < 400; i++){
    const t = S.hirariRerollCopy({genre});
    ok(!seq.slice(-3).includes(t), "「" + genre + "」で直近3回と同じセリフ: " + t);
    seq.push(t);
  }
}

// ジャンルに合うセリフと、汎用のセリフの両方が出る(焼肉)
S.reset();
const seen = new Set();
for(let i = 0; i < 600; i++) seen.add(S.hirariRerollCopy({genre: "焼肉"}));
ok([...seen].some(t => S.BY_GENRE["肉"].includes(t)), "焼肉なのに、ジャンル別のセリフが出ない");
ok([...seen].some(t => S.GENERIC.includes(t)), "焼肉なのに、汎用のセリフが出ない");
ok([...seen].every(t => S.BY_GENRE["肉"].includes(t) || S.GENERIC.includes(t)), "焼肉に、他ジャンルのセリフが混ざっている");
// ジャンル別の表が無いジャンルは、汎用だけ
S.reset();
const generic = new Set();
for(let i = 0; i < 200; i++) generic.add(S.hirariRerollCopy({genre: "不明なジャンル"}));
ok([...generic].every(t => S.GENERIC.includes(t)), "対応表のないジャンルで、汎用以外のセリフが出た");

console.log("検証 " + checks + " 件、失敗 " + failures + " 件");
process.exit(failures ? 1 : 0);
