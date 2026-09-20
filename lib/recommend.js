/* =========================================================
   お店の推薦(絞り込み・採点・本命/穴場/冒険の選定・推薦理由)。
   画面(index.html)から切り離した純粋な関数群。テストは tests/recommend.cjs。

   考え方
   - 「誰と」「気分」ごとの最低条件(Must)を満たす店だけを、本命・穴場・冒険・ほかの候補の
     すべての枠に出す。「冒険」は最低条件を外すことではなく、条件を満たす候補の中で
     意外なジャンルを選ぶこと。
   - 条件を満たす店が足りないときは、黙って条件を外さない。足りない件数を返し、
     画面がそれを利用者に伝える。0件のときだけ、誰とMustを保った近い店を1軒だけ示す(relaxed)。
   - 夜の外食の提案なので、スイーツ専門店は対象外。カフェ・喫茶は、夕方以降の営業が
     営業時間データで確認できる店だけ。営業時間が不明な店(バー・飲食店)は除外しないが、
     画面で「営業時間未確認」と示す。
   - 推薦理由は、店ごとに書いた reasonSeeds と、データにある事実(予算・営業時間・駅からの距離・席数・
     設備)だけを使う。評価点・口コミ件数・根拠のない定型文は使わない。理由は最大2件、水増ししない。
   - ブラウザでは window.Recommend、Nodeでは module.exports で使う。OpenHours(lib/open-hours.js)が必要。
   ========================================================= */
(function(root){
  var OH = (typeof module !== "undefined" && module.exports && typeof require === "function")
    ? require("./open-hours.js") : root.OpenHours;

  /* ---------- 定数・分類 ---------- */
  var BUDGET_CAP = 4000;            // 「コスパ重視」の予算の上限(一人あたり夕食の上限価格)
  var MIN_QUALIFIED_FOR_FULL = 3;   // 本命・穴場・冒険の3枠を埋めるのに必要な件数
  var HISTORY_LIMIT = 8;

  var SWEETS_RE = /和菓子|洋菓子|ケーキ|ジェラート|かき氷|たい焼き|ドーナツ|クレープ|ソフトクリーム|プリン|パティスリー/;
  var CAFE_RE = /カフェ|喫茶|コーヒー/;
  var NON_ALCOHOL_GENRE_RE = /ラーメン|つけ麺|まぜそば|家系|カレー|定食|食堂|とんかつ|そば|うどん|天ぷら|うなぎ|カフェ|喫茶|コーヒー|ジェラート|ケーキ|和菓子|洋菓子|たい焼き|ドーナツ|クレープ|かき氷|ソフトクリーム|プリン|担々麺/;
  var TARGET_STATIONS = ["阿佐ヶ谷", "阿佐ケ谷", "南阿佐ヶ谷", "南阿佐ケ谷", "高円寺", "東高円寺", "新高円寺"];

  function storeKind(genre){
    if(SWEETS_RE.test(genre)) return "sweets";
    if(CAFE_RE.test(genre)) return "cafe";
    return "meal";
  }

  /* ---------- 採点の重み(子連れ前提の項目は使わない) ---------- */
  var COMPANION_WEIGHTS = {
    solo:{extra:[["atmosphere.casualLevel",0.5]]},
    couple:{extra:[["atmosphere.quietLevel",1],["audienceFit.dateFriendly",1]]},
    family:{extra:[["audienceFit.largeGroupFriendly",1],["quality.volume",0.5]]},
    friends:{extra:[["atmosphere.casualLevel",1],["audienceFit.largeGroupFriendly",0.5]]},
    colleagues:{extra:[["atmosphere.casualLevel",0.5],["audienceFit.largeGroupFriendly",0.5]]}
  };
  var MOOD_WEIGHTS = {
    hearty:{extra:[["quality.volume",1.5],["quality.costPerformance",1]]},
    drinking:{extra:[["atmosphere.casualLevel",1]]},
    indulgent:{extra:[["atmosphere.specialLevel",1.5],["atmosphere.luxuryLevel",1],["quality.foodQuality",1]]},
    budget:{extra:[["quality.costPerformance",1.5]]},
    stylish:{extra:[["atmosphere.specialLevel",1]]},
    calm:{extra:[["atmosphere.quietLevel",1.5]]},
    lively:{extra:[["atmosphere.casualLevel",1.5]]},
    adventurous:{extra:[["atmosphere.specialLevel",0.5]]},
    familyFun:{extra:[["audienceFit.largeGroupFriendly",1],["quality.volume",1]]},
    quick:{extra:[["atmosphere.casualLevel",1],["quality.costPerformance",0.5]]}
  };

  /* ---------- 最低条件 ---------- */
  var MOOD_MUST = {
    drinking: function(r){ return r.moodFit.drinking >= 3 && !NON_ALCOHOL_GENRE_RE.test(r.genre); },
    calm: function(r){ return r.atmosphere.quietLevel >= 3; },
    lively: function(r){ return r.atmosphere.casualLevel >= 3; },
    indulgent: function(r){ return r.atmosphere.specialLevel >= 3 || r.atmosphere.luxuryLevel >= 3; },
    // 「コスパがよい」と「安い」は別。ただし一人あたりの上限は BUDGET_CAP 円までとする
    budget: function(r){ return r.quality.costPerformance >= 3 && r.priceRange.dinner[1] <= BUDGET_CAP; },
    hearty: function(r){ return r.quality.volume >= 3; },
    // 家族利用を子連れと決めつけない。家族で入りやすく、気軽で、量がしっかりしている店
    familyFun: function(r){ return r.companionFit.family >= 3 && r.atmosphere.casualLevel >= 3 && r.quality.volume >= 3; }
    // stylish / adventurous / quick は Must なし(採点のみ)
  };

  /* ---------- 営業状況 ---------- */
  function todayWeekday(now){
    var d = now || new Date();
    return (d.getHours() < 4 ? d.getDay() + 6 : d.getDay()) % 7;
  }
  function isClosedToday(r, weekday){
    if(r.closed) return true;
    return Array.isArray(r.closedWeekdays) && r.closedWeekdays.indexOf(weekday) !== -1;
  }
  function isFinishedNow(r, now){
    var st = OH.statusAt(r.openSlots, now);
    return !!st && st.state === "finished";
  }
  function isUnavailable(r, now){
    return isClosedToday(r, todayWeekday(now)) || isFinishedNow(r, now);
  }
  /* その日の夕方(17〜22時)に営業があるか。営業時間が不明・その日の枠が読み取れない店は判定しない(true) */
  function hasEveningService(r, weekday){
    if(!r.openSlots) return true;
    var today = r.openSlots[weekday] || [];
    if(!today.length) return true;
    return today.some(function(sl){ return sl[0] < 1320 && sl[1] > 1020; });
  }
  function hoursUnknown(r){ return !r.openSlots; }

  /* ---------- 判定・採点 ---------- */
  function getPath(obj, path){ return path.split(".").reduce(function(o, k){ return o ? o[k] : undefined; }, obj); }
  function priceBucket(r){
    var avg = (r.priceRange.dinner[0] + r.priceRange.dinner[1]) / 2;
    if(avg < 1500) return 1;
    if(avg < 3500) return 2;
    if(avg < 6000) return 3;
    return 4;
  }
  function priceLabel(r){
    var p = r.priceRange.dinner;
    return "¥" + p[0].toLocaleString("en-US") + "〜" + p[1].toLocaleString("en-US");
  }
  function scoreRestaurant(r, companionId, moodId){
    var score = 3 * r.companionFit[companionId];
    COMPANION_WEIGHTS[companionId].extra.forEach(function(e){ score += e[1] * getPath(r, e[0]); });
    score += 3 * r.moodFit[moodId];
    MOOD_WEIGHTS[moodId].extra.forEach(function(e){ score += e[1] * getPath(r, e[0]); });
    return score;
  }

  /* 今の日時で提案してよい店か(誰と・気分は見ない共通条件) */
  function isEligible(r, ctx){
    if(r.closed || isUnavailable(r, ctx.now)) return false;
    var kind = storeKind(r.genre);
    if(kind === "sweets") return false;
    if(!hasEveningService(r, todayWeekday(ctx.now))) return false;
    if(kind === "cafe" && !r.openSlots) return false;   // カフェは夕方以降の営業が確認できる店だけ
    return true;
  }
  function meetsCompanion(r, companionId){ return r.companionFit[companionId] >= 3; }
  function meetsMood(r, moodId){ var f = MOOD_MUST[moodId]; return !f || f(r); }
  function qualifies(r, companionId, moodId, ctx){
    return isEligible(r, ctx) && meetsCompanion(r, companionId) && meetsMood(r, moodId);
  }

  function rankOf(list, companionId, moodId, ctx){
    var history = ctx.history || [];
    var seen = ctx.seenIds || new Set();
    var shownGenres = ctx.shownGenres || new Set();
    var rnd = ctx.random || Math.random;
    return list.map(function(r){
      var s = scoreRestaurant(r, companionId, moodId);
      var bucket = priceBucket(r);
      history.slice(0, 3).forEach(function(h, i){
        var penalty = i === 0 ? 1 : 0.5;
        if(h.genre === r.genre) s -= 3 * penalty;
        if(h.priceBucket === bucket) s -= 1.5 * penalty;
      });
      if(shownGenres.has(r.genre) && !history.some(function(h){ return h.genre === r.genre; })) s -= 1;
      if(seen.has(r.id)) s -= 6;             // このセッションで、すでに見せた店は後ろへ
      if(hoursUnknown(r)) s -= 3;            // 営業時間が確認できていない店は、確認できた店より後ろへ
      s += rnd() * 0.01;                      // 同点の並びを固定しない
      return {r: r, score: s, bucket: bucket};
    }).sort(function(a, b){ return b.score - a.score; });
  }

  /* 条件を満たす候補(スコア降順)。足りない場合は満たす分だけ返す(条件を黙って外さない) */
  function qualifiedPool(restaurants, companionId, moodId, ctx){
    var list = restaurants.filter(function(r){ return qualifies(r, companionId, moodId, ctx); });
    return rankOf(list, companionId, moodId, ctx);
  }
  /* 0件のときだけ使う近い店(誰とMustと共通条件は守り、気分Mustだけ外す)。画面で必ず理由を説明する */
  function relaxedPool(restaurants, companionId, moodId, ctx){
    var list = restaurants.filter(function(r){ return isEligible(r, ctx) && meetsCompanion(r, companionId); });
    return rankOf(list, companionId, moodId, ctx);
  }

  function weightedPick(pool, topN, rnd){
    rnd = rnd || Math.random;
    var top = pool.slice(0, Math.min(topN, pool.length));
    if(!top.length) return null;
    var min = Math.min.apply(null, top.map(function(x){ return x.score; }));
    var w = top.map(function(x){ return Math.max(x.score - min + 0.5, 0.1); });
    var total = w.reduce(function(a, b){ return a + b; }, 0);
    var x = rnd() * total;
    for(var i = 0; i < top.length; i++){ x -= w[i]; if(x <= 0) return top[i]; }
    return top[0];
  }

  /* 冒険: 条件を満たす候補の中で、まだ出ていないジャンル・珍しいジャンルを優先する */
  function pickAdventure(pool, usedIds, usedGenres, rnd){
    rnd = rnd || Math.random;
    var cand = pool.filter(function(x){ return !usedIds.has(x.r.id); });
    if(!cand.length) return null;
    var count = {};
    pool.forEach(function(x){ count[x.r.genre] = (count[x.r.genre] || 0) + 1; });
    var top3 = Math.min(3, pool.length - 1);
    var weights = cand.map(function(x){
      var rare = 1 / count[x.r.genre];
      var fresh = usedGenres.has(x.r.genre) ? 0.15 : 1;
      var zone = pool.indexOf(x) >= top3 ? 1 : 0.4;   // 上位(本命ゾーン)は避けめに
      return rare * fresh * zone;
    });
    var total = weights.reduce(function(a, b){ return a + b; }, 0);
    var v = rnd() * total;
    for(var i = 0; i < cand.length; i++){ v -= weights[i]; if(v <= 0) return cand[i]; }
    return cand[cand.length - 1];
  }

  /* 本命・穴場・冒険。すべて qualifiedPool の中から選ぶ。
     戻り値 status: "ok"(3件以上) / "few"(1〜2件) / "relaxed"(0件のため近い店を1軒) / "none" */
  function pickPicks(restaurants, companionId, moodId, ctx){
    var rnd = ctx.random || Math.random;
    var pool = qualifiedPool(restaurants, companionId, moodId, ctx);
    if(!pool.length){
      var rel = relaxedPool(restaurants, companionId, moodId, ctx);
      if(!rel.length) return {status: "none", qualifiedCount: 0, pool: [], honban: null, anaba: null, boken: null};
      var one = weightedPick(rel, 5, rnd);
      return {status: "relaxed", qualifiedCount: 0, pool: [], honban: one, anaba: null, boken: null};
    }
    var usedIds = new Set(), usedGenres = new Set();
    function take(pick){ if(pick){ usedIds.add(pick.r.id); usedGenres.add(pick.r.genre); } return pick; }
    // 同じ条件での再提案で、同じ本命がすぐ繰り返されないようにする。
    // 直近の本命(history)を除いても3軒以上残るときは、それらを選択肢から外す。足りないときだけ、順位を下げる(rankOf)に留める
    var recent = new Set((ctx.history || []).slice(0, HISTORY_LIMIT).map(function(h){ return h.id; }));
    var notRecent = pool.filter(function(x){ return !recent.has(x.r.id); });
    var honban = take(weightedPick(notRecent.length >= 3 ? notRecent : pool, 3, rnd));
    var anaba = null, boken = null;
    if(pool.length >= 2){
      var skip = Math.ceil(pool.length * 0.4);
      var zone = pool.slice(skip).filter(function(x){ return !usedIds.has(x.r.id); });
      var fresh = zone.filter(function(x){ return !usedGenres.has(x.r.genre); });
      anaba = take(weightedPick(fresh.length ? fresh : (zone.length ? zone : pool.filter(function(x){ return !usedIds.has(x.r.id); })), 8, rnd));
    }
    if(pool.length >= 3) boken = take(pickAdventure(pool, usedIds, usedGenres, rnd));
    return {status: pool.length >= MIN_QUALIFIED_FOR_FULL ? "ok" : "few", qualifiedCount: pool.length, pool: pool, honban: honban, anaba: anaba, boken: boken};
  }

  /* ---------- 確認済みデータによる補正 ---------- */
  /* 食べログの席数がカウンター席のみの店は、家族での利用に向かない(テーブル席がない)ものとして扱う。
     「家族適性」の元の値は性格分類(vibe)由来の目安で、席の構成という確認できる事実と食い違うため。 */
  function applyEvidenceCaps(restaurants){
    restaurants.forEach(function(r){
      if(r.facts && r.facts.counterOnly && r.companionFit && r.companionFit.family > 2){
        r.companionFit.family = 2;
        if(r.moodFit && r.moodFit.familyFun > 2) r.moodFit.familyFun = 2;
      }
    });
    return restaurants;
  }

  /* ---------- 画面表示用の整形 ---------- */
  function isTargetStation(name){ return !!name && TARGET_STATIONS.indexOf(name) !== -1; }
  /* エリア表示。最寄り駅が対象エリアの駅ならエリア名、そうでなければ住所の区・町(例: 中野区本町) */
  function placeLabel(r){
    if(!r.nearestStation || isTargetStation(r.nearestStation)) return r.area;
    var m = r.address && r.address.match(/^(.+?区)([^\d\s]+)/);
    return m ? m[1] + m[2] : r.area;
  }
  /* 最寄り駅と距離。食べログの掲載値(直線距離)をそのまま丸めて表示。徒歩分数は推測で作らない */
  function accessLabel(r){
    if(!r.nearestStation || !r.stationMeters) return null;
    var m = r.stationMeters, txt = m >= 1000 ? (Math.round(m / 100) / 10) + "km" : (Math.max(10, Math.round(m / 10) * 10)) + "m";
    return r.nearestStation + "駅から約" + txt;
  }
  /* 席数は合計だけを目安として示す(内訳は情報源ごとに書き方が違い、合計と合わないことがあるため) */
  function seatsLabel(r){
    var n = seatsTotal(r);
    return n ? "席数の目安 " + n + "席" : null;
  }
  var SRC_NAMES = {official: "公式サイト", tabelog: "食べログ掲載情報", web: "グルメサイト等の掲載情報", mixed: "公式サイト・食べログ等"};
  function infoSourceLabel(r){
    var s = r.infoSrc;
    if(!s) return null;
    var d = s.checked ? s.checked.replace(/^(\d{4})-(\d{2})-(\d{2})$/, function(_, y, m, dd){ return y + "年" + parseInt(m, 10) + "月" + parseInt(dd, 10) + "日"; }) : "";
    return (SRC_NAMES[s.type] || "掲載情報") + (d ? "(" + d + "確認)" : "");
  }

  /* ---------- 推薦理由 ---------- */
  // タグ: 評価点・口コミ件数・時間帯や設備の断定(営業時間・設備データで確認できるものは別に示す)・安さの断定は理由に使わない
  var NOISE_TAG_RE = /評価|口コミ|\d+件|座敷|ランチ|昼夜|深夜|24時間|朝|モーニング|子連れ|歓迎|人気|行列|安|コスパ|お得|手頃|リーズナブル/;
  // 推薦理由(店ごとの文)に出さない絶対表現。「コスパがよい」と「安い」は別。予算は金額そのもので示す
  var ABSOLUTE_CHEAP_RE = /安い|安く|安め|激安|格安|最安|最強|驚くほど|超コスパ|財布にやさし/;
  // 評価点・口コミ件数は「その気分に合う理由」にならないので、店ごとの文であっても出さない
  var SCORE_CLAIM_RE = /評価\d|評価点|口コミ|レビュー|\d[\d,]*件/;

  /* 時間帯の断定は、営業時間データで裏付けがあるときだけ理由に使う(裏付けがない・営業時間が不明なら使わない) */
  function allSlots(r){
    if(!r.openSlots) return [];
    return [0,1,2,3,4,5,6].reduce(function(a, d){ return a.concat(r.openSlots[d] || []); }, []);
  }
  var TIME_CLAIMS = {
    "24時間": function(r){ return !!r.openSlots && [0,1,2,3,4,5,6].every(function(d){ return (r.openSlots[d] || []).some(function(sl){ return sl[1] - sl[0] >= 1380; }); }); },
    "深夜": function(r){ return allSlots(r).some(function(sl){ return sl[1] > 1440; }); },
    "ランチ": function(r){ return allSlots(r).some(function(sl){ return sl[0] < 840 && sl[1] > 660; }); },
    "昼夜": function(r){ return !!r.openSlots && [0,1,2,3,4,5,6].some(function(d){ var t = r.openSlots[d] || []; return t.some(function(sl){ return sl[0] < 840 && sl[1] > 660; }) && t.some(function(sl){ return sl[1] > 1080; }); }); },
    "朝": function(r){ return allSlots(r).some(function(sl){ return sl[0] < 540 && sl[1] > 360; }); }
  };
  /* 店ごとの理由文・タグを、いま表示してよいか。根拠が確認できない断定は出さない */
  function claimAllowed(r, text){
    if(ABSOLUTE_CHEAP_RE.test(text) || SCORE_CLAIM_RE.test(text)) return false;
    var f = r.facts || {};
    for(var kw in TIME_CLAIMS){ if(text.indexOf(kw) !== -1 && !TIME_CLAIMS[kw](r)) return false; }
    if(/座敷|掘りごたつ/.test(text) && !/座敷|小上がり|掘りごたつ/.test(r.seats || "")) return false;
    if(/子連れ|お子様|子ども|子供|キッズ|ファミリー/.test(text) && !f.kids) return false;
    if(/個室/.test(text) && !f.privateRoom) return false;
    return true;
  }

  function seatsTotal(r){
    var m = r.seats && String(r.seats).match(/(\d+)\s*席/);
    return m ? parseInt(m[1], 10) : null;
  }
  function stationFact(r){
    if(!r.nearestStation || !r.stationMeters) return null;
    var m = Math.max(10, Math.round(r.stationMeters / 10) * 10);
    return r.nearestStation + "駅から約" + m + "m";
  }
  function lastClosing(r, weekday){
    if(!r.openSlots) return null;
    var today = r.openSlots[weekday] || [];
    if(!today.length) return null;
    var e = Math.max.apply(null, today.map(function(sl){ return sl[1]; }));
    return e;
  }
  function closingText(e){ return e === 1440 ? "24:00" : OH.hhmm(e); }

  /* 戻り値 {heading, items:[…最大2件], hasReason} */
  function buildReasons(r, companionId, moodId, ctx){
    var items = [];
    function add(t){ if(t && items.indexOf(t) === -1 && items.length < 2) items.push(t); }
    var seeds = r.reasonSeeds || {};
    (seeds[moodId] || []).filter(function(t){ return claimAllowed(r, t); }).forEach(add);
    (seeds[companionId] || []).filter(function(t){ return claimAllowed(r, t); }).forEach(add);

    var facts = r.facts || {};
    var wd = todayWeekday(ctx && ctx.now);
    var seats = seatsTotal(r);
    var station = stationFact(r);

    // 選んだ気分・誰とに結び付く、データ上の事実
    if(items.length < 2){
      if(moodId === "budget" && r.priceRange.dinner[1] <= BUDGET_CAP)
        add("予算の目安は" + priceLabel(r) + "。コスパを重視する日の候補です。");
      if(moodId === "drinking" && !NON_ALCOHOL_GENRE_RE.test(r.genre)){
        var e = lastClosing(r, wd);
        add(e ? r.genre + "で、今日は" + closingText(e) + "まで営業(通常の営業時間)です。" : r.genre + "のお店です。お酒を楽しめる業態です。");
      }
      if((moodId === "lively" || companionId === "friends" || companionId === "colleagues") && seats && seats >= 30)
        add("全" + seats + "席と席数が多く、人数が集まる日にも向いた規模です。");
      if((companionId === "couple" || moodId === "calm") && facts.privateRoom)
        add("食べログに「個室あり」の記載があります。");
      if((moodId === "familyFun" || companionId === "family") && facts.kids)
        add("食べログに「" + facts.kids + "」の記載があります。");
      if((moodId === "familyFun" || companionId === "family") && (facts.zashiki || facts.horigotatsu))
        add((facts.horigotatsu ? "掘りごたつ" : "座敷") + "席があります(食べログ掲載情報)。");
      if(moodId === "quick" && station)
        add(station + "(直線距離)。ふらっと立ち寄れる立地です。");
    }
    var hasReason = items.length > 0;

    // 気分に結び付かない、店そのものの特徴(事実のみ・言い切りの推測はしない)
    if(items.length < 2){
      var tags = (r.tags || []).filter(function(t){ return !NOISE_TAG_RE.test(t) && claimAllowed(r, t) && r.genre.indexOf(t) === -1 && t.indexOf(r.genre) === -1; });
      if(tags.length) add("「" + tags[0] + "」が特徴のお店です。");
    }
    if(items.length < 2 && station) add(station + "(直線距離)です。");
    if(!items.length) add(r.genre + "のお店です。予算の目安は" + priceLabel(r) + "。");
    return {heading: hasReason ? "ここが今日に合いそうな理由" : "このお店について", items: items, hasReason: hasReason};
  }

  var api = {
    BUDGET_CAP: BUDGET_CAP, MIN_QUALIFIED_FOR_FULL: MIN_QUALIFIED_FOR_FULL, HISTORY_LIMIT: HISTORY_LIMIT,
    storeKind: storeKind, MOOD_MUST: MOOD_MUST, NON_ALCOHOL_GENRE_RE: NON_ALCOHOL_GENRE_RE, TARGET_STATIONS: TARGET_STATIONS,
    todayWeekday: todayWeekday, isClosedToday: isClosedToday, isFinishedNow: isFinishedNow, isUnavailable: isUnavailable,
    hasEveningService: hasEveningService, hoursUnknown: hoursUnknown,
    priceBucket: priceBucket, priceLabel: priceLabel, scoreRestaurant: scoreRestaurant,
    isEligible: isEligible, meetsCompanion: meetsCompanion, meetsMood: meetsMood, qualifies: qualifies,
    qualifiedPool: qualifiedPool, relaxedPool: relaxedPool, weightedPick: weightedPick, pickAdventure: pickAdventure, pickPicks: pickPicks,
    buildReasons: buildReasons, stationFact: stationFact, seatsTotal: seatsTotal, NOISE_TAG_RE: NOISE_TAG_RE, ABSOLUTE_CHEAP_RE: ABSOLUTE_CHEAP_RE, SCORE_CLAIM_RE: SCORE_CLAIM_RE, claimAllowed: claimAllowed,
    applyEvidenceCaps: applyEvidenceCaps, placeLabel: placeLabel, accessLabel: accessLabel, seatsLabel: seatsLabel, infoSourceLabel: infoSourceLabel, isTargetStation: isTargetStation
  };
  if(typeof module !== "undefined" && module.exports) module.exports = api;
  else root.Recommend = api;
})(typeof window !== "undefined" ? window : this);
