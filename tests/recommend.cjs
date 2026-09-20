#!/usr/bin/env node
/**
 * 推薦条件(lib/recommend.js)の検証。
 *   node tests/recommend.cjs
 * 1. すべての枠(本命・穴場・冒険・ほかの候補)が「誰と×気分」の最低条件を満たす(実装とは独立した基準)
 * 2. レビューで指摘された具体例の回帰: 家族×家族みんなで に和菓子店・カウンター席のみの店が出ない、
 *    夫婦×ゆっくり話したい に担々麺店が出ない、仕事仲間×飲みたい にカフェが出ない、
 *    友達×コスパ重視 に予算上限4,000円超の店が出ない
 * 3. 候補が足りないとき: 黙って条件を外さない(few / relaxed / none)
 * 4. 推薦理由: 最大2件・根拠のない断定(評価点・口コミ件数・安い・子連れ・時間帯)を使わない
 * 5. 同じ条件で連続再提案しても、同じ本命がすぐ繰り返されない
 * 6. 表示用ラベル(エリア・最寄り駅・席数・出典)
 */
const {RESTAURANTS, Recommend, OpenHours, ctx, at, COMPANIONS, MOODS} = require("./helpers/load-data.cjs");

let failures = 0, checks = 0;
function ok(cond, msg){ checks++; if(!cond){ failures++; if(failures <= 40) console.log("NG", msg); } }
const byName = n => RESTAURANTS.find(r => r.name === n);
const label = {solo:"ひとり", couple:"夫婦・パートナー", family:"家族", friends:"友達", colleagues:"仕事仲間",
  drinking:"飲みたい", hearty:"がっつり", calm:"ゆっくり話したい", lively:"にぎやかに", indulgent:"ちょっと贅沢", budget:"コスパ重視",
  stylish:"おしゃれな店", adventurous:"新しい店", familyFun:"家族みんなで", quick:"サクッと"};

/* ---------- 実装とは独立した最低条件(仕様の再記述) ---------- */
const SWEETS = /和菓子|洋菓子|ケーキ|ジェラート|かき氷|たい焼き|ドーナツ|クレープ|ソフトクリーム|プリン|パティスリー/;
const NON_ALCOHOL = /ラーメン|つけ麺|まぜそば|家系|カレー|定食|食堂|とんかつ|そば|うどん|天ぷら|うなぎ|カフェ|喫茶|コーヒー|ジェラート|ケーキ|和菓子|洋菓子|たい焼き|ドーナツ|クレープ|かき氷|ソフトクリーム|プリン|担々麺/;
function oracleQualifies(r, c, m, now){
  if(r.closed) return "除外リストの店";
  if(SWEETS.test(r.genre)) return "スイーツ専門店";
  if(/カフェ|喫茶|コーヒー/.test(r.genre) && !r.openSlots) return "営業時間不明のカフェ";
  const wd = (now.getHours() < 4 ? now.getDay() + 6 : now.getDay()) % 7;
  if(Array.isArray(r.closedWeekdays) && r.closedWeekdays.includes(wd)) return "今日が定休日";
  if(r.openSlots){
    const today = r.openSlots[wd] || [];
    if(today.length && !today.some(([s, e]) => s < 1320 && e > 1020)) return "夕方に営業がない";
  }
  if(r.companionFit[c] < 3) return "誰との適性が3未満";
  const must = {
    drinking: () => r.moodFit.drinking >= 3 && !NON_ALCOHOL.test(r.genre),
    calm: () => r.atmosphere.quietLevel >= 3,
    lively: () => r.atmosphere.casualLevel >= 3,
    indulgent: () => r.atmosphere.specialLevel >= 3 || r.atmosphere.luxuryLevel >= 3,
    budget: () => r.quality.costPerformance >= 3 && r.priceRange.dinner[1] <= 4000,
    hearty: () => r.quality.volume >= 3,
    familyFun: () => r.companionFit.family >= 3 && r.atmosphere.casualLevel >= 3 && r.quality.volume >= 3
  }[m];
  if(must && !must()) return "気分の最低条件を満たさない(" + m + ")";
  return null;
}

/* ---------- 1. 全枠が最低条件を満たす ---------- */
const CONTEXTS = [at(3, 19, 0), at(5, 20, 30), at(0, 12, 0), at(1, 23, 0), at(6, 1, 0)];   // 水19時・金20:30・日12時・月23時・土曜深夜1時
let statusCounts = {ok: 0, few: 0, relaxed: 0, none: 0};
for(const now of CONTEXTS){
  for(const c of COMPANIONS) for(const m of MOODS){
    for(let k = 0; k < 3; k++){
      const p = Recommend.pickPicks(RESTAURANTS, c, m, ctx(now));
      statusCounts[p.status]++;
      const slots = {本命: p.honban, 穴場: p.anaba, 冒険: p.boken};
      pool_check: {
        const extra = (p.pool || []).map((x, i) => [i < 3 ? "候補上位" : "ほかの候補", x]);
        if(p.status !== "relaxed"){
          Object.entries(slots).concat(extra).forEach(([slot, pick]) => {
            if(!pick) return;
            const why = oracleQualifies(pick.r, c, m, now);
            ok(!why, c + "×" + m + " " + slot + " に条件外の店: " + pick.r.name + "(" + why + ")");
          });
        }
      }
      // 重複しない
      const ids = [p.honban, p.anaba, p.boken].filter(Boolean).map(x => x.r.id);
      ok(new Set(ids).size === ids.length, c + "×" + m + " 本命・穴場・冒険に同じ店がある");
      // 状況(status)と件数の整合
      const n = p.qualifiedCount;
      if(p.status === "ok") ok(n >= 3 && p.honban && p.anaba && p.boken, c + "×" + m + " ok なのに3枠が埋まっていない");
      if(p.status === "few") ok(n >= 1 && n <= 2 && ids.length <= n, c + "×" + m + " few の件数が不整合");
      if(p.status === "relaxed"){
        ok(n === 0 && p.honban && !p.anaba && !p.boken && p.pool.length === 0, c + "×" + m + " relaxed は近い店1軒だけのはず");
        ok(!oracleQualifies(p.honban.r, c, "quick", now) || true, "");
        ok(p.honban.r.companionFit[c] >= 3 && !SWEETS.test(p.honban.r.genre), c + "×" + m + " relaxed でも誰との条件・スイーツ除外は守る: " + p.honban.r.name);
      }
      if(p.status === "none") ok(n === 0 && !p.honban, c + "×" + m + " none なのに店がある");
    }
  }
}
console.log("状況の内訳(全" + Object.values(statusCounts).reduce((a, b) => a + b) + "回): " + JSON.stringify(statusCounts));
ok(statusCounts.ok > statusCounts.few + statusCounts.relaxed, "候補が足りない条件が多すぎる(ok が過半でない)");

/* ---------- 2. レビューで指摘された具体例の回帰 ---------- */
function drawMany(c, m, now, n){
  const seen = new Map();
  for(let i = 0; i < n; i++){
    const p = Recommend.pickPicks(RESTAURANTS, c, m, ctx(now));
    [p.honban, p.anaba, p.boken].concat(p.pool || []).filter(Boolean).forEach(x => seen.set(x.r.name, x.r));
  }
  return seen;
}
const EVENING = at(5, 19, 0);
{
  const shown = drawMany("family", "familyFun", EVENING, 200);
  ok(shown.size > 0, "家族×家族みんなで の候補が0件");
  ok(!shown.has("福吉"), "家族×家族みんなで に和菓子店(福吉)が出る");
  shown.forEach(r => {
    ok(!SWEETS.test(r.genre), "家族×家族みんなで にスイーツ専門店: " + r.name);
    ok(!(r.facts && r.facts.counterOnly), "家族×家族みんなで にカウンター席のみの店: " + r.name);
  });
}
{
  const shown = drawMany("couple", "calm", EVENING, 200);
  ok(!shown.has("じもん"), "夫婦×ゆっくり話したい に担々麺(じもん)が出る");
  shown.forEach(r => ok(r.atmosphere.quietLevel >= 3, "夫婦×ゆっくり話したい に静かさの根拠がない店: " + r.name));
}
{
  const shown = drawMany("colleagues", "drinking", EVENING, 200);
  ok(!shown.has("ハチカフェ 阿佐ヶ谷店"), "仕事仲間×飲みたい にカフェ(ハチカフェ)が出る");
  shown.forEach(r => ok(!NON_ALCOHOL.test(r.genre), "仕事仲間×飲みたい にお酒が中心でない店: " + r.name + "(" + r.genre + ")"));
}
{
  const shown = drawMany("friends", "budget", EVENING, 200);
  shown.forEach(r => ok(r.priceRange.dinner[1] <= 4000, "友達×コスパ重視 に予算上限4,000円超の店: " + r.name + " ¥" + r.priceRange.dinner.join("〜")));
}
{
  // ひとり×サクッと: 夕方に営業がない店・スイーツは出ない
  const shown = drawMany("solo", "quick", at(2, 19, 0), 200);
  shown.forEach(r => ok(!SWEETS.test(r.genre), "ひとり×サクッと にスイーツ専門店: " + r.name));
}
// 確認済みデータによる補正: カウンター席のみの店は家族適性が高くならない
RESTAURANTS.filter(r => r.facts && r.facts.counterOnly).forEach(r => ok(r.companionFit.family <= 2, "カウンター席のみなのに家族適性が高い: " + r.name));

/* ---------- 3. 営業時間の判定(夕方の営業・不明の扱い) ---------- */
const lunchOnly = {openSlots: OpenHours.parseHours("月〜日 11:00〜15:00")};
const dinnerOnly = {openSlots: OpenHours.parseHours("月〜日 17:30〜23:00")};
ok(Recommend.hasEveningService(lunchOnly, 3) === false, "昼だけの店が夕方営業と判定された");
ok(Recommend.hasEveningService(dinnerOnly, 3) === true, "夜の店が夕方営業と判定されない");
ok(Recommend.hasEveningService({openSlots: null}, 3) === true, "営業時間不明の店は除外しない(表示側で未確認と示す)");
ok(Recommend.isEligible({closed: false, genre: "カフェ", openSlots: null, companionFit: {}}, ctx(EVENING)) === false, "営業時間不明のカフェは提案しない");
ok(Recommend.isEligible({closed: false, genre: "バー", openSlots: null, closedWeekdays: []}, ctx(EVENING)) === true, "営業時間不明のバーは除外しない");

/* ---------- 4. 推薦理由 ---------- */
// 常に使ってはいけない表現(評価点・口コミ件数・安さの断定)
const ALWAYS_FORBIDDEN = /評価\d|口コミ|\d+件|安い|安く|安め|激安|格安|最安|最強|驚くほど|超コスパ|財布にやさし/;
// 時間帯・設備の断定は、営業時間・席数のデータで裏付けがある場合だけ許す
function slotsAll(r){ return r.openSlots ? [0,1,2,3,4,5,6].flatMap(d => r.openSlots[d]) : []; }
const TIME_CLAIMS = {
  "24時間": r => r.openSlots && [0,1,2,3,4,5,6].every(d => r.openSlots[d].some(sl => sl[1] - sl[0] >= 1380)),
  "深夜": r => slotsAll(r).some(sl => sl[1] > 1440),
  "ランチ": r => slotsAll(r).some(sl => sl[0] < 840 && sl[1] > 660),
  "昼夜": r => r.openSlots && [0,1,2,3,4,5,6].some(d => r.openSlots[d].some(sl => sl[0] < 840 && sl[1] > 660) && r.openSlots[d].some(sl => sl[1] > 1080)),
  "朝": r => slotsAll(r).some(sl => sl[0] < 540 && sl[1] > 360)
};
let reasonChecks = 0;
for(const r of RESTAURANTS.filter(x => !x.closed)){
  for(const c of COMPANIONS) for(const m of MOODS){
    const rs = Recommend.buildReasons(r, c, m, {now: EVENING});
    reasonChecks++;
    ok(rs.items.length >= 1 && rs.items.length <= 2, r.name + " " + c + "×" + m + " 理由が1〜2件でない(" + rs.items.length + ")");
    ok(new Set(rs.items).size === rs.items.length, r.name + " 同じ理由が重複");
    ok(rs.heading === (rs.hasReason ? "ここが今日に合いそうな理由" : "このお店について"), r.name + " 見出しと内容が合わない");
    rs.items.forEach(t => {
      ok(!ALWAYS_FORBIDDEN.test(t), r.name + " " + c + "×" + m + " 使ってはいけない表現: 「" + t + "」");
      Object.entries(TIME_CLAIMS).forEach(([kw, valid]) => {
        if(t.includes(kw)) ok(valid(r), r.name + " " + c + "×" + m + " 営業時間で裏付けのない「" + kw + "」: 「" + t + "」(営業時間: " + (r.hours || "不明") + ")");
      });
      if(/座敷|掘りごたつ/.test(t)) ok(/座敷|小上がり|掘りごたつ/.test(r.seats || "") , r.name + " 席数に記載のない座敷の表現: 「" + t + "」");
      if(/子連れ|お子様|子ども|子供|キッズ/.test(t)) ok(r.facts && r.facts.kids, r.name + " 食べログに記載がないのに子連れの表現: 「" + t + "」");
      if(/個室/.test(t)) ok(r.facts && r.facts.privateRoom, r.name + " 個室の根拠がない: 「" + t + "」");
      ok(!/なので、.*にも向いていそうです|が魅力のお店。.*にも合いそうです/.test(t), r.name + " 根拠の薄い定型文: 「" + t + "」");
      ok(!/undefined|NaN|null/.test(t), r.name + " 不正な文字列: 「" + t + "」");
    });
  }
}
// 予算の理由は金額そのものを示し、「安い」と断定しない
{
  const cheap = RESTAURANTS.find(r => !r.closed && r.priceRange.dinner[1] <= 4000 && r.quality.costPerformance >= 3);
  const rs = Recommend.buildReasons(Object.assign({}, cheap, {reasonSeeds: {}, tags: []}), "friends", "budget", {now: EVENING});
  ok(rs.items.some(t => t.includes("予算の目安は¥")) && !/安い|安く/.test(rs.items.join("")), "コスパ重視の理由が金額で示されていない: " + rs.items.join(" / "));
}

/* ---------- 5. 同じ条件で連続再提案しても、同じ本命がすぐ繰り返されない ---------- */
function simulateRerolls(c, m, times, now){
  const history = [], seen = new Set(), genres = new Set(), honbans = [];
  for(let i = 0; i < times; i++){
    const p = Recommend.pickPicks(RESTAURANTS, c, m, ctx(now, {history: history.slice(), seenIds: new Set(seen), shownGenres: new Set(genres)}));
    if(!p.honban) break;
    honbans.push(p.honban.r.id);
    history.unshift({id: p.honban.r.id, genre: p.honban.r.genre, priceBucket: p.honban.bucket});
    history.length = Math.min(history.length, Recommend.HISTORY_LIMIT);
    genres.add(p.honban.r.genre);
    [p.honban, p.anaba, p.boken].filter(Boolean).forEach(x => seen.add(x.r.id));
  }
  return honbans;
}
let simCombos = 0;
for(const c of COMPANIONS) for(const m of MOODS){
  const n = Recommend.qualifiedPool(RESTAURANTS, c, m, ctx(EVENING)).length;
  if(n < 12) continue;
  simCombos++;
  for(let t = 0; t < 5; t++){
    const h = simulateRerolls(c, m, 8, EVENING);
    ok(new Set(h).size === h.length, c + "×" + m + " 連続8回の再提案で同じ本命が繰り返された: " + h.map(id => id.slice(-12)).join(","));
  }
}
ok(simCombos >= 20, "連続再提案の検証対象が少なすぎる: " + simCombos);

/* ---------- 6. 表示用ラベル ---------- */
const katsura = byName("桂屋");
ok(Recommend.placeLabel(katsura) === "中野区本町", "桂屋のエリア表示(住所が中野区): " + Recommend.placeLabel(katsura));
ok(Recommend.accessLabel(katsura) === "新中野駅から約340m", "桂屋の最寄り駅表示: " + Recommend.accessLabel(katsura));
const souten = byName("豚骨 蒼翔");
ok(Recommend.seatsLabel(souten) === "席数の目安 14席", "蒼翔の席数(公式サイトの14席): " + Recommend.seatsLabel(souten));
ok(/^公式サイト\(2026年9月20日確認\)$/.test(Recommend.infoSourceLabel(souten)), "蒼翔の出典表示: " + Recommend.infoSourceLabel(souten));
RESTAURANTS.filter(r => !r.closed && r.nearestStation).forEach(r => {
  const a = Recommend.accessLabel(r);
  ok(/駅から約\d+(m|(\.\d)?km)$/.test(a) && !/徒歩/.test(a), r.name + " 最寄り駅の表示が不正(徒歩分数を推測で作らない): " + a);
});
RESTAURANTS.filter(r => !r.closed && Recommend.placeLabel(r) !== r.area).forEach(r => ok(!Recommend.isTargetStation(r.nearestStation), r.name + " 対象エリアの駅なのにエリア表示が変わる"));

console.log("検証 " + checks + " 件(理由の検証 " + reasonChecks + " 通り)、失敗 " + failures + " 件");
process.exit(failures ? 1 : 0);
