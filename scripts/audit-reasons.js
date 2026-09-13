#!/usr/bin/env node
/**
 * 推薦理由(buildReasons)の使い回しを監査するスクリプト。
 *
 * 全店舗 × 全「誰と×気分」パターン(5×10=50通り)で理由を生成し、
 *   1. 同一文の完全一致がどれだけ多くの店舗で使われているか
 *   2. 「誰と」の食い違い(例: familyを選んだのに「ふたりで」等の
 *      別の誰と表現が混ざっていないか)
 * を集計する。データやbuildReasons()のロジックを変更した後、
 *
 *   node scripts/audit-reasons.js
 *
 * で実行する。index.html・data/restaurants.js は一切書き換えない。
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const INDEX_FILE = path.join(ROOT, "index.html");
const RESTAURANTS_FILE = path.join(ROOT, "data", "restaurants.js");

const COMPANIONS = [
  {id:"solo", label:"ひとり", particle:"ひとりで"},
  {id:"couple", label:"夫婦・パートナー(デート)", particle:"夫婦で"},
  {id:"family", label:"家族", particle:"家族で"},
  {id:"friends", label:"友達", particle:"友達と"},
  {id:"colleagues", label:"仕事仲間", particle:"仲間と"}
];
const MOODS = [
  {id:"drinking", label:"飲みたい"}, {id:"hearty", label:"がっつり"},
  {id:"calm", label:"ゆっくり話したい"}, {id:"lively", label:"にぎやかに"},
  {id:"indulgent", label:"ちょっと贅沢"}, {id:"budget", label:"コスパ重視"},
  {id:"stylish", label:"おしゃれな店"}, {id:"adventurous", label:"新しい店"},
  {id:"familyFun", label:"家族みんなで"}, {id:"quick", label:"サクッと"}
];

function extractFunction(source, name){
  const startIdx = source.indexOf("function " + name + "(");
  if(startIdx === -1) throw new Error(name + " が index.html に見つかりません");
  let depth = 0, i = source.indexOf("{", startIdx);
  const bodyStart = i;
  for(; i < source.length; i++){
    if(source[i] === "{") depth++;
    if(source[i] === "}"){ depth--; if(depth === 0) break; }
  }
  return source.slice(startIdx, i + 1);
}

function main(){
  const dataJs = fs.readFileSync(RESTAURANTS_FILE, "utf8");
  const indexHtml = fs.readFileSync(INDEX_FILE, "utf8");

  const buildReasonsSrc = extractFunction(indexHtml, "buildReasons");
  const factCandidatesSrc = extractFunction(indexHtml, "factCandidates");
  const factSentenceSrc = extractFunction(indexHtml, "factSentence");
  const priceLabelSrc = extractFunction(indexHtml, "priceLabel");
  const moodDescMatch = indexHtml.match(/const MOOD_DESCRIPTOR = \{[\s\S]*?\n\};/);
  if(!moodDescMatch) throw new Error("MOOD_DESCRIPTOR が見つかりません");

  const harness = `
    ${dataJs}
    const COMPANIONS = ${JSON.stringify(COMPANIONS)};
    ${moodDescMatch[0]}
    ${priceLabelSrc}
    ${factCandidatesSrc}
    ${factSentenceSrc}
    ${buildReasonsSrc}

    const companionIds = ${JSON.stringify(COMPANIONS.map(c=>c.id))};
    const moodIds = ${JSON.stringify(MOODS.map(m=>m.id))};
    const freq = {};
    let totalSlots = 0;
    const perStoreAllUnique = [];
    // 「誰と」不整合チェック用: 他の誰とを示す語
    const OTHER_COMPANION_WORDS = {
      solo: ["夫婦で","家族で","友達と","仲間と","みんなで","大人数"],
      couple: ["ひとりで","家族で","友達と","仲間と","みんなで"],
      family: ["ひとりで","夫婦で","友達と","仲間と"],
      friends: ["ひとりで","夫婦で","家族で"],
      colleagues: ["ひとりで","夫婦で","家族で"]
    };
    let mismatchCount = 0;
    const mismatchExamples = [];
    const mismatchByStore = {};

    companionIds.forEach(c => {
      moodIds.forEach(m => {
        RESTAURANTS.forEach(r => {
          const out = buildReasons(r, c, m);
          totalSlots += out.length;
          let allUnique = true;
          out.forEach(s => {
            freq[s] = (freq[s] || 0) + 1;
          });
          out.forEach(s => {
            (OTHER_COMPANION_WORDS[c] || []).forEach(word => {
              if(s.includes(word)){
                mismatchCount++;
                if(mismatchExamples.length < 10){
                  mismatchExamples.push({store:r.name, companion:c, mood:m, sentence:s});
                }
                mismatchByStore[r.id] = mismatchByStore[r.id] || {name:r.name, sentences:new Set()};
                mismatchByStore[r.id].sentences.add(s);
              }
            });
          });
        });
      });
    });

    const sorted = Object.entries(freq).sort((a,b)=>b[1]-a[1]);
    const overShared = sorted.filter(([,n]) => n >= 15);

    console.log(JSON.stringify({
      totalStores: RESTAURANTS.length,
      totalCombos: companionIds.length * moodIds.length,
      totalSlots,
      top15: sorted.slice(0,15),
      overSharedCount: overShared.length,
      overSharedSlotShare: overShared.reduce((a,[,n])=>a+n,0) / totalSlots,
      mismatchCount,
      mismatchExamples,
      mismatchByStore: Object.fromEntries(
        Object.entries(mismatchByStore).map(([id,v]) => [id, {name:v.name, sentences:[...v.sentences]}])
      )
    }));
  `;

  const result = JSON.parse(
    require("child_process").execSync("node -e " + JSON.stringify("eval(" + JSON.stringify(harness) + ")"), {maxBuffer: 1024*1024*32}).toString()
  );

  console.log("=== 推薦理由 監査レポート ===");
  console.log("店舗数:", result.totalStores, " / パターン数:", result.totalCombos, " / 生成スロット数:", result.totalSlots);
  console.log("");
  console.log("15店舗以上で使われている文(=使い回し疑い):", result.overSharedCount, "種類");
  console.log("  → それらが全スロットに占める割合:", (result.overSharedSlotShare*100).toFixed(1) + "%");
  console.log("");
  console.log("最も多く使われている文トップ15:");
  result.top15.forEach(([s,n]) => console.log("  " + n + "回  " + JSON.stringify(s)));
  console.log("");
  console.log("「誰と」不整合(例: familyなのに「ふたりで」等)の検出件数:", result.mismatchCount);
  const storeIds = Object.keys(result.mismatchByStore);
  console.log("  該当する店舗数(ユニーク):", storeIds.length);
  storeIds.forEach(id => {
    const v = result.mismatchByStore[id];
    console.log("   - [" + id + "] " + v.name);
    v.sentences.forEach(s => console.log("       " + s));
  });
}

main();
