/* =========================================================
   店舗の営業情報(営業時間・定休日・席数)と「毎週の定休曜日」
   data/restaurants.js の後に読み込み、店舗idごとに重ね合わせる。

   - hours / closedDays / seats:
       restaurants.js側が未設定(null)の店だけ補う。既存の値は上書きしない。
   - closedWeekdays: 「毎週決まった曜日が定休」の店だけ設定する(0=日 … 6=土)。
       index.html が「今日が定休日の店」を候補から外すのに使う。
       不定休・第n週休み・祝日休みは、外れる日を誤るリスクがあるため入れない。
   - closed: 閉店が確認できた店(理由の文字列)。データは残し、提案からだけ外す。
   - src: 情報源。"tabelog"=食べログ掲載情報 / "web"=検索結果に出た公式・グルメサイト情報
   - 調査日: 2026-09-19。食べログ等に載る情報の転記であり、現地確認はしていない。
   - 推測での補完はしない。分からない項目は書かない。
   ========================================================= */
const STORE_INFO = {
  /* ── 既存58店: 定休曜日のみ(営業時間・定休日の文言は restaurants.js に既にある) ── */
  "asagaya-impronte":{closedWeekdays:[1,2]},
  "asagaya-nui":{closedWeekdays:[2]},
  "asagaya-lamaisoncourtine":{closedWeekdays:[2,3]},
  "koenji-dilettante":{closedWeekdays:[1]},
  "koenji-bocca-lupo":{closedWeekdays:[3]},
  "asagaya-ishigamaya":{closedWeekdays:[1]},
  "asagaya-uotetsu":{closedWeekdays:[0]},
  "koenji-citraba":{closedWeekdays:[1]},
  "asagaya-spice-and-co":{closedWeekdays:[0,1]},
  "asagaya-enya":{closedWeekdays:[2]},
  "asagaya-iron-diner":{closedWeekdays:[3]},
  "koenji-gaucho":{closedWeekdays:[2]},
  "asagaya-daothai":{closedWeekdays:[2]},
  "asagaya-sato-brillant-honten":{closedWeekdays:[1]},
  "asagaya-sato-brillant-nigou":{closedWeekdays:[1]},
  "asagaya-dendenkushi":{closedWeekdays:[0]},
  "asagaya-sakurai":{closedWeekdays:[3]},
  "asagaya-sushi-souten":{closedWeekdays:[1,2,3]},
  "asagaya-bistrot33":{closedWeekdays:[1,2]},
  "asagaya-hachicafe":{closedWeekdays:[2]},
  "koenji-poeme-mano":{closedWeekdays:[2]},
  "koenji-patissier-junhomma":{closedWeekdays:[1]},

  /* ── 閉店(食べログに【閉店】表示、または報道で確認)。データは残し、提案から外す ── */
  "koenji-jules-verne":{closed:"閉店(食べログ表示)"},
  "asagaya-bansho":{closed:"閉店(食べログ表示)"},
  "asagaya-tachimachi":{closed:"閉店(食べログ表示)"},
  "koenji-fujikawa":{closed:"閉店(2021年11月・食べログ表示と報道)"},

  /* ── 移転: 焼肉あまねは2024年5月に高円寺から南阿佐ヶ谷へ移転(住所・最寄駅・予約URLは restaurants.js を更新済み) ── */
  "koenji-amane":{hours:"月・水〜日・祝 12:00〜15:00、17:00〜22:00(料理L.O.21:30) / 火 ランチのみ 11:30〜14:00", closedDays:"火曜日(ランチのみ営業)", seats:"14席(カウンター6席、テーブル8席)", closedWeekdays:[2], src:"tabelog"},

  /* ── 食べログ掲載情報から追加(評価の高い店から調査) ── */
  "asagaya-daishi-to-men-yuei":{hours:"水・木 17:00〜21:00 / 土・日 11:00〜15:30", closedDays:"月曜・火曜・金曜", seats:"8席(カウンター6席、テーブル2〜3席)", closedWeekdays:[1,2,5], src:"tabelog"},
  "asagaya-hopeken":{hours:"火〜日 11:30〜15:30、17:30〜21:00", closedDays:"月曜日", seats:"12席(カウンターのみ)", closedWeekdays:[1], src:"tabelog"},
  "asagaya-mugi-to-te":{hours:"火・木・土・日 11:00〜15:00、18:00〜20:00", closedDays:"月曜・水曜・金曜", seats:"7席(カウンターのみ)", closedWeekdays:[1,3,5], src:"tabelog"},
  "asagaya-kotaro":{hours:"火〜日 16:00〜23:00(料理L.O.22:00、ドリンクL.O.22:30)", closedDays:"月曜日", seats:"50席", closedWeekdays:[1], src:"tabelog"},
  "asagaya-koshikawa":{hours:"月〜日 16:30〜翌2:00", closedDays:"無休", seats:"25席", closedWeekdays:[], src:"tabelog"},
  "koenji-kaisen":{hours:"火〜木 17:00〜22:30 / 金・土 17:00〜23:00", closedDays:"日曜・月曜", seats:"22席", closedWeekdays:[0,1], src:"tabelog"},
  "koenji-mara":{hours:"月〜日 17:00〜24:00(L.O.23:00)", closedDays:"不定休(Instagramで告知)", seats:"26席(カウンター8席、テーブル席)", src:"tabelog"},
  "koenji-and-beer":{hours:"火 11:30〜15:00 / 水〜土 11:30〜22:00 / 日・祝 11:30〜21:00", closedDays:"月曜日", seats:"22席(カウンター6席、テーブル16席)", closedWeekdays:[1], src:"tabelog"},
  "koenji-manmajima":{hours:"月〜金 17:00〜24:00 / 土日祝 13:00〜24:00", closedDays:"不定休(会社行事などによる)", seats:"57席(カウンター10席、テーブル22席、掘りごたつ座敷21席)", src:"tabelog"},
  "asagaya-shinkei":{hours:"月〜木・日・祝 17:00〜翌1:00 / 金・土 17:00〜翌3:00", closedDays:"なし", seats:"45席", closedWeekdays:[], src:"tabelog"},
  "koenji-mazesoba-minami":{hours:"月〜日 11:00〜23:30", seats:"9席", src:"tabelog"},
  "asagaya-curry-jikan":{hours:"水〜日 11:30〜15:00(L.O.14:30)", closedDays:"月曜・火曜(祝日は営業)", seats:"8席(カウンター4席、2人掛けテーブル2卓)", closedWeekdays:[1,2], src:"tabelog"},
  "asagaya-rokukan":{hours:"月〜日 17:00〜24:00(L.O.23:30)", seats:"10席", src:"tabelog"},
  "koenji-abusan":{hours:"月〜日 17:00〜23:00", closedDays:"月により異なる(10月は第1・第3・第5水曜も営業)", seats:"17席(カウンター8席、2階座敷4名卓×2)", src:"tabelog"},
  "koenji-ajito":{hours:"月〜日 17:00〜24:00(L.O.23:00)", closedDays:"不定休", seats:"34席(カウンター10席、テーブル8席、掘りごたつ10席、ロフト席6席)", src:"tabelog"},
  "asagaya-wantantei":{hours:"月〜日 11:00〜翌7:30(L.O.7:00)", seats:"28席", src:"tabelog"},
  "koenji-fukuraimon":{hours:"月〜日 11:30〜翌2:00(L.O.1:30)", seats:"44席(全てテーブル席)", src:"tabelog"},
  "asagaya-toridokoro":{hours:"月・火・水・金 12:00〜14:30、17:00〜23:00 / 土 14:00〜23:00 / 日・祝 14:00〜22:00", closedDays:"木曜日", seats:"30席", closedWeekdays:[4], src:"tabelog"},
  "asagaya-futakun":{hours:"月〜日 15:00〜24:00", seats:"20席(基本立ち飲み)", src:"tabelog"},
  "koenji-aopi":{hours:"月・火 18:00〜24:00 / 木・金 12:00〜15:00、18:00〜24:00 / 土・日・祝 12:00〜17:00、18:00〜24:00", closedDays:"水曜日(火曜は隔週で休み)", seats:"14席(カウンター8席、テーブル6席)", closedWeekdays:[3], src:"tabelog"},
  "asagaya-azumaya":{hours:"月・水〜日 11:30〜15:00、16:30〜21:00", closedDays:"火曜日", seats:"50席(カウンター、テーブル、小上がり)", closedWeekdays:[2], src:"tabelog"},
  "asagaya-rasenya":{hours:"月〜水・金〜日 11:30〜15:00、17:30〜22:00", closedDays:"木曜日", seats:"20席(カウンター4席、テーブル16席)", closedWeekdays:[4], src:"tabelog"},
  "asagaya-delceppo":{hours:"月・火・木〜日 11:00〜15:15(料理L.O.15:00)、17:30〜22:00(料理L.O.21:00)", closedDays:"水曜日", seats:"17席(カウンター3席、テーブル14席)", closedWeekdays:[3], src:"tabelog"},
  "asagaya-meat-kitchen-harmers":{hours:"月・火・木〜日・祝 11:30〜15:00(L.O.14:00)、17:00〜22:00(料理L.O.21:00)", closedDays:"水曜日", seats:"15席(テーブル、カウンター7席)", closedWeekdays:[3], src:"tabelog"},
  "koenji-daichi-sushi-yakitori":{hours:"月〜金 16:00〜24:00 / 土日祝 13:00〜24:00", seats:"60席", src:"tabelog"},
  "koenji-byanbyan-chengdu":{hours:"月〜日・祝 11:00〜16:00(L.O.15:30)、18:00〜23:00(L.O.22:30)", closedDays:"なし", seats:"40席", closedWeekdays:[], src:"tabelog"},
  "koenji-futaba":{hours:"月〜土 11:30〜14:30、17:00〜21:00", closedDays:"日曜日", seats:"11席(カウンター9席、テーブル2席)", closedWeekdays:[0], src:"tabelog"},
  "koenji-matsunaga":{hours:"月・水〜日 12:00〜15:00、17:00〜21:00", closedDays:"火曜日", closedWeekdays:[2], src:"tabelog"},
  "koenji-fuji-tonkatsu":{hours:"月〜水・金〜日 17:00〜22:00(L.O.21:30)", closedDays:"木曜日", closedWeekdays:[4], src:"tabelog"},
  "asagaya-kushishinbo":{hours:"月〜土・祝 17:00〜24:00 / 日 15:30〜23:00", seats:"28席(カウンター8席、テーブル20席)", src:"tabelog"},
  "koenji-shichisuke":{hours:"月〜土 17:30〜24:00", closedDays:"日曜日・祝日", closedWeekdays:[0], src:"tabelog"},
  "asagaya-toriyoshi-second":{hours:"月〜金 15:00〜23:00(L.O.22:30) / 土 14:00〜23:00 / 日・祝 14:00〜23:00", seats:"36席(カウンター14席、テーブル22席)", src:"tabelog"},
  "asagaya-cafe-italian":{hours:"18:00〜24:00(フードL.O.23:00)", closedDays:"水曜日または不定休", seats:"38席(カウンター6席、テーブル20席、テラス8席)", src:"tabelog"},
  "koenji-kamatetsu":{hours:"水〜金 18:00〜翌3:00(L.O.2:00) / 土・日・祝 17:00〜翌3:00(L.O.2:00)", closedDays:"月曜日・火曜日", seats:"32席(1階8席、2階24席)", closedWeekdays:[1,2], src:"tabelog"},
  "asagaya-nihonshu-zero":{hours:"水〜日 17:00〜24:00(L.O.23:00)", closedDays:"月曜日・火曜日", seats:"20席", closedWeekdays:[1,2], src:"tabelog"},
  "koenji-en":{hours:"月・火・木〜日 17:00〜24:00", closedDays:"水曜日", seats:"12席", closedWeekdays:[3], src:"tabelog"},
  "koenji-iiiio":{hours:"水〜日 18:00〜23:00(料理L.O.22:00、ドリンクL.O.22:30)", closedDays:"月曜日・火曜日", seats:"16席(カウンター8席、テーブル8席)", closedWeekdays:[1,2], src:"tabelog"},
  "asagaya-kocco":{hours:"火〜金 18:00〜24:00 / 土 17:00〜24:00 / 日・祝 17:00〜23:00", closedDays:"月曜日(祝日の場合は営業、翌火曜休み)、他不定休あり", seats:"16席(カウンター8席、テーブル席)", closedWeekdays:[1], src:"tabelog"},
  "asagaya-beard":{hours:"火〜金 17:00〜23:00 / 土・日 16:00〜23:00", closedDays:"月曜日", seats:"29席", closedWeekdays:[1], src:"tabelog"},
  "koenji-tomimaru":{hours:"月〜金 17:00〜23:00(料理L.O.22:00) / 土日祝 15:00〜23:00", closedDays:"毎週月曜日(月曜が祝日の場合は翌日)", seats:"36席", closedWeekdays:[1], src:"tabelog"},
  "koenji-odoridori":{hours:"火〜金 17:00〜23:30 / 土日祝 16:00〜23:00", closedDays:"月曜日(月曜祝日の場合は営業、翌日休み)", seats:"16席(カウンター6席、テーブル9席)", closedWeekdays:[1], src:"tabelog"},
  "asagaya-tando-tan":{hours:"火〜金 17:30〜22:30(L.O.21:30) / 土 11:30〜14:00、17:30〜22:30", closedDays:"日曜日・月曜日", seats:"15席", closedWeekdays:[0,1], src:"tabelog"},
  "koenji-kitchen-fuji":{hours:"月〜金 17:00〜22:30 / 日 11:30〜14:30、17:00〜22:30", closedDays:"土曜日", seats:"13席(カウンター9席、テーブル2席×2)", closedWeekdays:[6], src:"tabelog"},
  "koenji-kuronbo":{hours:"11:00〜20:00", seats:"10席(カウンターのみ)", src:"tabelog"},
  "asagaya-curry-kyu":{hours:"火〜水・金〜土 11:30〜14:30、17:00〜20:00 / 木・日 11:30〜14:30", closedDays:"月曜日・毎月第1火曜日・他不定休あり", seats:"12席", closedWeekdays:[1], src:"tabelog"},
  "asagaya-spice-curry-toca":{hours:"月 11:00〜15:00 / 火〜木 11:00〜15:00、17:30〜21:00 / 金・土 11:00〜15:00、17:30〜22:00", closedDays:"日曜日", seats:"12席(カウンター4席、テーブル4席、テラス4席)", closedWeekdays:[0], src:"tabelog"},
  "asagaya-beniya":{hours:"11:00〜20:00", src:"tabelog"},
  "asagaya-namaste-himal":{hours:"月〜日 11:00〜翌1:00(L.O.24:00)", seats:"66席(1階26席、2階40席)", src:"tabelog"},
  "koenji-akka":{hours:"月〜日 17:00〜23:30(料理L.O.22:30、ドリンクL.O.23:00)", closedDays:"不定休", seats:"20席", src:"tabelog"},
  "koenji-tori-jiro":{hours:"月〜日 17:00〜翌1:00(料理L.O.24:00、ドリンクL.O.24:30)", closedDays:"不定休", seats:"22席", src:"tabelog"},
  "asagaya-hachinohe":{hours:"月〜日 17:00〜23:00(L.O.22:30)", closedDays:"不定休", seats:"36席(テーブル20席、個室10席、カウンター6席)", src:"tabelog"},
  "koenji-3b":{hours:"月〜日 17:00〜23:00(料理L.O.22:00、ドリンクL.O.22:30)", closedDays:"年末年始", seats:"39席(カウンター11席、テーブル28席)", src:"tabelog"},
  "asagaya-101-anzeroan":{hours:"月〜日 11:30〜16:30(料理L.O.14:30)、17:30〜23:00(L.O.21:30)", closedDays:"不定休", seats:"16席", src:"tabelog"},
  "koenji-light-side-cafe":{hours:"月〜金 11:30〜22:30(L.O.21:30) / 土日祝 11:00〜22:30(L.O.21:30)", closedDays:"不定休", seats:"32席", src:"tabelog"},
  "asagaya-spice-and-booze":{hours:"月〜日 18:00〜24:00(料理L.O.23:00、ドリンクL.O.23:30)", closedDays:"不定休(日曜・月曜が中心。Instagramで要確認)", seats:"8席", src:"tabelog"},
  "koenji-torisuke":{hours:"火〜土 17:00〜23:30(料理L.O.22:30、ドリンクL.O.23:00)", closedDays:"日曜・月曜で交互に休み(Instagramで要確認)", seats:"18席(カウンター8席、テーブル最大10名)", src:"tabelog"},
  "asagaya-chinkoen":{hours:"月〜日 11:00〜15:00、17:00〜23:30(L.O.23:00)", seats:"70席", src:"tabelog"},

  /* ── 検索結果(グルメサイト・公式情報)から追加。食べログより粗いので、確実に分かる項目のみ ── */
  "asagaya-yamatoki":{hours:"11:30〜16:00(L.O.は30分前)", closedDays:"月曜日", seats:"カウンター9席", closedWeekdays:[1], src:"web"},
  "koenji-barikote":{hours:"11:00〜22:00(日曜は21:00まで)", closedDays:"月曜日", closedWeekdays:[1], src:"web"},
  "koenji-jimon":{hours:"11:00〜22:00(スープ・麺が無くなり次第終了)", closedDays:"水曜日", closedWeekdays:[3], src:"web"},
  "koenji-endera":{hours:"11:30〜22:00(スープが無くなり次第終了)", closedDays:"水曜日", closedWeekdays:[3], src:"web"},
  "asagaya-menjo-issho":{hours:"11:00〜16:00(スープが無くなり次第終了)", closedDays:"水曜日", seats:"カウンター10席", closedWeekdays:[3], src:"web"},
  "koenji-chuka-isshin":{hours:"平日 11:30〜15:30 / 土日祝 11:30〜16:00", closedDays:"月曜日", closedWeekdays:[1], src:"web"},
  "asagaya-yokohama-iekei":{hours:"11:00〜翌1:00(16:00〜17:00は休憩)", closedDays:"年中無休", closedWeekdays:[], src:"web"},
  "koenji-taikiya-akatsuki":{hours:"11:00〜15:00、17:00〜23:00", closedDays:"無休", closedWeekdays:[], src:"web"},
  "koenji-tomochin":{hours:"月〜木 10:00〜22:00 / 金 10:00〜翌5:00 / 土 8:00〜翌5:00 / 日 8:00〜21:00", closedDays:"不定休", src:"web"}
};

/* 上の表を店舗データに重ね合わせる(未設定の項目だけ補い、既存の値は上書きしない) */
(function applyStoreInfo(){
  if(typeof RESTAURANTS === "undefined") return;
  RESTAURANTS.forEach(function(r){
    const info = STORE_INFO[r.id];
    if(!info) return;
    ["hours", "closedDays", "seats"].forEach(function(k){
      if(!r[k] && info[k]) r[k] = info[k];
    });
    if(Array.isArray(info.closedWeekdays)) r.closedWeekdays = info.closedWeekdays;
    if(info.closed) r.closed = info.closed;
  });
})();
