#!/usr/bin/env node
/**
 * 店舗データの整合性(オフラインで確認できる範囲)。
 *   node tests/data-integrity.cjs
 * 2026-09-20 の全店監査で見つかった不整合の種類を、再発しないよう恒常的に検査する。
 *   - 時間帯(24時間・深夜・ランチ・昼夜・朝)、設備(座敷・掘りごたつ・個室)、子ども向けの断定が、
 *     営業時間・席数・食べログの設備情報で裏付けられている
 *   - ジャンル・タグに評価点・口コミ件数が入っていない
 *   - 最寄り駅・距離が全店にあり、駅名は対象エリアの駅(例外は明示)。距離は食べログ掲載の直線距離
 *   - 食べログURLの重複がない。電話番号の重複は、確認済みの例外だけ
 *   - 営業情報の出典・最終確認日が入っている。営業時間が確認できない店は、その旨の注意書きを持つ
 *   - 個別に訂正した店(ともちん・蒼翔・桂屋・Kan-Kan・五郎左・ピアット・音鶏家・肉一)の回帰
 * 食べログとの席数の食い違いなど、ネットワークが必要な確認は scripts/check-store-status.js と手作業で行う。
 */
const {RESTAURANTS, STORE_INFO, Recommend} = require("./helpers/load-data.cjs");

let failures = 0, checks = 0;
function ok(cond, msg){ checks++; if(!cond){ failures++; console.log("NG", msg); } }
const active = RESTAURANTS.filter(r => !r.closed);
const by = n => RESTAURANTS.find(r => r.name === n);
const idOf = id => RESTAURANTS.find(r => r.id === id);

// ---- 基本 ----
ok(new Set(RESTAURANTS.map(r => r.id)).size === RESTAURANTS.length, "店舗idが重複している");
active.forEach(r => {
  const p = r.priceRange && r.priceRange.dinner;
  ok(Array.isArray(p) && p[0] > 0 && p[0] <= p[1], r.name + " 価格帯が不正: " + JSON.stringify(p));
  ok(["solo", "couple", "family", "friends", "colleagues"].every(k => r.companionFit[k] >= 0 && r.companionFit[k] <= 5), r.name + " companionFit の範囲外");
});

// ---- 断定と裏付け(データ内の店ごとの文・タグ・ジャンル) ----
const CLAIM_KEYS = /24時間|深夜|ランチ|昼夜|朝|座敷|掘りごたつ|個室|子連れ|お子様|子ども|子供|キッズ/;
active.forEach(r => {
  const texts = [["ジャンル", r.genre]]
    .concat((r.tags || []).map(t => ["タグ", t]))
    .concat(Object.entries(r.reasonSeeds || {}).flatMap(([k, v]) => v.map(t => ["理由(" + k + ")", t])));
  texts.forEach(([src, t]) => {
    // 「ランチも安い」のような安さの断定は、別の検査(表示前に除外)で扱う
    if(CLAIM_KEYS.test(t) && !Recommend.ABSOLUTE_CHEAP_RE.test(t)) ok(Recommend.claimAllowed(r, t), r.name + " 根拠のない断定 [" + src + "]「" + t + "」(営業時間: " + (r.hours || "不明") + ")");
  });
  (r.tags || []).forEach(t => ok(!Recommend.SCORE_CLAIM_RE.test(t), r.name + " タグに評価点・口コミ件数: 「" + t + "」"));
  ok(!/24時間/.test(r.genre) || Recommend.claimAllowed(r, r.genre), r.name + " ジャンルに営業時間で確認できない「24時間」: " + r.genre);
});

// ---- 最寄り駅・距離・アクセス ----
const ALLOWED_OUTSIDE = {"桂屋": "新中野駅から344m。中野区本町で、エリア表示は住所の区・町で出す", "御食事 飯田": "方南町駅から796m。杉並区堀ノ内"};
active.filter(r => r.tabelogUrl).forEach(r => {
  ok(!!r.nearestStation && r.stationMeters > 0, r.name + " 最寄り駅・距離がない");
  if(r.nearestStation){
    ok(r.stationMeters <= 1000, r.name + " 駅から1km超: " + r.stationMeters + "m");
    ok(Recommend.isTargetStation(r.nearestStation) || ALLOWED_OUTSIDE[r.name], r.name + " 対象エリア外の駅(" + r.nearestStation + ")。意図した例外なら ALLOWED_OUTSIDE に理由を書く");
  }
});

// ---- 食べログURL・電話・住所の重複 ----
const tUrl = {};
active.forEach(r => { if(r.tabelogUrl) (tUrl[r.tabelogUrl] = tUrl[r.tabelogUrl] || []).push(r.name); });
Object.entries(tUrl).forEach(([u, names]) => ok(names.length === 1, "食べログURLが複数店で重複: " + u + " " + names.join(" / ")));
const tel = {};
active.forEach(r => { if(r.tel) (tel[r.tel] = tel[r.tel] || []).push(r.name); });
const TEL_SHARED_OK = {"03-5913-8303": "アガリコ餃子楼 阿佐ヶ谷店 と マミーメンチ(食べログ上は別ページ・別店舗。同じ番号が掲載されている)"};
Object.entries(tel).forEach(([t, names]) => ok(names.length === 1 || (TEL_SHARED_OK[t] && names.length === 2), "電話番号が複数店で重複: " + t + " " + names.join(" / ")));
active.forEach(r => { if(r.tel) ok(/^0\d{1,4}-\d{1,4}-\d{3,4}$/.test(r.tel), r.name + " 電話番号の形式: " + r.tel); });

// ---- 営業情報の出典・最終確認日・注意書き ----
active.filter(r => r.hours).forEach(r => {
  ok(r.infoSrc && ["official", "tabelog", "web", "mixed"].includes(r.infoSrc.type), r.name + " 営業時間の出典がない");
  ok(r.infoSrc && /^\d{4}-\d{2}-\d{2}$/.test(r.infoSrc.checked), r.name + " 最終確認日がない");
});
active.filter(r => r.infoNote).forEach(r => ok(r.infoNote.length >= 20 && r.infoSrc, r.name + " 注意書きが短すぎる/出典がない"));
Object.entries(STORE_INFO).forEach(([id, i]) => {
  if(i.src) ok(["official", "tabelog", "web"].includes(i.src), id + " src が不正: " + i.src);
  if(i.checked) ok(/^\d{4}-\d{2}-\d{2}$/.test(i.checked), id + " checked の形式: " + i.checked);
  if(i.src === "official") ok(/^https:\/\//.test(i.srcUrl || ""), id + " 公式サイト出典に srcUrl がない");
});

// ---- 個別に訂正した店の回帰(2026-09-20) ----
{
  const t = by("高円寺ともちんラーメン");
  ok(!/24時間/.test(t.genre + (t.tags || []).join("") + JSON.stringify(t.reasonSeeds)), "ともちん: 24時間営業の断定が残っている");
  ok(!t.hours && !t.openSlots, "ともちん: 営業時間は確認できていないので設定しない");
  ok(t.infoNote && /営業時間/.test(t.infoNote) && /bantam26/.test(t.infoNote), "ともちん: 営業時間未確認の注意書きと公式Xの案内がない");
  ok(t.seats === "14席" && Recommend.seatsLabel(t) === "席数の目安 14席", "ともちん: 席数14席");
}
{
  const s = by("豚骨 蒼翔");
  ok(/^14席/.test(s.seats) && Recommend.seatsTotal(s) === 14, "蒼翔: 席数は公式サイトの14席(食べログの11席は誤記)");
  ok(s.infoSrc && s.infoSrc.type === "official" && s.infoSrc.checked === "2026-09-20", "蒼翔: 出典は公式サイト");
  ok(s.infoNote && /火曜/.test(s.infoNote), "蒼翔: 定休日の食い違いの注意書き");
  ok(Array.isArray(s.closedWeekdays) && s.closedWeekdays.includes(2), "蒼翔: 定休日の食い違いがあるため火曜は念のため提案しない");
}
{
  const k = by("桂屋");
  ok(Recommend.placeLabel(k) === "中野区本町" && Recommend.accessLabel(k) === "新中野駅から約340m", "桂屋: エリア表示と最寄り駅");
  ok(/中野区本町/.test(k.address), "桂屋: 住所が中野区本町");
}
{
  const c = by("curry Kan-Kan");
  ok(!c.hours && c.infoNote && /間借り/.test(c.infoNote), "Kan-Kan: 間借り営業で営業時間未確認の注意書き");
}
{
  const g = by("めんさいぼう 五郎左");
  const all = JSON.stringify(g.tags) + JSON.stringify(g.reasonSeeds);
  ok(!/掘りごたつ|座敷|子連れ|子ども/.test(all), "五郎左: カウンター10席のみなのに、座敷・掘りごたつ・子連れの記述");
  ok(g.facts && g.facts.counterOnly && g.companionFit.family <= 2, "五郎左: カウンター席のみは家族向けにしない");
}
["Dining Piatto", "音鶏家 阿佐ヶ谷店"].forEach(n => {
  const r = by(n);
  ok(!/ランチ/.test((r.tags || []).join("") + JSON.stringify(r.reasonSeeds)), n + ": 夜のみの営業なのにランチの記述");
});
{
  const n = by("肉問屋直営 焼肉 肉一 高円寺店");
  ok(!/座敷|子ども|子連れ/.test((n.tags || []).join("") + JSON.stringify(n.reasonSeeds)), "肉一: 確認できない座敷・子連れの記述");
}
ok(by("Bar tail") && !/テラス/.test(JSON.stringify(by("Bar tail").reasonSeeds)), "Bar tail: 席数に記載のないテラスの記述");

console.log("検証 " + checks + " 件、失敗 " + failures + " 件");
process.exit(failures ? 1 : 0);
