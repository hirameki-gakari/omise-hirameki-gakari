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
  "koenji-tomochin":{hours:"月〜木 10:00〜22:00 / 金 10:00〜翌5:00 / 土 8:00〜翌5:00 / 日 8:00〜21:00", closedDays:"不定休", src:"web"},

  /* ── 食べログ掲載情報から一括追加(2026-09-19取得。食べログ評価の高い店の順) ── */
  /* とんかつ成蔵 食べログ4.27 */
  "asagaya-tonkatsu-narikura":{hours:"水・木・土・日・祝 10:30〜13:40、17:30〜20:40", closedDays:"月曜日・火曜日・金曜日、他不定休", seats:"14席（うちカウンター6席）", closedWeekdays:[1,2,5], src:"tabelog"},
  /* ジェラテリア シンチェリータ 食べログ3.80 */
  "asagaya-cincirella":{hours:"月〜日・祝 11:00〜20:00", closedDays:"無休", seats:"8席", src:"tabelog"},
  /* RAMEN CiQUE 食べログ3.77 */
  "asagaya-ramen-cique":{hours:"火・水・木・金・土・日 11:30〜15:00、18:30〜21:45", closedDays:"月曜日", seats:"6席（カウンターのみ、待合ソファあり）", closedWeekdays:[1], src:"tabelog"},
  /* 中洲屋台長浜ラーメン初代 健太 東京高円寺本店 食べログ3.77 */
  "koenji-nakasu-yatai":{hours:"火・水・木・金・土・日 12:00〜15:00", closedDays:"月曜日", seats:"9席（カウンター9席）", closedWeekdays:[1], src:"tabelog"},
  /* 豚骨 蒼翔 食べログ3.74 */
  "koenji-tonkotsu-souten":{hours:"月・水・木・金・土 11:00〜15:00、17:00〜21:00(L.O.料理20:45) / 日 11:00〜15:00(L.O.料理14:55)、17:00〜21:00(L.O.料理20:45)", closedDays:"火曜日", seats:"11席（カウンター10席 4人テーブル1卓）", closedWeekdays:[2], src:"tabelog"},
  /* 麺屋 はやしまる 食べログ3.73 */
  "koenji-hayashimaru":{hours:"月・火・金・土・日 10:56〜15:00", closedDays:"水曜日・木曜日", seats:"10席（2026年7月12日時点 朝一並び11人目で ファーストロッドならず。席数10人。 ）", closedWeekdays:[3,4], src:"tabelog"},
  /* アサガキタ 食べログ3.72 */
  "asagaya-asagakita":{hours:"月〜日・祝 11:00〜14:30", seats:"9席（カウンター7席・テーブル2席）", src:"tabelog"},
  /* 無冠 阿佐ヶ谷 食べログ3.69 */
  "asagaya-mukan":{hours:"月・火・水・木・金・土 11:00〜15:00(L.O.15:00)、17:00〜23:00(L.O.22:45) / 日 11:00〜15:00(L.O.15:00)、17:00〜21:00(L.O.21:00)", seats:"12席（カウンター12席 ）", src:"tabelog"},
  /* 七つ森 食べログ3.66 */
  "koenji-nanatsumori":{hours:"10:30〜22:00", seats:"31席（カウンター5席、テーブル26席（4人掛け×5、2人掛け×3））", src:"tabelog"},
  /* DRIED SARDINE BROTHERS 食べログ3.63 */
  "koenji-dried-sardine":{hours:"月・火・水・木・金・土 11:30〜15:00、18:00〜23:00 / 日 11:30〜21:00", closedDays:"不定休", seats:"8席", src:"tabelog"},
  /* じゃぐら 食べログ3.62 */
  "koenji-jagura":{hours:"月・火・水・木・金 11:30〜16:00、18:00〜22:00(L.O.21:30) / 土・日・祝 11:30〜21:00(L.O.20:30)", closedDays:"不定休", seats:"11席（カウンター5席、テーブル6席）", src:"tabelog"},
  /* らーめん いろはや 食べログ3.61 */
  "asagaya-irohaya":{hours:"月・火・木・金・土・日 11:30〜14:00、18:00〜20:00", closedDays:"水曜日", seats:"11席（カウンターのみ）", closedWeekdays:[3], src:"tabelog"},
  /* 六九麺 食べログ3.59 */
  "koenji-rokkumen":{hours:"月 11:30〜02:00 / 火・水・木・金・土・日・祝 11:00〜05:00", closedDays:"不定休", seats:"8席", src:"tabelog"},
  /* 焼鳥 山もと 阿佐ヶ谷cellar 食べログ3.58 */
  "asagaya-yamamoto-cellar":{hours:"火・水・木・金・土・日 18:00〜22:00", closedDays:"月曜日", seats:"15席（カウンター席のみ）", closedWeekdays:[1], src:"tabelog"},
  /* ギオン 食べログ3.58 */
  "asagaya-gion":{hours:"月・火・水・木・日 09:00〜00:00 / 金・土 09:00〜01:00", seats:"20席（テーブル14席、カウンター６席）", src:"tabelog"},
  /* アール座読書館 食べログ3.58 */
  "koenji-aruza-dokushokan":{hours:"火・水・木・金・土・日 12:00〜22:00", closedDays:"月曜日", seats:"11席（4人席1、2人席7）", closedWeekdays:[1], src:"tabelog"},
  /* RAD BROS CAFE 食べログ3.58 */
  "koenji-rad-bros":{hours:"木・金・土・日 11:00〜17:30", closedDays:"月曜日・火曜日・水曜日", seats:"5席（店内5席とテラス4席。テイクアウトをメインとしたコーヒースタンドです。）", closedWeekdays:[1,2,3], src:"tabelog"},
  /* タロー軒 食べログ3.57 */
  "koenji-taroken":{hours:"24時間営業", seats:"8席（立ち食いカウンター約10席、4人席テーブル×2）", src:"tabelog"},
  /* NOSTALGIA CAFE 食べログ3.57 */
  "koenji-nostalgia-cafe":{hours:"月・水・木・金・土・日 11:30〜19:00(L.O.18:00)", closedDays:"火曜日", seats:"20席（カウンター4席、テーブル16席（4人掛け×1、2人掛け×6））", closedWeekdays:[2], src:"tabelog"},
  /* AIMU 食べログ3.56 */
  "koenji-aimu":{seats:"5席（カウンター席1×2、テーブル4（2名掛け×4））", src:"tabelog"},
  /* らーめん うち田 食べログ3.53 */
  "koenji-uchida":{hours:"月 12:00〜15:00 / 水 12:00〜15:00、17:00〜21:00 / 木・金・土・日 11:00〜15:00、17:00〜21:00", closedDays:"火曜日", seats:"9席（カウンター9席）", closedWeekdays:[2], src:"tabelog"},
  /* 高円寺麦酒工房 食べログ3.53 */
  "koenji-bakushukobo":{hours:"火・水・木・金 16:00〜23:30(L.O.料理22:30) / 土 12:00〜22:00(L.O.料理21:00) / 日・祝 12:00〜21:30(L.O.料理20:30)", closedDays:"月曜日", seats:"33席（※貸切ご希望の際は店舗までお問合せください※カウンター（半円形大テーブル）７席、テーブル２２席、小上がり３席見当", closedWeekdays:[1], src:"tabelog"},
  /* NEYO 食べログ3.52 */
  "koenji-neyo":{hours:"月・水 12:00〜17:30 / 火 11:30〜18:00 / 木 11:00〜17:30 / 金・土・日 10:00〜18:00", seats:"22席（テーブル22席（2名掛け丸テーブル×3、3名掛け丸テーブル×2、10名掛け×1）、他にベンチ席あり）", src:"tabelog"},
  /* ペンギン カフェ 食べログ3.51 */
  "asagaya-penguin-cafe":{hours:"月・木・金・土 11:00〜21:00 / 日 10:00〜21:00", closedDays:"火曜日・水曜日", seats:"22席", closedWeekdays:[2,3], src:"tabelog"},
  /* 炭火焼肉 三宝苑 阿佐ヶ谷店 食べログ3.50 */
  "asagaya-sanpoen":{hours:"月〜日・祝 17:00〜23:00(L.O.料理22:00ドリンク22:30)", seats:"43席", src:"tabelog"},
  /* ドドナエア 食べログ3.50 */
  "asagaya-dodonaea":{hours:"月・火・木・金・土・日・祝 11:30〜18:00", closedDays:"水曜日", seats:"29席", closedWeekdays:[3], src:"tabelog"},
  /* 旅する喫茶 食べログ3.50 */
  "koenji-tabisuru-kissa":{hours:"12:00〜20:00(L.O.19:00)", seats:"14席（カウンター4席、テーブル10席（2名掛け×3、4名掛け×1））", src:"tabelog"},
  /* ネルケン 食べログ3.50 */
  "koenji-nerken":{hours:"月・火・木・金・土・日 11:00〜18:00", closedDays:"水曜日", seats:"29席（カウンター3席、テーブル26席（4人掛け×6、2人掛け×1））", closedWeekdays:[3], src:"tabelog"},
  /* あげもんや 食べログ3.49 */
  "koenji-agemonya":{hours:"火・水・金・土・日 11:30〜15:00(L.O.14:30)、17:30〜21:00(L.O.21:00) / 木 11:30〜15:00(L.O.14:30)", closedDays:"月曜日", seats:"19席（カウンター3席、テーブル16席）", closedWeekdays:[1], src:"tabelog"},
  /* 煮干し中華そば 麺屋 銀星 高円寺 食べログ3.49 */
  "koenji-niboshi-ginsei":{hours:"月・火・水・木・金・土 11:30〜17:00、18:00〜02:00 / 日 11:30〜16:00", seats:"14席（カウンター4席、テーブル2人席×1、テーブル4人席×２）", src:"tabelog"},
  /* HATTIFNATT 食べログ3.48 */
  "koenji-hattifnatt":{hours:"火・水・木・金・土・日 12:00〜21:00(L.O.20:00)", closedDays:"月曜日", seats:"37席（カウンター2席、テーブル24席（2名掛け×2、4名掛け×5）ロフト席11席（3名用と8名用））", closedWeekdays:[1], src:"tabelog"},
  /* Yonchome Cafe 食べログ3.48 */
  "koenji-yonchome-cafe":{hours:"月・火・水・木・金 10:30〜23:00 / 土・日・祝 11:30〜23:00", closedDays:"無休", seats:"92席", src:"tabelog"},
  /* β STAND 食べログ3.48 */
  "koenji-beta-stand":{hours:"12:00〜21:00", seats:"8席", src:"tabelog"},
  /* TAW. 食べログ3.48 */
  "koenji-taw":{hours:"月〜日・祝 11:00〜18:00", closedDays:"不定休", seats:"19席（店内 カウンター4席、ベンチ14席（ミニテーブル7卓）、店外 テラス1席）", src:"tabelog"},
  /* キッチン 南海 高円寺店 食べログ3.48 */
  "koenji-kitchen-nankai":{hours:"月・火・木・金・土 11:30〜15:00(L.O.料理14:30)、17:00〜21:00(L.O.料理20:30)", closedDays:"日曜日・水曜日", seats:"18席（カウンター 4席，テーブル 4人席 x 1, 2人席 x 4, 1人席 x 2）", closedWeekdays:[0,3], src:"tabelog"},
  /* らーめん一蔵 食べログ3.47 */
  "koenji-ichizo":{hours:"月・火・水・木・金・土 11:00〜01:00 / 日 11:00〜23:00", seats:"12席（カウンターのみ）", src:"tabelog"},
  /* 食堂でべこ。 食べログ3.46 */
  "koenji-debeko":{hours:"月〜日・祝 11:30〜23:00(L.O.22:30)", seats:"21席（カウンター7席、2名様テーブル14席）", src:"tabelog"},
  /* COFFEE&BAKE achoo! 食べログ3.46 */
  "asagaya-coffee-bake-achoo":{hours:"月〜日・祝 08:00〜19:00", closedDays:"不定休", seats:"22席（カウンター10席テーブル8席ソファー4席）", src:"tabelog"},
  /* 魚肴 青天上 食べログ3.45 */
  "asagaya-seiten-jou":{hours:"12:00〜14:00、17:00〜00:00", closedDays:"不定休", seats:"40席", src:"tabelog"},
  /* ヤミイチ 高円寺 食べログ3.45 */
  "koenji-yamiichi":{hours:"月・火・水・木・祝後日 15:00〜02:00 / 金・祝前日 15:00〜05:00 / 土 12:00〜05:00 / 日・祝 12:00〜02:00", seats:"22席", src:"tabelog"},
  /* ぱんだ珈琲店 食べログ3.45 */
  "asagaya-panda-coffee":{hours:"月・木・金 11:00〜20:00(L.O.19:00) / 土・日 11:00〜19:00(L.O.18:00) / 祝 11:00〜18:00(L.O.17:00)", closedDays:"火曜日・水曜日", seats:"20席（テーブル20席）", closedWeekdays:[2,3], src:"tabelog"},
  /* 二代目げんこつ屋 阿佐ヶ谷南口店 食べログ3.45 */
  "asagaya-nidaime-genkotsuya":{hours:"11:00〜22:00", closedDays:"不定休", seats:"16席", src:"tabelog"},
  /* たまには焼肉 高円寺店 食べログ3.44 */
  "koenji-tamaniha-yakiniku":{hours:"月・火・水・木・金 17:00〜02:00(L.O.01:00) / 土・日・祝 12:00〜00:00(L.O.23:00)", seats:"50席（掘りごたつ席22席、テーブル席28席）", src:"tabelog"},
  /* らーめん処 くろ助 食べログ3.44 */
  "asagaya-kurosuke":{hours:"火・水・木・金・土 19:00〜06:00(L.O.05:45) / 日・祝 19:00〜00:00", closedDays:"月曜日", seats:"14席（カウンター6席 テーブル2卓）", closedWeekdays:[1], src:"tabelog"},
  /* ほるもんと焼肉屋 はせ川 食べログ3.43 */
  "asagaya-hasegawa":{hours:"月・火・水・木・金・祝 17:00〜23:00(L.O.22:00) / 土・日 16:00〜23:00(L.O.22:00)", seats:"32席（１Ｆ 10席 ２Ｆ 22席）", src:"tabelog"},
  /* 阿佐ケ谷ダイニングキッチン 食べログ3.42 */
  "asagaya-dining-kitchen":{hours:"10:00〜00:00", seats:"30席", src:"tabelog"},
  /* 西京漬け専門店 魚き食堂 食べログ3.42 */
  "koenji-saikyozuke":{hours:"月・火・水・木・金 11:30〜14:30、17:30〜21:30 / 土・日 11:30〜14:30、17:30〜21:00", seats:"10席", src:"tabelog"},
  /* 桂屋 食べログ3.40 */
  "koenji-katsuraya":{hours:"月・水・木・金・土・日・祝 11:00〜15:00(L.O.料理15:00)、17:00〜22:30(L.O.22:00)", closedDays:"火曜日", seats:"37席（1F 22席、B1F 15席）", closedWeekdays:[2], src:"tabelog"},
  /* 萬福本舗 食べログ3.39 */
  "asagaya-manpukuhonpo":{hours:"月・火・水・木・金 11:30〜14:00(L.O.14:00)、18:00〜21:30(L.O.21:30) / 土 11:30〜20:00(L.O.20:00)", closedDays:"日曜日", seats:"13席", closedWeekdays:[0], src:"tabelog"},
  /* レストラン ボンジョリーナ 高円寺 食べログ3.38 */
  "koenji-bonjolina":{hours:"月・水・木・金・土・日・祝 11:30〜15:00(L.O.料理13:30ドリンク14:30)、18:00〜23:00(L.O.料理21:30ドリンク22:30)", closedDays:"火曜日", seats:"14席（テーブル12席 カウンター2席）", closedWeekdays:[2], src:"tabelog"},
  /* Pizzeria SOL 食べログ3.38 */
  "koenji-pizzeria-sol":{hours:"月・木・金 11:30〜14:30(L.O.料理14:00)、17:30〜22:00(L.O.料理21:15ドリンク21:30) / 水 12:00〜14:30(L.O.料理14:00)、17:30〜22:00(L.O.料理21:15ドリンク21:30) / 土 11:30〜15:00(L.O.料理14:30)、17:30〜22:00(L.O.料理21:15ドリンク21:30) / 日・祝 11:30〜15:00(L.O.料理14:30)、17:30〜21:30(L.O.21:00)", closedDays:"火曜日", seats:"18席（ベビーカーは畳んで頂ける方のみ可）", closedWeekdays:[2], src:"tabelog"},
  /* 濃口背脂味噌らーめんと餃子 大福帳 食べログ3.38 */
  "koenji-abura-fukuho":{hours:"月・水・木・金・土・日 11:00〜15:00、17:00〜04:00", closedDays:"火曜日", seats:"12席（全席カウンター）", closedWeekdays:[2], src:"tabelog"},
  /* 鮨・酒・肴 杉玉 阿佐ヶ谷 食べログ3.37 */
  "asagaya-sugidama":{hours:"月・火・水・木・金 11:30〜14:30(L.O.14:00)、17:00〜23:00(L.O.22:30) / 土・日・祝 11:30〜14:30(L.O.14:00)、16:00〜23:00(L.O.22:30)", seats:"90席", src:"tabelog"},
  /* 定食のヤシロ 食べログ3.37 */
  "koenji-yashiro":{hours:"10:30〜21:30", seats:"17席（カウンター5席 テーブル３×4席）", src:"tabelog"},
  /* olla 食べログ3.37 */
  "asagaya-olla":{hours:"水・木 17:00〜22:30 / 金 17:00〜23:00 / 土 12:00〜23:00 / 日 12:00〜21:00", closedDays:"月曜日・火曜日", seats:"15席（カウンター７席、テーブル８席）", closedWeekdays:[1,2], src:"tabelog"},
  /* 吾ガ輩ハネコ 食べログ3.37 */
  "asagaya-waganahaneko":{hours:"火・金・土 11:30〜14:00 / 水・木 11:30〜14:00、17:00〜19:00", closedDays:"日曜日・月曜日", seats:"7席（カウンター席のみ7席）", closedWeekdays:[0,1], src:"tabelog"},
  /* 中華そば 東京ぐれっち 食べログ3.37 */
  "asagaya-tokyo-gurecchi":{hours:"火・水 11:45〜14:20、18:00〜00:15 / 金 18:00〜00:15 / 土・日 11:45〜14:20、18:00〜21:50", closedDays:"月曜日・木曜日、他不定休", seats:"6席", closedWeekdays:[1,4], src:"tabelog"},
  /* 中國名菜 孫 阿佐ヶ谷店 食べログ3.36 */
  "asagaya-chugoku-meisai-son":{hours:"11:30〜15:00、17:30〜22:00", closedDays:"不定休", seats:"42席（テーブル42隻）", src:"tabelog"},
  /* 私 食べログ3.35 */
  "koenji-watashi":{hours:"月〜日・祝 19:00〜02:00", closedDays:"無休", seats:"12席（カウンター6席、ソファー6席）", src:"tabelog"},
  /* 酒ノみつや 食べログ3.33 */
  "asagaya-sakenomitsuya":{hours:"月・火・水・木・金 12:00〜20:30 / 土・祝 11:30〜20:00 / 日 15:30〜19:30", closedDays:"不定休", seats:"（立飲み）", src:"tabelog"},
  /* フレスコ コーヒーロースターズ 食べログ3.33 */
  "asagaya-fresco-coffee":{hours:"月・火・木・金・祝 12:00〜20:00 / 土・日 10:30〜20:00", closedDays:"水曜日", seats:"11席（店内6席・テラス5席）", closedWeekdays:[3], src:"tabelog"},
  /* カフェ・ド・ウィング 食べログ3.31 */
  "asagaya-cafe-de-wing":{hours:"月・火・木・金・土・日 10:30〜20:00(L.O.19:00)", closedDays:"水曜日", closedWeekdays:[3], src:"tabelog"},
  /* 黒猫茶房 食べログ3.31 */
  "asagaya-kuroneko-sabo":{hours:"水・木・金 11:30〜20:00(L.O.19:00) / 土・日 11:30〜19:00(L.O.18:00)", closedDays:"月曜日・火曜日", seats:"12席（カウンター５席、小上がり７席）", closedWeekdays:[1,2], src:"tabelog"},
  /* サン・くれーぷ 食べログ3.31 */
  "koenji-san-crepe":{hours:"月・火・水・木・金 12:00〜22:30 / 土・日 11:30〜22:30", src:"tabelog"},
  /* 阿佐ヶ谷SOBA 食べログ3.30 */
  "asagaya-soba":{hours:"月・火・水・木 12:00〜21:00(L.O.20:00) / 金 12:00〜15:00(L.O.14:00)", closedDays:"日曜日・土曜日", seats:"8席（カウンター 8席）", closedWeekdays:[0,6], src:"tabelog"},
  /* CAFE&BAR RIGID 食べログ3.30 */
  "asagaya-cafe-bar-rigid":{hours:"月・木・金・土・日・祝 14:00〜01:00 / 火 21:00〜01:00 / 水 14:00〜21:00", closedDays:"不定休", seats:"16席（カウンター12席 ソファ4席）", src:"tabelog"},
  /* 名物やきとん やっちゃん 食べログ3.27 */
  "koenji-yacchan":{hours:"月・水・木・日・祝・祝後日 17:00〜00:00 / 金・土・祝前日 17:00〜01:00", closedDays:"火曜日", seats:"20席", closedWeekdays:[2], src:"tabelog"},
  /* パーラーエル 食べログ3.27 */
  "asagaya-parlor-l":{hours:"火・水・木・金 09:00〜19:00 / 土・日・祝 09:00〜17:00", closedDays:"月曜日", closedWeekdays:[1], src:"tabelog"},
  /* とりや鈴なり 食べログ3.26 */
  "asagaya-toriya-suzunari":{hours:"月・火・木・金・土 17:30〜23:00(L.O.料理22:00ドリンク22:30) / 日・祝 17:00〜22:00(L.O.料理21:00ドリンク21:30)", closedDays:"水曜日", seats:"12席", closedWeekdays:[3], src:"tabelog"},
  /* 清水屋 食べログ3.26 */
  "koenji-shimizuya":{hours:"10:00〜17:00", closedDays:"火曜日・水曜日", seats:"20席（椅子のみ）", closedWeekdays:[2,3], src:"tabelog"},
  /* ぶどうの木＆鎌倉座 阿佐谷トータルショップ 食べログ3.25 */
  "asagaya-budo-kamakuraza":{hours:"10:00〜18:00", closedDays:"不定休", src:"tabelog"},
  /* ダパイダン105 高円寺東京本店 食べログ3.24 */
  "koenji-dapaidan105":{hours:"火・水・木・金 11:00〜15:00(L.O.14:30)、17:00〜23:00(L.O.22:30) / 土・日・祝 11:00〜23:00(L.O.22:30)", closedDays:"月曜日", seats:"53席", closedWeekdays:[1], src:"tabelog"},
  /* 定食ハウス やなぎや 食べログ3.24 */
  "koenji-yanagiya":{hours:"月・火・水・木・金 11:30〜14:00、18:00〜22:00", closedDays:"日曜日・土曜日", seats:"8席（カウンター8席）", closedWeekdays:[0,6], src:"tabelog"},
  /* カフェ ド パティスリー チャコリ 食べログ3.24 */
  "koenji-patisserie-chacoli":{seats:"1席", src:"tabelog"},
  /* 門一 食べログ3.22 */
  "koenji-kadoichi":{hours:"月・火・木・金・土・日・祝 12:00〜14:30、18:00〜21:30", closedDays:"水曜日", closedWeekdays:[3], src:"tabelog"},
  /* ルスティカ菓子店 食べログ3.22 */
  "asagaya-rustica":{hours:"水・木・金・土・日 11:30〜18:00", closedDays:"月曜日・火曜日", closedWeekdays:[1,2], src:"tabelog"},
  /* Gatto Calico 食べログ3.21 */
  "asagaya-gatto-calico":{hours:"月・木・金・土・日・祝 12:00〜14:45(L.O.14:00)、17:00〜23:00(L.O.22:00)", closedDays:"火曜日・水曜日", seats:"22席（カウンター8席、テーブル席14）", closedWeekdays:[2,3], src:"tabelog"},
  /* 炭火焼きとん焼鶏 出陣 東高円寺店 食べログ3.21 */
  "koenji-shutsujin-higashi":{hours:"火・水・木・金・土・日 16:00〜00:00", closedDays:"月曜日", closedWeekdays:[1], src:"tabelog"},
  /* カキ氷 フウリン堂 食べログ3.21 */
  "koenji-kakigori-fuurindo":{hours:"10:00〜16:00", src:"tabelog"},
  /* パティスリー コポー 食べログ3.21 */
  "koenji-patisserie-copeau":{hours:"火・水・木・金・土・日 10:00〜21:00", closedDays:"月曜日", closedWeekdays:[1], src:"tabelog"},
  /* 藤野家 食べログ3.20 */
  "asagaya-fujinoya":{hours:"月・火・水・木・金・土 10:00〜14:30、17:00〜20:00", closedDays:"日曜日", closedWeekdays:[0], src:"tabelog"},
  /* だるま高円寺 食べログ3.20 */
  "koenji-daruma":{hours:"月・火・水・木 17:00〜02:00 / 金・土 17:00〜04:00 / 日・祝 15:00〜00:00", closedDays:"無休", seats:"37席", src:"tabelog"},
  /* ハオツァイ 食べログ3.20 */
  "asagaya-haochai":{hours:"月・火 11:30〜14:30(L.O.14:00) / 木・金・土・祝前日 11:30〜14:30(L.O.14:00)、17:00〜21:00(L.O.料理19:30ドリンク20:00)", closedDays:"日曜日・水曜日", seats:"16席（カウンター8席、テーブル8席）", closedWeekdays:[0,3], src:"tabelog"},
  /* ツキトクルミ 食べログ3.20 */
  "asagaya-tsukitokurumi":{hours:"火・水・木・金 12:00〜18:00 / 土・日 16:00〜21:30", closedDays:"月曜日、他不定休", closedWeekdays:[1], src:"tabelog"},
  /* 音鶏家 阿佐ヶ谷店 食べログ3.19 */
  "asagaya-otoriya":{hours:"月〜日・祝 18:00〜03:00(L.O.料理02:00ドリンク02:30)", closedDays:"無休", seats:"46席", src:"tabelog"},
  /* 名曲喫茶ヴィオロン 食べログ3.19 */
  "asagaya-violon":{closedDays:"火曜日", closedWeekdays:[2], src:"tabelog"},
  /* フロレスタ 高円寺店 食べログ3.19 */
  "koenji-florestas":{hours:"11:00〜19:30", seats:"11席", src:"tabelog"},
  /* サンセット クッキーズ ジャスミン 食べログ3.19 */
  "asagaya-sunset-cookies":{hours:"月・火・水・木・金・土 12:00〜18:00 / 日 09:00〜15:00", closedDays:"不定休", seats:"4席（2人掛けテーブル1卓、カウンター2席）", src:"tabelog"},
  /* ありん堂 食べログ3.19 */
  "asagaya-arindo":{hours:"月・火・水・金・土・日 09:00〜21:00", closedDays:"木曜日", seats:"（テイクアウト専門）", closedWeekdays:[4], src:"tabelog"},
  /* ドーナツショップ YOU AND 食べログ3.19 */
  "koenji-donut-you-and":{hours:"月・土・日 11:00〜17:00", closedDays:"火曜日・水曜日・木曜日・金曜日", closedWeekdays:[2,3,4,5], src:"tabelog"},
  /* Bar tail 食べログ3.18 */
  "koenji-bar-tail":{hours:"17:00〜04:00", seats:"26席（カウンター7席、テーブル席19席）", src:"tabelog"},
  /* パティスリー華 食べログ3.18 */
  "asagaya-patisserie-hana":{hours:"月・火・木・金・土・日 10:00〜19:00", closedDays:"水曜日、他不定休", seats:"10席（イートイン）", closedWeekdays:[3], src:"tabelog"},
  /* 福吉 食べログ3.18 */
  "asagaya-fukukichi":{hours:"12:00〜18:00", seats:"（テイクアウト専門）", src:"tabelog"},
  /* 周五郎 食べログ3.18 */
  "koenji-shugoro":{seats:"（テイクアウト専門）", src:"tabelog"},
  /* 一番 食べログ3.17 */
  "koenji-ichiban":{hours:"11:30〜14:00、17:00〜21:00", src:"tabelog"},
  /* Sake bar KoKoN 食べログ3.17 */
  "koenji-sake-kokon":{hours:"月・火・水・金・土・日・祝 18:00〜00:00(L.O.料理23:00ドリンク23:30)", closedDays:"木曜日", seats:"12席", closedWeekdays:[4], src:"tabelog"},
  /* ミスティー オーパース 食べログ3.17 */
  "asagaya-misty-opus":{hours:"月・火・水・木・金・土 11:00〜15:30、16:30〜00:00", closedDays:"日曜日", seats:"37席（1Ｆ：カウンター／テーブル ２Ｆ：半個室）", closedWeekdays:[0], src:"tabelog"},
  /* マスヤ 食べログ3.17 */
  "asagaya-masuya":{hours:"月・火・木・金・土・日 10:00〜17:00", closedDays:"水曜日", closedWeekdays:[3], src:"tabelog"},
  /* わらじや 食べログ3.16 */
  "koenji-warajiya":{closedDays:"水曜日・木曜日", closedWeekdays:[3,4], src:"tabelog"},
  /* サブスタンス 食べログ3.16 */
  "koenji-substance":{hours:"月・火・木・日 11:00〜02:00 / 金・土・祝 11:00〜03:00", closedDays:"水曜日", seats:"45席", closedWeekdays:[3], src:"tabelog"},
  /* ビア エンジン 食べログ3.15 */
  "koenji-bia-engine":{seats:"11席（予約制）", src:"tabelog"},
  /* Cinq jours 食べログ3.15 */
  "asagaya-cinq-jours":{hours:"火・水・木・金・土・日 12:00〜18:00", closedDays:"月曜日", seats:"（イートインなし）", closedWeekdays:[1], src:"tabelog"},
  /* 大ちゃん 食べログ3.14 */
  "koenji-daichan":{seats:"26席（テーブル席、カウンター席）", src:"tabelog"},
  /* 漬物BAR4328 参号店 食べログ3.14 */
  "koenji-tsukemono-bar":{hours:"月・水・木・金・土・祝 18:00〜05:00 / 火 18:00〜00:00 / 日 18:00〜02:00", src:"tabelog"},
  /* ハコ バー 食べログ3.14 */
  "koenji-hako-bar":{seats:"20席", src:"tabelog"},
  /* RUVI 食べログ3.14 */
  "asagaya-ruvi":{hours:"月・水・木 16:00〜23:00(L.O.22:00) / 金 16:00〜00:00(L.O.23:00) / 土 14:00〜00:00(L.O.23:00) / 日・祝 14:00〜23:00(L.O.22:00)", closedDays:"火曜日", seats:"21席", closedWeekdays:[2], src:"tabelog"},
  /* 三晴食堂 食べログ3.13 */
  "koenji-sansei-shokudo":{hours:"月・火・水・木・金・土 11:00〜20:00", closedDays:"日曜日", closedWeekdays:[0], src:"tabelog"},
  /* お食事 まるちゃん 食べログ3.13 */
  "koenji-maruchan":{hours:"火・水・金・土 11:30〜14:00、17:00〜22:00 / 木・日 17:00〜22:00", closedDays:"月曜日", closedWeekdays:[1], src:"tabelog"},
  /* つる福 阿佐ヶ谷店 食べログ3.12 */
  "asagaya-tsurufuku":{hours:"月・火・水・木 17:00〜23:30(L.O.料理22:30ドリンク23:00) / 金・祝前日 17:00〜00:00(L.O.料理23:00ドリンク23:30) / 土 15:00〜00:00(L.O.料理23:00ドリンク23:30) / 日・祝 15:00〜23:30(L.O.料理22:30ドリンク23:00)", seats:"50席", src:"tabelog"},
  /* スーパーサブ 食べログ3.12 */
  "asagaya-supersub":{hours:"火・水・木・金・土・日 17:00〜00:00", closedDays:"月曜日", seats:"20席（カウンター7席/テーブル9席/外カウンター）", closedWeekdays:[1], src:"tabelog"},
  /* ブラックマウンテン 食べログ3.12 */
  "koenji-black-mountain":{hours:"水・木・金・土・日 11:30〜21:00", closedDays:"月曜日・火曜日", seats:"（カフェ閉鎖ケーキのテイクアウトのみ営業）", closedWeekdays:[1,2], src:"tabelog"},
  /* 梅むら 食べログ3.12 */
  "koenji-umemura":{hours:"月・水・木・金・土・日 09:30〜19:00", closedDays:"火曜日", seats:"（テイクアウトのみ）", closedWeekdays:[2], src:"tabelog"},
  /* 阿佐ヶ谷ロフトA 食べログ3.11 */
  "asagaya-loft-a":{hours:"20:00〜00:00", src:"tabelog"},
  /* しろとくろ 食べログ3.11 */
  "koenji-shirotokuro":{hours:"12:00〜19:00", seats:"8席", src:"tabelog"},
  /* ボジョレー村 食べログ3.10 */
  "koenji-beaujolais-mura":{hours:"19:00〜23:30", seats:"6席（カウンター6席 【他、屋外テーブル6席、混雑時補助椅子使用あり】）", src:"tabelog"},
  /* とり成 食べログ3.09 */
  "asagaya-torinari":{hours:"月・火・水・木・金・土・祝 17:00〜23:00(L.O.料理22:00ドリンク22:30)", closedDays:"日曜日", seats:"30席（カウンター10席、テーブル20席(4人席5卓)）", closedWeekdays:[0], src:"tabelog"},
  /* 打ち薫る亭 食べログ3.09 */
  "asagaya-uchikaoritei":{hours:"火・水・木・金・土・祝 17:00〜00:00", closedDays:"日曜日・月曜日", seats:"17席（カウンター7席、テーブル10席）", closedWeekdays:[0,1], src:"tabelog"},
  /* ドギーブギー 食べログ3.09 */
  "koenji-doggie-boogie":{hours:"月・火・木・金・土・日 18:00〜03:00(L.O.01:30)", closedDays:"水曜日", seats:"32席（地下ですがかなり広めで天井も高くゆったりした空間です。4人席×3、3人席×2、2人席×4、1人席×1、他、となっ", closedWeekdays:[3], src:"tabelog"},
  /* アンダーザツリー 食べログ3.09 */
  "asagaya-under-the-tree":{hours:"月・火・水・木・日・祝 18:00〜00:00 / 金・土 19:00〜02:00", closedDays:"不定休", seats:"13席（立ち飲みスペースもあり（３名分））", src:"tabelog"},
  /* 食堂ばんちょう 食べログ3.09 */
  "asagaya-bancho-shokudo":{hours:"月・火・木・金・土・日 18:00〜23:00", closedDays:"水曜日", closedWeekdays:[3], src:"tabelog"},
  /* 和食堂 風土 食べログ3.09 */
  "koenji-washokudo-fudo":{seats:"8席（カウンター８席）", src:"tabelog"},
  /* MYNT 食べログ3.09 */
  "koenji-mynt":{seats:"8席", src:"tabelog"},
  /* 十話音 toi-own 食べログ3.09 */
  "koenji-toiown":{hours:"月・日 18:00〜23:00(L.O.料理22:30) / 火・水・木・金・土 11:00〜16:00(L.O.料理15:30)、18:00〜23:00(L.O.料理22:30)", seats:"12席", src:"tabelog"},
  /* サカバ ハレルヤ 食べログ3.08 */
  "asagaya-halleluya":{hours:"月・火・木・金・土・日・祝 17:30〜23:30(L.O.料理22:30ドリンク23:00)", closedDays:"水曜日", seats:"23席", closedWeekdays:[3], src:"tabelog"},
  /* 青卯餃子 食べログ3.08 */
  "asagaya-aoutei-gyoza":{hours:"火・水・木・金・土・日・祝 17:00〜02:00(L.O.料理01:00ドリンク01:30)", closedDays:"月曜日", seats:"8席（カウンター4席、座敷４席、その他立ち飲み4名）", closedWeekdays:[1], src:"tabelog"},
  /* アガリコ餃子楼 阿佐ヶ谷店 食べログ3.08 */
  "asagaya-agariko-gyozaro":{hours:"月 18:00〜00:00(L.O.料理23:00ドリンク23:30) / 火・水・木 18:00〜03:00(L.O.03:00) / 金 18:00〜04:00(L.O.03:00) / 土 17:00〜04:00(L.O.03:00) / 日 17:00〜03:00(L.O.03:00)", closedDays:"無休", seats:"24席（カウンター６席、テーブル席あり（掘りごたつテーブル、ノーマルテーブル席あり））", src:"tabelog"},
  /* 酒肴 ふふふ 食べログ3.08 */
  "asagaya-shukou-fufufu":{hours:"月・火・水・木・金・土 18:00〜00:00", closedDays:"日曜日", seats:"22席", closedWeekdays:[0], src:"tabelog"},
  /* クラヴィーア 食べログ3.08 */
  "asagaya-claviere":{hours:"月・火・水・木・金・土・祝 19:00〜00:00", closedDays:"日曜日", seats:"40席（窓際カウンター10席、バックバーカウンター10席、テーブル20席）", closedWeekdays:[0], src:"tabelog"},
  /* ビストロ ル・テロワール 阿佐ヶ谷 食べログ3.08 */
  "asagaya-le-terroir":{hours:"月・火・木・金・土・日 11:30〜15:00(L.O.14:30)、17:30〜22:00(L.O.21:30)", closedDays:"水曜日", seats:"12席（テーブル12席）", closedWeekdays:[3], src:"tabelog"},
  /* おむにまっ 食べログ3.08 */
  "koenji-omnimatt":{hours:"19:00〜05:00", seats:"50席（テーブル7卓）", src:"tabelog"},
  /* chawan ビーンズ阿佐ヶ谷店 食べログ3.08 */
  "asagaya-chawan-beans":{hours:"07:00〜22:00", seats:"32席（カウンター席11席、テーブル席21席）", src:"tabelog"},
  /* アンプール 食べログ3.08 */
  "koenji-ampoule":{hours:"月〜日・祝 20:00〜04:00", closedDays:"無休", seats:"30席（カウンター12席、テーブル18席）", src:"tabelog"},
  /* uroko 食べログ3.08 */
  "koenji-uroko":{hours:"月・火・水・金 16:00〜22:30(L.O.22:00) / 土・日・祝 14:00〜22:30(L.O.22:00)", closedDays:"木曜日", closedWeekdays:[4], src:"tabelog"},
  /* ゴールデンスランバー 食べログ3.08 */
  "asagaya-golden-slumber":{hours:"月・水・木・金・土・日 14:30〜17:00、17:30〜23:30(L.O.23:00)", closedDays:"火曜日", seats:"12席", closedWeekdays:[2], src:"tabelog"},
  /* SHEKEBA CURRY 食べログ3.07 */
  "asagaya-shekeba-curry":{hours:"金・土・日 12:00〜15:30(L.O.15:00)", closedDays:"月曜日・火曜日・水曜日・木曜日", seats:"10席（カウンター10席（キッチン対面5席、窓際5席））", closedWeekdays:[1,2,3,4], src:"tabelog"},
  /* bar dop 食べログ3.07 */
  "koenji-bar-dop":{hours:"19:00〜02:00", closedDays:"不定休", seats:"9席", src:"tabelog"},
  /* MOWA 食べログ3.07 */
  "koenji-mowa":{hours:"火・水・木・金 16:00〜23:00 / 土・日・祝 12:00〜23:00", closedDays:"月曜日", seats:"23席（カウンター5席、テーブル18席）", closedWeekdays:[1], src:"tabelog"},
  /* 木の蔵 食べログ3.07 */
  "asagaya-kinokura":{hours:"月・火・水・木・金・土 17:00〜23:00", closedDays:"日曜日", seats:"17席", closedWeekdays:[0], src:"tabelog"},
  /* あさがや食堂 食べログ3.07 */
  "asagaya-asagaya-shokudo":{hours:"月・火・木・金・土 11:00〜14:30(L.O.料理14:00)、17:00〜21:00(L.O.料理20:30)", closedDays:"日曜日・水曜日", closedWeekdays:[0,3], src:"tabelog"},
  /* A WINE HOUSE 食べログ3.07 */
  "koenji-a-wine-house":{hours:"火・水・木・金・土・日・祝 15:00〜00:00(L.O.料理23:00ドリンク23:30)", closedDays:"月曜日", seats:"18席（最大8名掛けの大きなテーブルはご相席の可能性もございます。）", closedWeekdays:[1], src:"tabelog"},
  /* 夜カフェ ポポット 食べログ3.07 */
  "asagaya-yoru-cafe-popotto":{seats:"7席（カウンター席のみ）", src:"tabelog"},
  /* Junction 食べログ3.06 */
  "koenji-junction":{hours:"月 12:00〜15:00、18:00〜00:00 / 火・木・金・土・日 18:00〜00:00", closedDays:"水曜日", seats:"14席（カウンター8席、スタンディング6席）", closedWeekdays:[3], src:"tabelog"},
  /* 炭火 焼とん 焼鳥 出陣 食べログ3.06 */
  "koenji-shutsujin":{hours:"火・水・木・金・土・日 16:00〜00:00(L.O.23:00)", closedDays:"月曜日", seats:"28席（1F / 12席（カウンター8席） 2F / 25席（貸切り可））", closedWeekdays:[1], src:"tabelog"},
  /* バー チコ 高円寺店 食べログ3.06 */
  "koenji-bar-chico":{hours:"18:00〜02:00", src:"tabelog"},
  /* ポスト 食べログ3.06 */
  "koenji-post":{seats:"12席", src:"tabelog"},
  /* ALBA 圓 食べログ3.06 */
  "koenji-alba-en":{hours:"19:00〜05:00(L.O.04:30)", seats:"29席（カウンター11席 テーブル18席）", src:"tabelog"},
  /* ジャズバー鈍我楽 食べログ3.06 */
  "asagaya-jazz-bar-donngaraku":{hours:"火・水・木・金・土・祝 19:00〜01:00", closedDays:"日曜日・月曜日", seats:"35席（カウンター11席テーブル4人席×48人席×1）", closedWeekdays:[0,1], src:"tabelog"},
  /* 暁 食べログ3.06 */
  "asagaya-akatsuki-bar":{closedDays:"木曜日", seats:"8席", closedWeekdays:[4], src:"tabelog"},
  /* 酒とあて 醸す 食べログ3.06 */
  "asagaya-sake-to-ate-kamosu":{hours:"月・水・木・金・土・日 18:00〜00:00", closedDays:"火曜日", seats:"8席", closedWeekdays:[2], src:"tabelog"},
  /* 1＋1 食べログ3.06 */
  "asagaya-ichi-plus-ichi":{hours:"月・火・木・金 17:00〜00:00(L.O.23:00) / 水 17:00〜00:00(L.O.料理23:00ドリンク23:56) / 土 15:00〜00:00(L.O.23:00) / 日 15:00〜01:00(L.O.23:00)", seats:"12席", src:"tabelog"},
  /* Dining Piatto 食べログ3.05 */
  "asagaya-dining-piatto":{hours:"月・火・水・木・金・土・祝 18:00〜00:00(L.O.料理23:00)", closedDays:"日曜日", seats:"13席（※貸し切りは8名以上）", closedWeekdays:[0], src:"tabelog"},
  /* もつ焼き Byron 食べログ3.05 */
  "koenji-motsuyaki-byron":{hours:"月〜日・祝 17:00〜23:00", seats:"33席", src:"tabelog"},
  /* 御食事 飯田 食べログ3.05 */
  "koenji-oshokuji-iida":{hours:"月・火・水・木・金 11:30〜14:00、17:30〜20:00", closedDays:"日曜日・土曜日", seats:"6席（カウンターのみ）", closedWeekdays:[0,6], src:"tabelog"},
  /* カクテルバー メリデ 食べログ3.05 */
  "asagaya-cocktail-bar-meride":{hours:"火・水・木・金・土・日・祝 17:00〜23:30", closedDays:"月曜日", seats:"10席（カウンター5席 テーブル5席）", closedWeekdays:[1], src:"tabelog"},
  /* ワインバー 菜環亭 食べログ3.05 */
  "asagaya-wine-bar-saikantei":{hours:"火・水・木・金 18:00〜23:00", closedDays:"日曜日・月曜日・土曜日", seats:"7席（カウンター7席。オープンテラス席も有ります。）", closedWeekdays:[0,1,6], src:"tabelog"},
  /* あまてらす 南阿佐ヶ谷 食べログ3.04 */
  "asagaya-amaterasu":{seats:"12席（カウンター5テーブル7）", src:"tabelog"},
  /* 中華料理 陳記酒場 食べログ3.04 */
  "koenji-chinki-sakaba":{hours:"月〜日・祝 11:00〜15:00、17:00〜23:00(L.O.料理22:30ドリンク22:50)", seats:"30席（テーブル席、テラス席）", src:"tabelog"},
  /* むらた 食べログ3.04 */
  "koenji-murata":{hours:"月・火・水・金・土 17:30〜23:00", closedDays:"日曜日・木曜日", closedWeekdays:[0,4], src:"tabelog"},
  /* 丸長食堂 食べログ3.03 */
  "koenji-marunaga":{seats:"14席（カウンター6席、4人掛けテーブル2卓）", src:"tabelog"},
  /* ごはん＆カフェ きみと 食べログ3.03 */
  "koenji-gohan-cafe-kimito":{hours:"土・日 12:00〜21:00", closedDays:"月曜日・火曜日・水曜日・木曜日・金曜日", closedWeekdays:[1,2,3,4,5], src:"tabelog"},
  /* かえる食堂 食べログ3.02 */
  "asagaya-kaerushokudo":{hours:"日 07:30〜12:00", closedDays:"月曜日・火曜日・水曜日・木曜日・金曜日・土曜日", seats:"6席（カウンター2席、テーブル4席）", closedWeekdays:[1,2,3,4,5,6], src:"tabelog"},
  /* マミーメンチ 食べログ3.02 */
  "asagaya-mammy-menchi":{hours:"月・火・水・木・金 11:30〜18:00", closedDays:"日曜日・土曜日", closedWeekdays:[0,6], src:"tabelog"},
  /* 小杉湯となり 食べログ3.02 */
  "koenji-kosugiyu-tonari":{hours:"月・火・水・金・土・日 09:00〜22:00", closedDays:"木曜日", closedWeekdays:[4], src:"tabelog"},
  /* おさかな定食屋さん 食べログ3.00 */
  "koenji-osakana-teishoku":{hours:"月・水・木・金・土・日 11:00〜15:00", closedDays:"火曜日", closedWeekdays:[2], src:"tabelog"}
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
