/* =========================================================
   営業時間の文字列(hours)を読み取り、「今その店が開いているか」を判定する。

   方針: 厳密に読み取れた店だけを判定に使う。読み取れない書式・注意書きが混ざる店は
   null(不明)にして、提案から外さない(誤って開いている店を隠すより、出す方を選ぶ)。

   - parseHours(str)      → {0..6: [[開始分, 終了分], ...]} または null(読み取れない)
                            終了が1440を超える場合は翌日にまたがる営業(例: 26:00 = 翌2:00)
   - statusAt(slots, date) → {state:"open"|"later"|"finished", ...}
                            slotsがnull、またはその日の営業枠が1つも無いときは null(判定しない)
   - ブラウザでは window.OpenHours、Nodeでは module.exports で使う
   ========================================================= */
(function(root){
  var DAY_CHARS = "日月火水木金土";

  function normalize(src){
    var s = String(src);
    // 全角→半角・記号の統一
    s = s.replace(/[：]/g, ":").replace(/[（]/g, "(").replace(/[）]/g, ")")
         .replace(/[～~–—−―－]/g, "〜").replace(/[／]/g, "/")
         .replace(/[０-９]/g, function(c){ return String.fromCharCode(c.charCodeAt(0) - 0xFEE0); })
         .replace(/[［【\[]/g, " ").replace(/[］】\]]/g, " ");
    // ※以降の注意書き、括弧内の注記(L.O.・ラスト入店・休憩など)を除く
    s = s.replace(/※.*$/, "");
    for(var i = 0; i < 3; i++) s = s.replace(/\([^()]*\)/g, " ");
    // 時間帯ラベル・料理/ドリンクのL.O.表記の残り
    s = s.replace(/ランチ|ディナー|LUNCH|DINNER|営業時間/g, " ");
    s = s.replace(/(?:料理|ドリンク|フード|ラスト入店)?\s*L\.?O\.?\s*\d{1,2}:\d{2}/g, " ");
    // 祝日系は判定に使わない(曜日の営業時間に従う)
    s = s.replace(/祝前日|祝後日|祝前|祝後/g, "祝");
    // 「月〜木:」のようなコロン付きの曜日表記
    s = s.replace(/([月火水木金土日祝])\s*:/g, "$1 ");
    return s;
  }

  var DAY_ATOM = "(?:祝日?|[月火水木金土日](?:曜日?)?)";
  var DAYSPEC = "(?:平日|全日|毎日|土日祝日?|土日|" + DAY_ATOM + "(?:[〜・]" + DAY_ATOM + ")*)";
  var TIME = "(\\d{1,2}):(\\d{2})\\s*〜\\s*(翌)?(\\d{1,2}):(\\d{2})";
  var TOKEN = new RegExp("(" + DAYSPEC + ")|" + TIME + "|(24時間営業|通し営業)|([\\s/、,・]+)", "g");

  function expandDays(spec){
    var set = {};
    function add(i){ set[i] = true; }
    if(spec === "平日"){ [1,2,3,4,5].forEach(add); return set; }
    if(spec === "全日" || spec === "毎日"){ [0,1,2,3,4,5,6].forEach(add); return set; }
    if(/^土日祝日?$/.test(spec) || spec === "土日"){ add(6); add(0); return set; }
    var s = spec.replace(/曜日?/g, "").replace(/祝日?/g, "祝");
    // 範囲(月〜木)と個別(月・火)。祝は無視
    var parts = s.split("・");
    for(var p = 0; p < parts.length; p++){
      var seg = parts[p];
      var chain = seg.split("〜");
      if(chain.length === 1){
        if(DAY_CHARS.indexOf(chain[0]) !== -1) add(DAY_CHARS.indexOf(chain[0]));
      } else {
        // 月〜木〜… のような連鎖は先頭と末尾だけ見る
        var a = DAY_CHARS.indexOf(chain[0]), b = DAY_CHARS.indexOf(chain[chain.length - 1]);
        if(a === -1 || b === -1) continue; // 祝を含む範囲は無視
        for(var i = a; ; i = (i + 1) % 7){ add(i); if(i === b) break; }
      }
    }
    return set;
  }

  function parseHours(src){
    if(!src) return null;
    // 曜日・日によって時間が変わる旨の注記がある店は、誤読を避けて「不明」にする
    if(/のみ|不定期|異なる|によって|曜は|日は|第\d|隔週|変動/.test(String(src))) return null;
    var s = normalize(src);
    var slots = {0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: []};
    var days = null;      // 直前に指定された曜日(未指定なら全日)
    var afterTime = true; // 直前のトークンが時間帯か(true=次の曜日指定は新しい区切り)
    var last = 0, any = false, m;
    TOKEN.lastIndex = 0;
    while((m = TOKEN.exec(s))){
      if(m.index !== last) return null;       // 読み取れない文字が挟まっている
      last = TOKEN.lastIndex;
      if(m[1]){
        var ex = expandDays(m[1]);
        if(afterTime || !days){ days = ex; }
        else { for(var k in ex) days[k] = true; }   // 「月、火、木、金:」のように曜日が続く場合は合算
        afterTime = false;
      } else if(m[2] !== undefined){
        afterTime = true;
        var st = parseInt(m[2], 10) * 60 + parseInt(m[3], 10);
        var en = parseInt(m[5], 10) * 60 + parseInt(m[6], 10) + (m[4] ? 1440 : 0);
        if(en <= st) en += 1440;              // 17:00〜02:00 のような日またぎ
        if(st >= 1440 || en > 2880) return null;
        var target = days || {0:1,1:1,2:1,3:1,4:1,5:1,6:1};
        for(var d in target) slots[d].push([st, en]);
        any = true;
      } else if(m[7]){
        afterTime = true;
        var t2 = days || {0:1,1:1,2:1,3:1,4:1,5:1,6:1};
        for(var d2 in t2) slots[d2].push([0, 1440]);
        any = true;
      }
      if(last >= s.length) break;
    }
    if(last < s.length) return null;
    return any ? slots : null;
  }

  function two(n){ return (n < 10 ? "0" : "") + n; }
  function hhmm(min){
    if(min >= 1440) return "翌" + Math.floor((min - 1440) / 60) + ":" + two((min - 1440) % 60);
    return Math.floor(min / 60) + ":" + two(min % 60);
  }

  /* 今その店が開いているか。閉店まで45分を切り、この後の営業もない店は "finished" とみなす */
  function statusAt(slots, date){
    if(!slots) return null;
    var now = date || new Date();
    var m = now.getHours() * 60 + now.getMinutes();
    var d = now.getDay(), y = (d + 6) % 7;
    var today = slots[d], yest = slots[y];
    var best = null;
    // 前日から続く営業(26:00 = 翌2:00 など)
    yest.forEach(function(sl){
      if(sl[1] > 1440 && m < sl[1] - 1440){
        var left = sl[1] - 1440 - m;
        if(!best || left > best.left) best = {left: left, closes: sl[1] - 1440};
      }
    });
    today.forEach(function(sl){
      if(m >= sl[0] && m < sl[1]){
        var left = sl[1] - m;
        if(!best || left > best.left) best = {left: left, closes: sl[1]};
      }
    });
    var later = null;
    today.forEach(function(sl){ if(sl[0] > m && (later === null || sl[0] < later)) later = sl[0]; });
    // その日の営業枠がまったく読み取れない曜日は判定しない(書式の欠落かもしれないため)。
    // 定休日は closedWeekdays(店舗データ側)で別途扱う。
    if(!best && today.length === 0) return null;
    if(best && best.left >= 45) return {state: "open", closes: best.closes, left: best.left};
    if(later !== null) return {state: "later", opens: later};
    if(best) return {state: "finished", closes: best.closes, left: best.left, closing: true};
    return {state: "finished"};
  }

  function label(status){
    if(!status) return null;
    // 通常の営業時間にもとづく目安。臨時休業・混雑・満席は分からないので、「営業中」と言い切らない
    if(status.state === "open") return "通常は営業中(〜" + (status.closes === 1440 ? "24:00" : hhmm(status.closes)) + ")";
    if(status.state === "later") return "通常は" + hhmm(status.opens) + "から営業";
    return null;
  }

  var api = {parseHours: parseHours, statusAt: statusAt, label: label, hhmm: hhmm};
  if(typeof module !== "undefined" && module.exports) module.exports = api;
  else root.OpenHours = api;
})(typeof window !== "undefined" ? window : this);
