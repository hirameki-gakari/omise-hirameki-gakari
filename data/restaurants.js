/* =========================================================
   店舗データ(阿佐ヶ谷・高円寺エリア 61件)
   ※名称・ジャンル・エリアは公開情報を参照。距離や価格帯は目安。
     公開前に営業時間・電話番号・正確な住所は現地/公式情報で要確認。
   UIロジック(index.html側)から分離し、100〜500件規模に
   増やしても index.html が肥大化しない構成にしている。
   ========================================================= */
const BASE_RESTAURANTS = [
  {
    id:"asagaya-impronte", name:"リストランテ impronte", genre:"イタリアン", area:"阿佐ヶ谷", vibe:"dateSpecial",
    officialUrl:"https://www.impronte.info/", reservationUrl:"https://hitosara.com/0031695404/",
    priceRange:{dinner:[5000,7000]},
    companionFit:{solo:1,couple:5,family:1,friends:2,colleagues:2},
    moodFit:{hearty:1,drinking:3,indulgent:5,budget:1,stylish:4,calm:5,adventurous:2,familyFun:1,quick:1,lively:1},
    atmosphere:{quietLevel:5,casualLevel:2,specialLevel:5,luxuryLevel:4},
    quality:{costPerformance:2,foodQuality:5,volume:2},
    audienceFit:{dateFriendly:5,childrenFriendly:1,teenagerFriendly:1,largeGroupFriendly:1},
    tags:["手打ちパスタ","イタリアワイン","カウンター"],
    reasonSeeds:{
      calm:["カウンター中心の落ち着いた空間で、料理の香りごとゆっくり味わえそう"],
      indulgent:["手打ちパスタとソムリエ厳選のワインで、特別な一皿に"],
      couple:["ふたりの記念日にちょうどいい、静かな距離感"]
    }
  },
  {
    id:"asagaya-koshikawa", name:"越川", genre:"和食・居酒屋", area:"阿佐ヶ谷", vibe:"dateQuiet",
    officialUrl:null, reservationUrl:"https://tabelog.com/tokyo/A1319/A131905/13185386/",
    priceRange:{dinner:[4000,6000]},
    companionFit:{solo:2,couple:4,family:2,friends:4,colleagues:4},
    moodFit:{hearty:2,drinking:4,indulgent:3,budget:2,stylish:3,calm:4,adventurous:2,familyFun:1,quick:1,lively:3},
    atmosphere:{quietLevel:4,casualLevel:3,specialLevel:3,luxuryLevel:2},
    quality:{costPerformance:3,foodQuality:4,volume:2},
    audienceFit:{dateFriendly:4,childrenFriendly:1,teenagerFriendly:1,largeGroupFriendly:2},
    tags:["日本酒","駅近","大人の飲み"],
    reasonSeeds:{
      calm:["駅近なのに喧騒から少し離れた、落ち着いた空気"],
      drinking:["日本酒の品揃えがよく、じっくり飲める一軒"],
      couple:["ふたりで静かに飲み直すのにちょうどいい"]
    }
  },
  {
    id:"koenji-amane", name:"焼肉 あまね", genre:"焼肉", area:"高円寺", station:"高円寺", walkMinutes:2, vibe:"familyHearty",
    officialUrl:null, reservationUrl:"https://tabelog.com/tokyo/A1319/A131904/13134688/",
    priceRange:{dinner:[3000,4500]},
    companionFit:{solo:1,couple:2,family:4,friends:4,colleagues:3},
    moodFit:{hearty:5,drinking:3,indulgent:2,budget:4,stylish:1,calm:1,adventurous:1,familyFun:4,quick:2,lively:4},
    atmosphere:{quietLevel:1,casualLevel:5,specialLevel:1,luxuryLevel:1},
    quality:{costPerformance:5,foodQuality:4,volume:5},
    audienceFit:{dateFriendly:2,childrenFriendly:3,teenagerFriendly:5,largeGroupFriendly:4},
    tags:["黒毛和牛","高円寺駅徒歩2分","コスパ"],
    reasonSeeds:{
      hearty:["黒毛和牛カルビがしっかり食べられるボリューム"],
      familyFun:["席がゆったりめで、家族でも気兼ねなく囲める"],
      family:["育ち盛りがいても満足できる肉量"]
    }
  },
  {
    id:"koenji-nikuichi", name:"肉問屋直営 焼肉 肉一 高円寺店", genre:"焼肉", area:"高円寺", vibe:"familyHearty",
    officialUrl:"https://www.ensyouji.co.jp/shop/nikuichi-koenji/", reservationUrl:"https://www.hotpepper.jp/strJ000727122/",
    priceRange:{dinner:[2500,3800]},
    companionFit:{solo:1,couple:2,family:4,friends:4,colleagues:3},
    moodFit:{hearty:5,drinking:2,indulgent:1,budget:5,stylish:1,calm:1,adventurous:1,familyFun:4,quick:2,lively:4},
    atmosphere:{quietLevel:2,casualLevel:5,specialLevel:1,luxuryLevel:1},
    quality:{costPerformance:5,foodQuality:3,volume:5},
    audienceFit:{dateFriendly:1,childrenFriendly:3,teenagerFriendly:5,largeGroupFriendly:4},
    tags:["肉問屋直営","お座敷","超コスパ"],
    reasonSeeds:{
      budget:["肉問屋直営だから、質のいい肉がこの価格で食べられる"],
      hearty:["お座敷で七輪を囲んで、がっつり肉尽くし"],
      family:["お座敷だから、子ども連れでも足を崩せて楽"]
    }
  },
  {
    id:"koenji-fujikawa", name:"富士川食堂", genre:"定食", area:"高円寺", vibe:"soloQuick",
    priceRange:{dinner:[500,800]},
    companionFit:{solo:5,couple:2,family:2,friends:2,colleagues:2},
    moodFit:{hearty:2,drinking:1,indulgent:1,budget:5,stylish:1,calm:2,adventurous:1,familyFun:1,quick:5,lively:2},
    atmosphere:{quietLevel:2,casualLevel:5,specialLevel:1,luxuryLevel:1},
    quality:{costPerformance:5,foodQuality:3,volume:3},
    audienceFit:{dateFriendly:1,childrenFriendly:2,teenagerFriendly:2,largeGroupFriendly:1},
    tags:["カウンター8席","550円定食","ひとり飯"],
    reasonSeeds:{
      quick:["カウンターだけの小さな食堂で、注文してすぐ出てくる"],
      budget:["定食が軒並み550円前後、ふらっと入れる価格"],
      solo:["ひとりでもカウンターにすっと座れる空気感"]
    }
  },
  {
    id:"koenji-mensaibou", name:"麺彩房", genre:"ラーメン", area:"高円寺", vibe:"familyHearty",
    priceRange:{dinner:[900,1400]},
    companionFit:{solo:3,couple:2,family:4,friends:2,colleagues:2},
    moodFit:{hearty:3,drinking:1,indulgent:1,budget:4,stylish:1,calm:2,adventurous:1,familyFun:4,quick:4,lively:3},
    atmosphere:{quietLevel:2,casualLevel:4,specialLevel:1,luxuryLevel:1},
    quality:{costPerformance:4,foodQuality:3,volume:3},
    audienceFit:{dateFriendly:1,childrenFriendly:4,teenagerFriendly:3,largeGroupFriendly:2},
    tags:["掘りごたつ","あっさりスープ","子連れ歓迎"],
    reasonSeeds:{
      familyFun:["掘りごたつの座敷だから、子どもがいても座りやすい"],
      family:["あっさりめのスープで、子どもも食べやすい味"],
      quick:["さっと食べてさっと出られる気軽さ"]
    }
  },
  {
    id:"asagaya-gift", name:"Gift食堂 阿佐ヶ谷", genre:"日本酒バル", area:"阿佐ヶ谷", vibe:"stylishDrink",
    priceRange:{dinner:[3500,5000]},
    companionFit:{solo:2,couple:3,family:1,friends:5,colleagues:3},
    moodFit:{hearty:2,drinking:5,indulgent:2,budget:2,stylish:4,calm:2,adventurous:3,familyFun:1,quick:1,lively:4},
    atmosphere:{quietLevel:2,casualLevel:4,specialLevel:3,luxuryLevel:2},
    quality:{costPerformance:3,foodQuality:4,volume:2},
    audienceFit:{dateFriendly:3,childrenFriendly:1,teenagerFriendly:1,largeGroupFriendly:3},
    tags:["日本酒バル","オリジナルカクテル","野菜料理"],
    reasonSeeds:{
      drinking:["日本酒とオリジナルカクテルの両方が楽しめる"],
      stylish:["野菜料理が充実していて、飲みながらでも罪悪感が少ない"],
      friends:["わいわい飲むのにちょうどいい賑わい感"]
    }
  },
  {
    id:"koenji-fukuraimon", name:"福来門", genre:"中華", area:"高円寺", vibe:"groupCasual",
    priceRange:{dinner:[3000,4500]},
    companionFit:{solo:2,couple:2,family:3,friends:5,colleagues:4},
    moodFit:{hearty:4,drinking:3,indulgent:1,budget:4,stylish:1,calm:1,adventurous:2,familyFun:3,quick:2,lively:5},
    atmosphere:{quietLevel:1,casualLevel:5,specialLevel:1,luxuryLevel:1},
    quality:{costPerformance:5,foodQuality:3,volume:4},
    audienceFit:{dateFriendly:1,childrenFriendly:3,teenagerFriendly:4,largeGroupFriendly:5},
    tags:["食べ放題プラン","大皿中華","南口すぐ"],
    reasonSeeds:{
      hearty:["麻婆や餃子など、大皿でがっつりシェアできる"],
      friends:["食べ放題プランもあって、わいわい飲み食いするのに向いてる"],
      budget:["食べ放題プランもあるから、コスパも安心"]
    }
  },
  {
    id:"asagaya-kotaro", name:"こたろう", genre:"海鮮居酒屋", area:"南阿佐ヶ谷", vibe:"groupCasual",
    officialUrl:null, reservationUrl:"https://tabelog.com/tokyo/A1319/A131905/13183352/",
    priceRange:{dinner:[4000,5500]},
    companionFit:{solo:3,couple:3,family:2,friends:5,colleagues:4},
    moodFit:{hearty:3,drinking:5,indulgent:3,budget:2,stylish:2,calm:2,adventurous:3,familyFun:1,quick:1,lively:4},
    atmosphere:{quietLevel:2,casualLevel:4,specialLevel:2,luxuryLevel:2},
    quality:{costPerformance:3,foodQuality:5,volume:3},
    audienceFit:{dateFriendly:2,childrenFriendly:1,teenagerFriendly:2,largeGroupFriendly:3},
    tags:["新鮮な海鮮","もつ","行列必至"],
    reasonSeeds:{
      drinking:["海鮮とモツの両方があって、飲みが長引いても飽きない"],
      adventurous:["行列ができる人気店。まだなら狙い目"],
      friends:["賑やかな店内で、盛り上がるのにちょうどいい"]
    }
  },
  {
    id:"asagaya-nui", name:"nui", genre:"バル(創作・ワイン)", area:"阿佐ヶ谷", vibe:"adventurousUnique",
    priceRange:{dinner:[4000,6000]},
    companionFit:{solo:3,couple:4,family:1,friends:5,colleagues:3},
    moodFit:{hearty:2,drinking:4,indulgent:3,budget:2,stylish:5,calm:3,adventurous:4,familyFun:1,quick:1,lively:3},
    atmosphere:{quietLevel:3,casualLevel:3,specialLevel:4,luxuryLevel:3},
    quality:{costPerformance:3,foodQuality:4,volume:2},
    audienceFit:{dateFriendly:4,childrenFriendly:1,teenagerFriendly:1,largeGroupFriendly:2},
    tags:["隠れ家","路地裏","ワイン・クラフトビール"],
    reasonSeeds:{
      stylish:["路地裏の隠れ家で、木の温もりを感じる落ち着いた内装"],
      adventurous:["シェフが世界を旅して得た発想の一皿、いつもと違う気分に"],
      friends:["少人数でひっそり集まりたい日にちょうどいい"]
    }
  },
  {
    id:"asagaya-lamaisoncourtine", name:"ラ・メゾン・クルティーヌ", genre:"フレンチ", area:"阿佐ヶ谷", station:"阿佐ヶ谷", walkMinutes:1, vibe:"dateSpecial",
    officialUrl:"https://www.courtine.jp/", reservationUrl:"https://restaurant.ikyu.com/113821",
    priceRange:{dinner:[7000,10000]},
    companionFit:{solo:1,couple:5,family:1,friends:2,colleagues:2},
    moodFit:{hearty:1,drinking:2,indulgent:5,budget:1,stylish:4,calm:4,adventurous:2,familyFun:1,quick:1,lively:1},
    atmosphere:{quietLevel:4,casualLevel:2,specialLevel:5,luxuryLevel:5},
    quality:{costPerformance:2,foodQuality:5,volume:2},
    audienceFit:{dateFriendly:5,childrenFriendly:1,teenagerFriendly:1,largeGroupFriendly:1},
    tags:["本格フレンチ","記念日","駅徒歩1分"],
    reasonSeeds:{
      indulgent:["パリの一つ星で腕を磨いたシェフの、シンプルで洗練された一皿"],
      couple:["特別な日に、駅からすぐという安心感もありがたい"],
      stylish:["本格フレンチらしい、背筋の伸びる特別感"]
    }
  }
];

/* =========================================================
   追加店舗(第2弾: 居酒屋・イタリアン・ラーメン・和食 50件)
   ※食べログ等のランキング情報をもとに実在店名を採用。
     「ひらめき用属性」は個々に深く調査するのではなく、
     店の性格を8つの「vibe」に分類し、その基準値を割り当てる
     方式で付与(手作業でのキュレーションを、増やしやすい形に
     したもの)。営業時間・電話番号・正確な住所は含めていないため、
     公開前に現地/公式情報での確認が必要。

   ── 店舗を追加する手順(テンプレート) ──
   1. 食べログ/Retty等のランキングで実在店名・ジャンル・価格帯を調べる
   2. 下記8種類の vibe から性格が近いものを1つ選ぶ
   3. reasonSeeds を2〜3件、気分キー or 誰とキーで書く
   4. id が他と重複していないか確認する
   ========================================================= */
const VIBES = {
  dateQuiet:{
    companionFit:{solo:2,couple:5,family:1,friends:2,colleagues:2},
    moodFit:{hearty:1,drinking:3,indulgent:4,budget:1,stylish:3,calm:5,adventurous:2,familyFun:1,quick:1,lively:2},
    atmosphere:{quietLevel:5,casualLevel:2,specialLevel:3,luxuryLevel:2},
    quality:{costPerformance:2,foodQuality:4,volume:2},
    audienceFit:{dateFriendly:5,childrenFriendly:1,teenagerFriendly:1,largeGroupFriendly:1}
  },
  dateSpecial:{
    companionFit:{solo:1,couple:5,family:1,friends:2,colleagues:2},
    moodFit:{hearty:1,drinking:2,indulgent:5,budget:1,stylish:4,calm:4,adventurous:2,familyFun:1,quick:1,lively:1},
    atmosphere:{quietLevel:4,casualLevel:2,specialLevel:5,luxuryLevel:5},
    quality:{costPerformance:1,foodQuality:5,volume:2},
    audienceFit:{dateFriendly:5,childrenFriendly:1,teenagerFriendly:1,largeGroupFriendly:1}
  },
  groupCasual:{
    companionFit:{solo:2,couple:2,family:2,friends:5,colleagues:4},
    moodFit:{hearty:3,drinking:5,indulgent:1,budget:3,stylish:2,calm:1,adventurous:2,familyFun:2,quick:1,lively:5},
    atmosphere:{quietLevel:1,casualLevel:5,specialLevel:1,luxuryLevel:1},
    quality:{costPerformance:3,foodQuality:3,volume:3},
    audienceFit:{dateFriendly:1,childrenFriendly:2,teenagerFriendly:3,largeGroupFriendly:5}
  },
  soloQuick:{
    companionFit:{solo:5,couple:1,family:1,friends:2,colleagues:2},
    moodFit:{hearty:2,drinking:1,indulgent:1,budget:4,stylish:1,calm:2,adventurous:2,familyFun:1,quick:5,lively:2},
    atmosphere:{quietLevel:3,casualLevel:5,specialLevel:1,luxuryLevel:1},
    quality:{costPerformance:4,foodQuality:3,volume:2},
    audienceFit:{dateFriendly:1,childrenFriendly:2,teenagerFriendly:2,largeGroupFriendly:1}
  },
  familyHearty:{
    companionFit:{solo:1,couple:2,family:5,friends:3,colleagues:2},
    moodFit:{hearty:4,drinking:2,indulgent:1,budget:4,stylish:1,calm:1,adventurous:1,familyFun:5,quick:2,lively:3},
    atmosphere:{quietLevel:2,casualLevel:5,specialLevel:1,luxuryLevel:1},
    quality:{costPerformance:4,foodQuality:3,volume:4},
    audienceFit:{dateFriendly:1,childrenFriendly:5,teenagerFriendly:4,largeGroupFriendly:4}
  },
  budgetCasual:{
    companionFit:{solo:4,couple:2,family:3,friends:4,colleagues:3},
    moodFit:{hearty:3,drinking:2,indulgent:1,budget:5,stylish:1,calm:2,adventurous:1,familyFun:2,quick:3,lively:3},
    atmosphere:{quietLevel:2,casualLevel:5,specialLevel:1,luxuryLevel:1},
    quality:{costPerformance:5,foodQuality:3,volume:3},
    audienceFit:{dateFriendly:1,childrenFriendly:3,teenagerFriendly:3,largeGroupFriendly:2}
  },
  adventurousUnique:{
    companionFit:{solo:3,couple:3,family:1,friends:5,colleagues:3},
    moodFit:{hearty:2,drinking:4,indulgent:2,budget:2,stylish:3,calm:2,adventurous:5,familyFun:1,quick:1,lively:3},
    atmosphere:{quietLevel:2,casualLevel:4,specialLevel:3,luxuryLevel:2},
    quality:{costPerformance:3,foodQuality:4,volume:2},
    audienceFit:{dateFriendly:2,childrenFriendly:1,teenagerFriendly:2,largeGroupFriendly:3}
  },
  stylishDrink:{
    companionFit:{solo:2,couple:4,family:1,friends:5,colleagues:3},
    moodFit:{hearty:1,drinking:5,indulgent:3,budget:2,stylish:5,calm:3,adventurous:3,familyFun:1,quick:1,lively:4},
    atmosphere:{quietLevel:3,casualLevel:3,specialLevel:4,luxuryLevel:3},
    quality:{costPerformance:2,foodQuality:4,volume:2},
    audienceFit:{dateFriendly:4,childrenFriendly:1,teenagerFriendly:1,largeGroupFriendly:2}
  },
  soloDrink:{
    // 「ひとりで飲みたい」専用(立ち飲み・カウンターバー等)。
    // soloQuickは「サクッと系」用でdrinking評価が低いため、
    // 「ひとり×飲みたい」ではgroupCasual等に負けてしまう問題があった。
    companionFit:{solo:5,couple:2,family:1,friends:2,colleagues:2},
    moodFit:{hearty:1,drinking:5,indulgent:2,budget:4,stylish:2,calm:3,adventurous:2,familyFun:1,quick:3,lively:2},
    atmosphere:{quietLevel:3,casualLevel:4,specialLevel:1,luxuryLevel:1},
    quality:{costPerformance:4,foodQuality:3,volume:1},
    audienceFit:{dateFriendly:1,childrenFriendly:1,teenagerFriendly:1,largeGroupFriendly:1}
  }
};

function buildRestaurant(row){
  const v = VIBES[row.vibe];
  return {
    id:row.id, name:row.name, genre:row.genre, area:row.area,
    station:row.station, walkMinutes:row.walkMinutes,
    priceRange:{dinner:row.price},
    vibe:row.vibe,
    companionFit:Object.assign({}, v.companionFit),
    moodFit:Object.assign({}, v.moodFit),
    atmosphere:Object.assign({}, v.atmosphere),
    quality:Object.assign({}, v.quality),
    audienceFit:Object.assign({}, v.audienceFit),
    tags:row.tags,
    reasonSeeds:row.reasonSeeds,
    // 収益化・写真拡張用(現状は全店nullで挙動に影響なし)
    image:row.image || null,
    officialUrl:row.officialUrl || null,
    reservationUrl:row.reservationUrl || null,
    notice:row.notice || null
  };
}

/* =========================================================
   vibe別の補足フレーズ(店ごとのreasonSeedsが少ない場合に
   buildReasons()が自動で補って3つに底上げする)
   ========================================================= */
const VIBE_FILLERS = {
  dateQuiet: [
    "騒がしすぎない空間で、会話に集中できそう",
    "ふたりでゆっくり過ごしたい夜に向いている",
    "落ち着いた雰囲気で、長居しても疲れにくい"
  ],
  dateSpecial: [
    "特別な日の主役にふさわしい、少し背伸びした一軒",
    "料理にじっくり向き合いたい夜に合う",
    "記念日や大事な用事にも使える格式がある"
  ],
  groupCasual: [
    "気取らず、みんなでわいわい過ごせる雰囲気",
    "取り分けやすいメニューが多く、大人数にも向く",
    "多少にぎやかにしても浮かない、懐の深さがある"
  ],
  soloQuick: [
    "ひとりでもすっと入れる、身構えなくていい空気感",
    "長居せずさっと済ませたい時にちょうどいい",
    "カウンターなどひとり利用がしやすい作り"
  ],
  familyHearty: [
    "ボリュームがあり、育ち盛りがいても満足しやすい",
    "気取らない雰囲気で、子ども連れでも入りやすい",
    "みんなでしっかり食べたい日に頼れる一軒"
  ],
  budgetCasual: [
    "価格が控えめで、気負わず選びやすい",
    "普段使いにちょうどいい、気取らない一軒",
    "財布を気にせず、もう一品頼みやすい"
  ],
  adventurousUnique: [
    "他ではあまり見かけない個性があり、話のネタにもなる",
    "いつもと違う一軒を試したい日にちょうどいい",
    "一度行くと印象に残るタイプの店"
  ],
  stylishDrink: [
    "少し気分を上げたい夜に合う、こだわりの空間",
    "お酒の種類や見せ方にこだわりが感じられる",
    "写真映えも意識された、今どきの空間"
  ],
  soloDrink: [
    "ひとりでもすっと入れる、カウンター中心の作り",
    "隣を気にせず、自分のペースで飲める空気感",
    "長居しすぎず、ふらっと一杯だけでも自然"
  ]
};

const NEW_ROWS = [
  // ── イタリアン(13) ──
  {id:"koenji-aopi", name:"Aopi", genre:"イタリアン(パスタ)", area:"高円寺", price:[4000,5000], vibe:"budgetCasual",
    tags:["パスタ専門","ランチも人気"], reasonSeeds:{budget:["パスタ専門店らしい、気取らない一皿"], friends:["ふらっと入れる気軽さ"], quick:["ランチ帯の実績もあるから、提供も早そう"]}},
  {id:"koenji-bonjolina", name:"レストラン ボンジョリーナ 高円寺", genre:"イタリアン", area:"高円寺", price:[4000,5000], vibe:"dateQuiet",
    tags:["コース仕立て","落ち着いた雰囲気"], reasonSeeds:{calm:["コースでゆったり過ごせる落ち着いた店内"], couple:["ふたりの記念日にも使える佇まい"], indulgent:["コース仕立てだから、特別な一皿がゆっくり続く"]}},
  {id:"koenji-granpa", name:"グラン・パ 東高円寺店", genre:"イタリアン(パスタ)", area:"高円寺", price:[2000,3000], vibe:"budgetCasual",
    tags:["パスタ","手頃"], reasonSeeds:{budget:["ディナーでも2000円台からと手が届きやすい"], friends:["パスタの種類が豊富で、何人で行っても選びやすい"], solo:["ひとりでふらっと寄れる価格帯"]}},
  {id:"koenji-pizzeria-sol", name:"Pizzeria SOL", genre:"ピザ専門", area:"高円寺", price:[5000,6000], vibe:"groupCasual",
    tags:["ピザ専門","シェアしやすい"], reasonSeeds:{friends:["ピザを何枚も頼んでシェアするのが楽しい"], drinking:["ピザ片手にお酒も進みそう"], colleagues:["取り分けやすいピザは、職場帰りの一軒にも"]}},
  {id:"koenji-dilettante", name:"dilettante", genre:"イタリアン", area:"高円寺", price:[5000,6000], vibe:"dateSpecial",
    officialUrl:"https://dilettante.owst.jp/", reservationUrl:"https://www.hotpepper.jp/strJ003648480/",
    tags:["ディナー限定","特別感"], reasonSeeds:{indulgent:["ディナーだけの特別な時間に集中できる一軒"], couple:["ディナーのみの営業だから、夜の時間に集中して向き合える"], stylish:["派手すぎない、大人の店構え"]}},
  {id:"koenji-kamatetsu", name:"ピザ&ステーキ酒場 窯鉄", genre:"ピザ・ステーキ酒場", area:"高円寺", price:[2000,3000], vibe:"groupCasual",
    officialUrl:null, reservationUrl:"https://tabelog.com/tokyo/A1319/A131904/13255138/",
    tags:["ピザ","ステーキ","酒場"], reasonSeeds:{drinking:["ピザとステーキ、両方つまみに飲める気軽さ"], friends:["ピザとステーキ、好みが違う友達同士でも満足しやすい"], budget:["酒場価格で気軽に楽しめる"]}},
  {id:"koenji-junction", name:"Junction", genre:"イタリアン", area:"高円寺", price:[5000,6000], vibe:"stylishDrink",
    tags:["ディナー限定","おしゃれ"], reasonSeeds:{stylish:["夜だけの営業で落ち着いた大人の時間"], couple:["夜だけの静かな時間、ふたりで過ごすのにも"], drinking:["お酒に合わせた一皿が期待できる"]}},
  {id:"koenji-bocca-lupo", name:"トラットリア ボッカ・ルーポ", genre:"イタリアン", area:"高円寺", price:[10000,15000], vibe:"dateSpecial",
    officialUrl:"https://www.bocca-al-lupo.com/", reservationUrl:"https://www.hotpepper.jp/strJ000641755/",
    tags:["本格トラットリア","記念日向け"], reasonSeeds:{indulgent:["本格イタリアンをコースでじっくり味わう特別な夜に"], couple:["特別な記念日の主役になれる一軒"], stylish:["本格トラットリアらしい、洗練された雰囲気"]}},
  {id:"asagaya-gatto-calico", name:"Gatto Calico", genre:"イタリアン", area:"阿佐ヶ谷", price:[5000,6000], vibe:"dateQuiet",
    tags:["ディナー中心","落ち着いた空間"], reasonSeeds:{calm:["派手すぎない、ふたりで話しやすい空間"], couple:["ディナー中心の営業で、夜にじっくり向き合える"], indulgent:["派手さより、料理の質で満足させてくれそう"]}},
  {id:"asagaya-lupi32", name:"Lupi32", genre:"薪窯ピザ", area:"阿佐ヶ谷", price:[10000,15000], vibe:"dateSpecial",
    officialUrl:"http://www.lupi32.com/", reservationUrl:"https://hitosara.com/0032033320/",
    tags:["薪窯ピザ","特別な一軒"], reasonSeeds:{indulgent:["薪窯で焼くピザを、特別な夜のメインに"], couple:["特別な日の主役にしたい、薪窯ピザの一軒"], stylish:["薪窯という単語だけで、少し特別な気分に"]}},
  {id:"asagaya-cafe-italian", name:"阿佐ヶ谷カフェ", genre:"イタリアン", area:"阿佐ヶ谷", price:[6000,8000], vibe:"dateQuiet",
    tags:["落ち着いた空間","カジュアルながら上質"], reasonSeeds:{calm:["名前は気軽でも、中は落ち着いた大人の空間"], couple:["カフェのような気軽さと、落ち着いた大人の空気を両方持つ"], indulgent:["名前に反して、ゆっくり食事を楽しめる作り"]}},
  {id:"asagaya-ishigamaya", name:"石窯や", genre:"ピザ専門", area:"阿佐ヶ谷", price:[3000,4000], vibe:"groupCasual",
    tags:["石窯ピザ","リーズナブル"], reasonSeeds:{budget:["石窯ピザがこの価格帯で楽しめる"], friends:["石窯ピザを何枚か頼んで、みんなでシェアするのに向いてる"], quick:["ピザ専門店らしい提供の早さも期待できる"]}},
  {id:"asagaya-dining-piatto", name:"Dining Piatto", genre:"イタリアン", area:"阿佐ヶ谷", price:[3000,4000], vibe:"budgetCasual",
    tags:["ランチが人気","気軽なイタリアン"], reasonSeeds:{friends:["気取らずに入れる、普段使いのイタリアン"], budget:["ランチの評価が高いから、コスパも安心"], solo:["ひとりでのふらっと利用もしやすそう"]}},

  // ── ラーメン(13) ──
  {id:"asagaya-daishi-to-men-yuei", name:"だしと麺 遊泳", genre:"ラーメン(百名店)", area:"阿佐ヶ谷", price:[900,1500], vibe:"soloQuick",
    tags:["ラーメン百名店","太ちぢれ麺"], reasonSeeds:{quick:["百名店の一杯を、さっと食べてさっと出られる"], solo:["ひとりでふらっと入りやすいラーメン店"], adventurous:["ラーメン百名店に選ばれた、こだわりの一杯"]}},
  {id:"asagaya-yamatoki", name:"らぁめん 山と樹", genre:"ラーメン(百名店)", area:"阿佐ヶ谷", price:[1000,2000], vibe:"soloQuick",
    tags:["ラーメン百名店"], reasonSeeds:{quick:["行列ができる百名店の一杯を手早く"], solo:["ひとりでも並んででも食べたい、百名店の実力"], adventurous:["行列ができる名店を、まだ知らなければ狙い目"]}},
  {id:"asagaya-yokohama-iekei", name:"横濱ラーメン あさが家 本店", genre:"家系ラーメン", area:"阿佐ヶ谷", price:[1000,2000], vibe:"familyHearty",
    tags:["家系","ボリューム"], reasonSeeds:{hearty:["家系らしいがっつりスープとボリューム"], family:["がっつりスープと麺量で、育ち盛りにも満足感"], budget:["家系らしい、コスパのいいボリューム"]}},
  {id:"asagaya-mukan", name:"無冠 阿佐ヶ谷", genre:"ラーメン(牡蠣・イカ墨)", area:"阿佐ヶ谷", price:[1000,2000], vibe:"adventurousUnique",
    tags:["牡蠣・イカ墨系","個性派"], reasonSeeds:{adventurous:["牡蠣やイカ墨を使った、他にはない一杯"], friends:["珍しい一杯を友達と話のネタにしながら"], stylish:["ひと工夫あるスープで、いつもと違う気分に"]}},
  {id:"asagaya-mugi-to-te", name:"麦と手", genre:"台湾まぜそば", area:"阿佐ヶ谷", price:[1000,2000], vibe:"adventurousUnique",
    tags:["台湾まぜそば","個性派"], reasonSeeds:{adventurous:["いつものラーメンとは違う、まぜそばの気分に"], friends:["まぜそばは取り分けなくてもみんなで盛り上がれる"], quick:["さっと混ぜてすぐ食べられる手軽さ"]}},
  {id:"asagaya-hopeken", name:"阿佐谷ホープ軒", genre:"ラーメン(こってり)", area:"阿佐ヶ谷", price:[700,999], vibe:"budgetCasual",
    tags:["こってり系","安め"], reasonSeeds:{budget:["こってりで満足感があるのに財布にやさしい"], hearty:["こってり系らしい、しっかりした満足感"], solo:["ひとりでさっと入れる昔ながらの一軒"]}},
  {id:"koenji-tomochin", name:"高円寺ともちんラーメン", genre:"ラーメン(24時間営業)", area:"高円寺", price:[700,999], vibe:"soloQuick",
    tags:["24時間営業","深夜もOK"], reasonSeeds:{quick:["24時間営業だから、思い立ったらすぐ行ける"], solo:["24時間営業だから、ひとりでもタイミングを選ばない"], budget:["深夜でも財布にやさしい価格帯"]}},
  {id:"koenji-barikote", name:"博多ラーメン ばりこて", genre:"博多とんこつラーメン", area:"高円寺", price:[700,999], vibe:"budgetCasual",
    tags:["濃厚豚骨","安め"], reasonSeeds:{budget:["濃厚な豚骨がこの価格で楽しめる"], hearty:["濃厚豚骨でしっかりお腹を満たせる"], solo:["ひとりでも入りやすい、豚骨専門の潔さ"]}},
  {id:"koenji-jimon", name:"じもん", genre:"担々麺", area:"高円寺", price:[700,999], vibe:"adventurousUnique",
    tags:["担々麺","個性派"], reasonSeeds:{adventurous:["担々麺という、いつもと違う選択肢"], solo:["ひとりで担々麺の辛さに向き合う、というのもいい"], quick:["サクッと食べて出られる気軽さ"]}},
  {id:"koenji-jagura", name:"じゃぐら", genre:"味噌豚骨ラーメン", area:"高円寺", price:[1000,2000], vibe:"familyHearty",
    tags:["味噌豚骨","ボリューム"], reasonSeeds:{hearty:["味噌豚骨のガツンとくる満足感"], friends:["味噌豚骨のガツンとくる味は、飲んだ後の締めにも"], budget:["ボリュームのわりに価格は手頃"]}},
  {id:"koenji-endera", name:"麺屋 えん寺", genre:"ベジポタラーメン", area:"高円寺", price:[1000,2000], vibe:"dateQuiet",
    tags:["ベジポタ","ヘルシー志向"], reasonSeeds:{calm:["野菜の旨味でやさしい味わい、ふたりでも入りやすい"], couple:["野菜の旨味で重すぎない、ふたりの食事にちょうどいい"], stylish:["ベジポタという響きが、いつもと違う選択に"]}},
  {id:"koenji-taikiya-akatsuki", name:"大輝家直系 麺家 暁", genre:"家系ラーメン", area:"高円寺", price:[1000,2000], vibe:"familyHearty",
    tags:["家系","ボリューム"], reasonSeeds:{hearty:["家系直系の、しっかりしたスープとボリューム"], family:["しっかりしたスープで、育ち盛りの家族にも"], friends:["家系好きの友達との一杯にも"]}},
  {id:"koenji-mazesoba-minami", name:"混ぜそば みなみ", genre:"混ぜそば", area:"高円寺", price:[700,999], vibe:"soloQuick",
    tags:["混ぜそば","個性派"], reasonSeeds:{quick:["さっと混ぜてさっと食べられる軽快さ"], solo:["ひとりでも入りやすい、混ぜそば専門の身軽さ"], adventurous:["いつもと違う、混ぜそばという選択肢"]}},

  // ── 居酒屋(12) ──
  {id:"asagaya-sakanazakaba-uoboshi", name:"さかな酒場 魚星 阿佐ヶ谷店", genre:"海鮮居酒屋", area:"阿佐ヶ谷", price:[2000,3000], vibe:"groupCasual",
    officialUrl:"https://sakana-uosei.com/asagaya/", reservationUrl:"https://www.hotpepper.jp/strJ003917204/",
    tags:["海鮮","安め"], reasonSeeds:{budget:["海鮮を気軽な値段でつまみに"], friends:["海鮮を色々つまみながら、わいわい飲むのに向いてる"], drinking:["魚をアテに、じっくり飲める一軒"]}},
  {id:"asagaya-rokukan", name:"六燗", genre:"ジビエ・ナチュールワイン", area:"阿佐ヶ谷", price:[2000,3000], vibe:"adventurousUnique",
    tags:["ジビエ","ナチュールワイン"], reasonSeeds:{adventurous:["ジビエとナチュールワインという、他にはない組み合わせ"], couple:["ナチュールワインを選びながら、ふたりでゆっくり"], stylish:["ジビエという、少し特別な選択肢"]}},
  {id:"asagaya-fujisan-baniku", name:"阿佐ヶ谷 大衆馬肉酒場 冨士山", genre:"馬肉酒場", area:"阿佐ヶ谷", price:[3000,4000], vibe:"adventurousUnique",
    officialUrl:"https://fujiyama-asagaya.com/", reservationUrl:"https://tabelog.com/tokyo/A1319/A131905/13309702/",
    tags:["馬肉","大衆酒場"], reasonSeeds:{adventurous:["馬肉料理という、いつもと違う一軒"], friends:["馬肉料理を話題にしながら、友達とわいわい"], drinking:["大衆酒場らしい気軽な飲み"]}},
  {id:"asagaya-uotetsu", name:"阿佐ヶ谷 魚てつ", genre:"海鮮居酒屋", area:"阿佐ヶ谷", price:[5000,6000], vibe:"dateQuiet",
    officialUrl:"https://asagaya-uotetsu.com/", reservationUrl:"https://www.hotpepper.jp/strJ003649082/",
    tags:["刺身","海鮮"], reasonSeeds:{indulgent:["新鮮な刺身をゆっくり味わえる"], couple:["刺身をアテに、ふたりでゆっくり飲める"], calm:["落ち着いて魚と向き合える雰囲気"]}},
  {id:"asagaya-otoriya", name:"音鶏家 阿佐ヶ谷店", genre:"焼き鳥", area:"阿佐ヶ谷", price:[2000,3000], vibe:"budgetCasual",
    tags:["焼き鳥","安め"], reasonSeeds:{budget:["焼き鳥を気軽な値段で"], solo:["ひとりでも気軽に立ち寄れる焼き鳥屋"], quick:["ランチ帯の実績もあり、提供も早そう"]}},
  {id:"asagaya-kushibar", name:"阿佐ヶ谷串バル", genre:"串料理バル", area:"阿佐ヶ谷", price:[2000,3000], vibe:"soloDrink",
    tags:["串料理","ランチも安い"], reasonSeeds:{quick:["串をつまみながら、軽く立ち寄れる"], solo:["串を数本つまむだけでもいい、身軽さ"], budget:["ランチも安いから、価格の安心感がある"]}},
  {id:"asagaya-nihonshu-zero", name:"にほんしゅ ぜろ", genre:"日本酒バル", area:"阿佐ヶ谷", price:[3000,4000], vibe:"dateQuiet",
    tags:["日本酒","落ち着いた飲み"], reasonSeeds:{calm:["日本酒を静かに選びながら飲める"], couple:["日本酒を選びながら、静かに語り合える"], drinking:["総合居酒屋としての品揃えの広さも魅力"]}},
  {id:"asagaya-24-gyoza", name:"24時間 餃子酒場 阿佐ヶ谷店", genre:"餃子・深夜酒場", area:"阿佐ヶ谷", price:[2000,3000], vibe:"soloDrink",
    officialUrl:"https://gyouzasakaba-asagaya.com/", reservationUrl:"https://www.hotpepper.jp/strJ001179469/",
    tags:["24時間営業","餃子"], reasonSeeds:{quick:["24時間営業だから、時間を気にせず入れる"], solo:["深夜でもひとりでふらっと入れる"], budget:["餃子中心で、価格も気取らない"]}},
  {id:"koenji-doki", name:"動悸", genre:"隠れ家居酒屋", area:"高円寺", price:[6000,8000], vibe:"dateSpecial",
    officialUrl:"https://koenji-tokimeki.com/", reservationUrl:"https://www.hotpepper.jp/strJ003582371/",
    tags:["隠れ家","少し贅沢"], reasonSeeds:{indulgent:["隠れ家感のある特別な一軒"], couple:["隠れ家だからこそ、ふたりだけの時間に集中できる"], stylish:["少し背伸びしたい夜にちょうどいい佇まい"]}},
  {id:"koenji-kaisen", name:"貝せん", genre:"貝料理専門", area:"高円寺", price:[4000,5000], vibe:"groupCasual",
    tags:["貝料理専門","つまみが豊富"], reasonSeeds:{friends:["貝料理を色々つまみながらわいわい"], drinking:["貝料理は日本酒にもワインにも合わせやすい"], colleagues:["つまみが豊富だから、職場の集まりにも"]}},
  {id:"koenji-citraba", name:"クラフト麦酒酒場 シトラバ 高円寺店", genre:"クラフトビール酒場", area:"高円寺", price:[1000,6000], vibe:"stylishDrink",
    officialUrl:"https://www.citraba.jp/", reservationUrl:"https://tabelog.com/tokyo/A1319/A131904/13233396/",
    tags:["クラフトビール","種類豊富"], reasonSeeds:{stylish:["クラフトビールの飲み比べが楽しい"], friends:["飲み比べをネタに、みんなで盛り上がれる"], couple:["クラフトビールを選ぶ時間も、ふたりの会話のきっかけに"]}},
  {id:"koenji-hakata-standard", name:"ハカタスタンダード 高円寺店", genre:"博多料理", area:"高円寺", price:[3000,4000], vibe:"groupCasual",
    tags:["博多料理","もつ鍋"], reasonSeeds:{friends:["もつ鍋を囲んでわいわい飲むのに合う"], hearty:["もつ鍋でしっかりお腹も満たせる"], colleagues:["鍋を囲むから、職場の集まりにも向いてる"]}},

  // ── 和食(12) ──
  {id:"asagaya-shinkei", name:"神鶏 阿佐ヶ谷店", genre:"焼き鳥", area:"阿佐ヶ谷", price:[3000,4000], vibe:"groupCasual",
    tags:["焼き鳥","飲み向き"], reasonSeeds:{drinking:["焼き鳥をつまみに、じっくり飲める"], friends:["焼き鳥を何本もシェアしながら、わいわい飲める"], budget:["焼き鳥中心だから、価格も気張らない"]}},
  {id:"asagaya-sugidama", name:"鮨・酒・肴 杉玉 阿佐ヶ谷", genre:"寿司", area:"阿佐ヶ谷", price:[3000,4000], vibe:"dateQuiet",
    tags:["寿司","日本酒"], reasonSeeds:{indulgent:["寿司と日本酒で、少し贅沢な気分に"], couple:["寿司と日本酒を、ふたりでゆっくり味わう夜に"], calm:["落ち着いた雰囲気で、静かに語り合える"]}},
  {id:"asagaya-tonkatsu-narikura", name:"とんかつ成蔵", genre:"とんかつ", area:"阿佐ヶ谷", price:[6000,8000], vibe:"dateSpecial",
    officialUrl:null, reservationUrl:"https://restaurant.ikyu.com/117439",
    tags:["とんかつ","上質な一皿"], reasonSeeds:{indulgent:["じっくり揚げたとんかつを主役に、特別な食事を"], couple:["じっくり揚げる一皿を、特別な日の主役に"], stylish:["とんかつなのに、どこか特別感のある佇まい"]}},
  {id:"asagaya-soba", name:"阿佐ヶ谷SOBA", genre:"そば(創作)", area:"阿佐ヶ谷", price:[5000,6000], vibe:"dateQuiet",
    tags:["そば","落ち着いた空間"], reasonSeeds:{calm:["そばを肴に、静かに飲みながら話せる"], couple:["そばを肴に、ふたりで静かな時間を"], indulgent:["創作そばという、少し特別な選択肢"]}},
  {id:"asagaya-sushi-ichi", name:"すしいち", genre:"寿司", area:"阿佐ヶ谷", price:[5000,6000], vibe:"dateSpecial",
    officialUrl:"https://sushiichi.foodre.jp/", reservationUrl:"https://www.hotpepper.jp/strJ004444825/",
    tags:["寿司","職人技"], reasonSeeds:{indulgent:["職人が握る寿司で、特別な夜に"], couple:["職人の握りを、特別な記念日に"], stylish:["寿司屋らしい、背筋が伸びる緊張感も魅力"]}},
  {id:"koenji-abusan", name:"あぶさん", genre:"海鮮・貝料理", area:"高円寺", price:[5000,6000], vibe:"groupCasual",
    tags:["海鮮","貝料理"], reasonSeeds:{friends:["海鮮と貝をつまみに、飲みが長引いても飽きない"], drinking:["海鮮と貝、両方あるから飲みが長引いても飽きない"], colleagues:["つまみの種類が多く、職場の集まりにも"]}},
  {id:"koenji-osoubi-kappou", name:"創作割烹おあそび", genre:"創作割烹", area:"高円寺", price:[6000,8000], vibe:"dateSpecial",
    officialUrl:"https://oasobi.foodre.jp/", reservationUrl:"https://www.hotpepper.jp/strJ003388022/",
    tags:["創作割烹","コース"], reasonSeeds:{indulgent:["コース仕立ての創作料理で、記念日にも使える"], couple:["コース仕立てだから、記念日にちょうどいい流れで楽しめる"], stylish:["創作割烹らしい、丁寧な仕立て"]}},
  {id:"koenji-motsuyaki-byron", name:"もつ焼き Byron", genre:"もつ焼き", area:"高円寺", price:[4000,5000], vibe:"groupCasual",
    tags:["もつ焼き","大衆酒場"], reasonSeeds:{friends:["もつ焼きをつつきながら、気取らず飲める"], drinking:["もつ焼きは安酒にもよく合う"], budget:["大衆酒場価格で、気兼ねなく飲める"]}},
  {id:"koenji-en", name:"en", genre:"日本料理", area:"高円寺", price:[5000,6000], vibe:"dateQuiet",
    tags:["日本料理","落ち着いた空間"], reasonSeeds:{calm:["丁寧な日本料理を、静かな店内でゆっくり"], couple:["丁寧な日本料理を、ふたりでゆっくり味わう夜に"], indulgent:["日本料理らしい、静かな満足感"]}},
  {id:"koenji-katsuraya", name:"桂屋", genre:"そば", area:"高円寺", price:[1000,2000], vibe:"soloQuick",
    tags:["そば","昼夜営業"], reasonSeeds:{quick:["さっと手繰れる一杯そば"], solo:["ひとりでさっと手繰れる、昼夜営業のそば屋"], budget:["そば一杯なら、価格も気軽"]}},
  {id:"asagaya-dining-kitchen", name:"阿佐ケ谷ダイニングキッチン", genre:"定食", area:"阿佐ヶ谷", price:[1000,2000], vibe:"familyHearty",
    tags:["大盛り","定食"], reasonSeeds:{hearty:["大盛りが名物の、がっつり系定食"], family:["大盛りだから、育ち盛りの家族連れにも"], budget:["定食なら、価格も安心"]}},
  {id:"asagaya-fujinoya", name:"藤野家", genre:"食堂", area:"阿佐ヶ谷", price:[700,999], vibe:"budgetCasual",
    tags:["格安食堂","地元の常連"], reasonSeeds:{budget:["驚くほど手頃な、地元で愛される食堂"], solo:["地元で愛される、ひとりでも入りやすい食堂"], quick:["食堂らしい、さっと食べられる気軽さ"]}}
];

/* =========================================================
   追加店舗(第3弾: ジャンルを絞らず横断的に50件)
   ※Google/食べログ等の評価・口コミが確認できる実在店から、
     未収録ジャンル(カフェ・韓国・カレー・うなぎ・お好み焼き・
     スペイン/ビストロ・タイ・洋食・バー・立ち飲み 等)を中心に選定。
     焼き鳥・居酒屋・中華は評価の高い店を追加で厚みを持たせた。
   ========================================================= */
const NEW_ROWS2 = [
  // ── カフェ(4) ──
  {id:"koenji-hattifnatt", name:"HATTIFNATT", genre:"カフェ", area:"高円寺", price:[1500,2500], vibe:"adventurousUnique",
    tags:["パイケーキ","絵本のような内装"], reasonSeeds:{adventurous:["絵本の中みたいな内装で、いつもと違う気分に浸れる"], friends:["パイケーキが名物で、写真も話題も弾む"]}},
  {id:"asagaya-violon", name:"名曲喫茶ヴィオロン", genre:"喫茶店", area:"阿佐ヶ谷", price:[800,1500], vibe:"dateQuiet",
    tags:["名曲喫茶","41年の老舗"], reasonSeeds:{calm:["クラシックが流れる、41年続く老舗喫茶での静かな時間"], couple:["会話を急かされない、ゆったりした喫茶店の時間"]}},
  {id:"koenji-yonchome-cafe", name:"Yonchome Cafe", genre:"カフェ", area:"高円寺", price:[1500,2500], vibe:"groupCasual",
    tags:["アメリカンダイナー","高円寺駅南口徒歩1分"], reasonSeeds:{friends:["アメリカンなフードでわいわい、駅からすぐの気軽さ"]}},
  {id:"koenji-jules-verne", name:"JULES VERNE COFFEE", genre:"カフェ", area:"高円寺", price:[800,1500], vibe:"dateQuiet",
    tags:["スペシャルティコーヒー","フルーツサンド"], reasonSeeds:{calm:["フルーツサンドと一杯のコーヒーで、静かにひと息つける"]}},

  // ── 韓国料理(2) ──
  {id:"asagaya-ajiton", name:"味豚 アジトン 阿佐ヶ谷店", genre:"韓国料理", area:"阿佐ヶ谷", price:[3000,4000], vibe:"groupCasual",
    tags:["サムギョプサル","石焼きチュクミ"], reasonSeeds:{friends:["アツアツのサムギョプサルを焼きながらわいわい"], drinking:["肉と一緒にマッコリも進む一軒"]}},
  {id:"asagaya-samshiseok", name:"韓国料理サムシセキ 阿佐ヶ谷店", genre:"韓国料理", area:"阿佐ヶ谷", price:[3000,4000], vibe:"groupCasual",
    tags:["韓国家庭料理","チーズタッカルビ"], reasonSeeds:{friends:["取り分けて楽しむ韓国料理は、大人数でも盛り上がる"]}},

  // ── カレー(8) ──
  {id:"asagaya-curry-jikan", name:"カレーの時間", genre:"スパイスカレー", area:"阿佐ヶ谷", price:[1000,2000], vibe:"soloQuick",
    tags:["スパイスカレー"], reasonSeeds:{quick:["ひとりでもさっと入れる、スパイスカレーの一軒"]}},
  {id:"asagaya-spice-curry-toca", name:"SpiceCurryToca", genre:"スパイスカレー", area:"阿佐ヶ谷", price:[1000,2000], vibe:"adventurousUnique",
    tags:["スパイスカレー","個性派"], reasonSeeds:{adventurous:["スパイスの配合に個性があり、いつもと違う一皿に"]}},
  {id:"asagaya-curry-kyu", name:"カレーの店 KYU-", genre:"スパイスカレー", area:"阿佐ヶ谷", price:[700,999], vibe:"soloQuick",
    tags:["スパイスカレー","安め"], reasonSeeds:{budget:["1000円以下から、気軽に立ち寄れるカレー屋"]}},
  {id:"asagaya-beniya", name:"紅屋", genre:"スパイスカレー", area:"阿佐ヶ谷", price:[1000,2000], vibe:"budgetCasual",
    tags:["スパイスカレー"], reasonSeeds:{budget:["スパイスの効いた一皿を、気張らない値段で"]}},
  {id:"asagaya-namaste-himal", name:"ナマステヒマール", genre:"インドカレー", area:"阿佐ヶ谷", price:[700,999], vibe:"budgetCasual",
    tags:["インドカレー","ナン"], reasonSeeds:{budget:["ナン付きインドカレーが、この価格でお腹いっぱいに"]}},
  {id:"asagaya-spice-and-co", name:"スパイス アンド コー", genre:"スパイスカレー", area:"阿佐ヶ谷", price:[1000,2000], vibe:"adventurousUnique",
    tags:["スパイスカレー"], reasonSeeds:{adventurous:["いつものカレーとはひと味違うスパイス使い"]}},
  {id:"asagaya-hinoya-curry", name:"日乃屋カレー 阿佐ヶ谷店", genre:"欧風カレー", area:"阿佐ヶ谷", price:[700,999], vibe:"soloQuick",
    tags:["欧風カレー","安め"], reasonSeeds:{quick:["欧風の濃いカレーを、さっと一杯"], budget:["1000円以下で満足感のある欧風カレー"]}},
  {id:"asagaya-shekeba-curry", name:"SHEKEBA CURRY", genre:"スパイスカレー", area:"阿佐ヶ谷", price:[1000,2000], vibe:"adventurousUnique",
    tags:["スパイスカレー","個性派"], reasonSeeds:{adventurous:["名前からして気になる、個性派スパイスカレー"]}},

  // ── うなぎ(2) ──
  {id:"asagaya-azumaya", name:"阿づ満や", genre:"うなぎ", area:"阿佐ヶ谷", price:[4000,6000], vibe:"dateSpecial",
    tags:["うなぎ専門","戦前からの老舗"], reasonSeeds:{indulgent:["戦前から続く老舗の、柔らかく仕上げたうなぎ"], couple:["少し特別な日に、老舗のうなぎでゆっくり"]}},
  {id:"asagaya-unagi-naruse", name:"鰻の成瀬 阿佐ヶ谷店", genre:"うなぎ", area:"阿佐ヶ谷", price:[3000,4000], vibe:"dateQuiet",
    tags:["厳選ニホンウナギ"], reasonSeeds:{indulgent:["生育環境にこだわった、上質なうなぎを味わえる"]}},

  // ── お好み焼き・鉄板(4) ──
  {id:"asagaya-enya", name:"縁家", genre:"お好み焼き", area:"阿佐ヶ谷", price:[2200,4000], vibe:"groupCasual",
    tags:["関西風お好み焼き","もんじゃ","食べ放題プラン"], reasonSeeds:{friends:["鉄板を囲んでわいわい、食べ放題プランもある"], drinking:["2時間飲み放題付きコースもあり、飲みにも使える"]}},
  {id:"asagaya-bansho", name:"鉄板焼ダイニング 万松", genre:"鉄板焼き", area:"阿佐ヶ谷", price:[4000,6000], vibe:"dateQuiet",
    tags:["隠れ家鉄板焼き"], reasonSeeds:{calm:["駅前にありながら隠れ家的な、落ち着いた鉄板焼き"]}},
  {id:"asagaya-tachimachi", name:"広島お好み焼 TachiMachi", genre:"お好み焼き", area:"阿佐ヶ谷", price:[2000,3000], vibe:"groupCasual",
    tags:["広島風お好み焼き","お酒が安い"], reasonSeeds:{budget:["広島風お好み焼きとお酒が、どちらも手頃な値段で"]}},
  {id:"asagaya-iron-diner", name:"IRON DINER 阿佐ヶ谷店", genre:"お好み焼き", area:"阿佐ヶ谷", price:[6000,8000], vibe:"dateSpecial",
    officialUrl:"https://irondinerasagaya.owst.jp/", reservationUrl:"https://tabelog.com/tokyo/A1319/A131905/13319300/",
    tags:["上質なお好み焼き"], reasonSeeds:{indulgent:["お好み焼きを、少し特別な一皿として楽しめる一軒"]}},

  // ── スペイン・ビストロ(3) ──
  {id:"koenji-gaucho", name:"スペインバル ガウチョ", genre:"スペイン料理", area:"高円寺", price:[3000,4500], vibe:"stylishDrink",
    tags:["タパス","イカの墨煮","評価4.32"], reasonSeeds:{stylish:["本場スペインバルの空間で、タパスとワインを"], drinking:["アヒージョや肉料理をつまみに、ワインが進む"]}},
  {id:"asagaya-kocco", name:"スペインバル Kocco", genre:"スペイン料理", area:"阿佐ヶ谷", price:[3000,4500], vibe:"dateQuiet",
    tags:["本格パエリア","イカスミリゾット"], reasonSeeds:{couple:["本格パエリアを、ふたりでゆっくり分け合う夜に"]}},
  {id:"koenji-iiiio", name:"iiiio", genre:"ビストロ", area:"高円寺", price:[4000,6000], vibe:"dateQuiet",
    tags:["ビストロ"], reasonSeeds:{calm:["気取りすぎない、大人のビストロの落ち着き"]}},

  // ── タイ・洋食(2) ──
  {id:"asagaya-daothai", name:"タイ屋台居酒屋 ダオタイ 阿佐ヶ谷本店", genre:"タイ・ベトナム料理", area:"阿佐ヶ谷", price:[3000,4000], vibe:"groupCasual",
    tags:["トムヤムクン","ガイヤーン","宴会コース"], reasonSeeds:{adventurous:["本場のタイ料理で、いつもと違う一夜に"], friends:["宴会コースもあり、大人数で盛り上がりやすい"]}},
  {id:"asagaya-rasenya", name:"西洋食堂 らせん屋 阿佐ヶ谷店", genre:"洋食", area:"阿佐ヶ谷", price:[3000,4500], vibe:"dateQuiet",
    tags:["手づくり洋食","隠れ家"], reasonSeeds:{calm:["手づくりにこだわった洋食を、隠れ家的な空間で"]}},

  // ── ワイン・上質な焼き鳥(3) ──
  {id:"koenji-akka", name:"高円寺アッカ", genre:"イタリアンワインバー", area:"高円寺", price:[4000,6000], vibe:"stylishDrink",
    tags:["ソムリエ常駐","イタリアワイン受賞歴"], reasonSeeds:{stylish:["ソムリエ監修のワインを、グラスで気軽に飲み比べ"], couple:["ワインを選ぶ時間も含めて、大人の夜を楽しめる"]}},
  {id:"asagaya-birdland", name:"阿佐ヶ谷バードランド", genre:"焼き鳥・ワイン", area:"阿佐ヶ谷", price:[6000,8000], vibe:"dateSpecial",
    officialUrl:"https://www.asagaya-bird-land.com/", reservationUrl:"https://restaurant.ikyu.com/120714",
    tags:["銀座の名店直系","備長炭","希少部位"], reasonSeeds:{indulgent:["銀座仕込みの焼き鳥を、備長炭でじっくりと"], couple:["希少部位も揃う、少し贅沢な焼き鳥の夜に"]}},
  {id:"koenji-and-beer", name:"アンドビール", genre:"クラフトビール", area:"高円寺", price:[2000,3500], vibe:"adventurousUnique",
    tags:["クラフトビール","カレー"], reasonSeeds:{adventurous:["クラフトビールとカレーという、珍しい組み合わせ"]}},

  // ── 焼き鳥もっと(7) ──
  {id:"asagaya-yamamoto-cellar", name:"焼鳥 山もと 阿佐ヶ谷cellar", genre:"焼き鳥", area:"阿佐ヶ谷", price:[6000,8000], vibe:"dateSpecial",
    officialUrl:null, reservationUrl:"https://yoyaku.toreta.in/asagaya-yamamoto",
    tags:["評価上位の名店"], reasonSeeds:{indulgent:["地域でも評価の高い、焼き鳥の名店で特別な夜を"]}},
  {id:"asagaya-katsu", name:"克ッ 阿佐ヶ谷", genre:"焼き鳥", area:"阿佐ヶ谷", price:[4000,5000], vibe:"groupCasual",
    tags:["焼き鳥"], reasonSeeds:{friends:["焼き鳥をつまみに、気取らずわいわい飲める"]}},
  {id:"asagaya-beard", name:"焼鳥BEARD(ベアード) 南阿佐ヶ谷店", genre:"焼き鳥", area:"南阿佐ヶ谷", price:[4000,5000], vibe:"stylishDrink",
    tags:["焼き鳥"], reasonSeeds:{stylish:["焼き鳥屋にしては洒落た空間で、飲みを楽しめる"]}},
  {id:"asagaya-kushishinbo", name:"串しん坊", genre:"焼き鳥", area:"阿佐ヶ谷", price:[2000,3000], vibe:"budgetCasual",
    tags:["焼き鳥","安め"], reasonSeeds:{budget:["焼き鳥中心で、価格も気張らない一軒"]}},
  {id:"asagaya-torinari", name:"とり成", genre:"焼き鳥", area:"阿佐ヶ谷", price:[3000,4000], vibe:"groupCasual",
    tags:["焼き鳥"], reasonSeeds:{friends:["焼き鳥をシェアしながら、わいわい過ごせる"]}},
  {id:"asagaya-toridokoro", name:"炭火台所 鶏丸", genre:"焼き鳥", area:"阿佐ヶ谷", price:[4000,5000], vibe:"groupCasual",
    tags:["炭火焼き"], reasonSeeds:{drinking:["炭火の香りを楽しみながら、じっくり飲める"]}},
  {id:"asagaya-toriya-suzunari", name:"とりや鈴なり", genre:"焼き鳥", area:"阿佐ヶ谷", price:[6000,8000], vibe:"dateSpecial",
    officialUrl:null, reservationUrl:"https://www.hotpepper.jp/strJ001251061/",
    tags:["焼き鳥","少し贅沢"], reasonSeeds:{indulgent:["少し贅沢な焼き鳥のコースで、特別な夜に"]}},

  // ── 立ち飲み(3) ──
  {id:"koenji-banpaiya", name:"高円寺晩杯屋", genre:"立ち飲み", area:"高円寺", price:[1000,2000], vibe:"soloDrink",
    tags:["センベロ","日替わり海鮮"], reasonSeeds:{budget:["千円ちょっとでほろ酔いになれる、センベロの定番"], quick:["ふらっと立ち寄って、さっと一杯だけでもいい"]}},
  {id:"asagaya-futakun", name:"立呑風太くん", genre:"立ち飲み", area:"阿佐ヶ谷", price:[1000,2000], vibe:"soloDrink",
    tags:["20年続く立ち飲み","北口すぐ"], reasonSeeds:{solo:["ひとりでふらっと寄れる、20年続く立ち飲みの定番"]}},
  {id:"koenji-shichisuke", name:"立ち飲み七助", genre:"立ち飲み", area:"高円寺", price:[1000,2000], vibe:"soloDrink",
    tags:["貝刺し","熱燗"], reasonSeeds:{quick:["貝刺しと熱燗を、立ったままさくっと"]}},

  // ── バー(2) ──
  {id:"koenji-bar-tail", name:"Bar tail", genre:"バー", area:"高円寺", price:[3000,4000], vibe:"soloDrink",
    tags:["ウイスキー","自家製果実酒"], reasonSeeds:{calm:["年季の入った空間で、静かにウイスキーを傾ける"], solo:["ひとりでもテラス席でゆっくりできる"]}},
  {id:"koenji-bar-dop", name:"bar dop", genre:"バー", area:"高円寺", price:[3000,4000], vibe:"stylishDrink",
    tags:["カクテル"], reasonSeeds:{stylish:["カクテルを片手に、少し大人な夜を過ごせる"]}},

  // ── 中華もっと(2) ──
  {id:"asagaya-chinkoen", name:"珍香園", genre:"中華", area:"阿佐ヶ谷", price:[1000,2500], vibe:"groupCasual",
    tags:["約100種の本格中華","駅徒歩1分"], reasonSeeds:{budget:["100種近いメニューから選べて、安くて満足感がある"], friends:["メニューが多いから、大人数でも choices に困らない"]}},
  {id:"koenji-ichiban", name:"一番", genre:"中華", area:"高円寺", price:[700,999], vibe:"soloQuick",
    tags:["中華・ラーメン"], reasonSeeds:{quick:["ラーメンから中華の一品まで、さっと済ませられる"]}},

  // ── 追加(多様性の穴埋め・8) ──
  {id:"asagaya-uchikaoritei", name:"打ち薫る亭", genre:"日本料理", area:"阿佐ヶ谷", price:[6000,8000], vibe:"dateSpecial",
    officialUrl:null, reservationUrl:"https://www.hotpepper.jp/strJ001286647/",
    tags:["日本料理"], reasonSeeds:{indulgent:["丁寧な日本料理のコースで、特別な夜を演出"]}},
  {id:"koenji-kemuri", name:"けむり 高円寺店", genre:"焼き鳥", area:"高円寺", price:[3000,4000], vibe:"groupCasual",
    tags:["焼き鳥"], reasonSeeds:{drinking:["煙の向こうで焼く焼き鳥を、じっくり飲みながら"]}},
  {id:"koenji-yacchan", name:"名物やきとん やっちゃん", genre:"やきとん", area:"高円寺", price:[3000,4000], vibe:"groupCasual",
    officialUrl:null, reservationUrl:"https://www.hotpepper.jp/strJ003762764/",
    tags:["やきとん","串焼き"], reasonSeeds:{friends:["やきとんをつつきながら、気取らず盛り上がれる"]}},
  {id:"koenji-daruma", name:"だるま高円寺", genre:"もつ焼き", area:"高円寺", price:[2000,3000], vibe:"budgetCasual",
    officialUrl:null, reservationUrl:"https://www.hotpepper.jp/strJ003942113/",
    tags:["もつ焼き","安め"], reasonSeeds:{budget:["もつ焼き中心で、財布にやさしい飲みができる"]}},
  {id:"koenji-mara", name:"山形料理と地酒 まら", genre:"郷土料理", area:"高円寺", price:[5000,6000], vibe:"adventurousUnique",
    tags:["山形料理","地酒"], reasonSeeds:{adventurous:["山形の郷土料理と地酒で、いつもと違う一夜に"]}},
  {id:"asagaya-halleluya", name:"サカバ ハレルヤ", genre:"居酒屋", area:"阿佐ヶ谷", price:[3000,4000], vibe:"groupCasual",
    officialUrl:null, reservationUrl:"https://www.hotpepper.jp/strJ004067107/",
    tags:["総合居酒屋"], reasonSeeds:{friends:["メニューの幅が広く、みんなの好みに合わせやすい"]}},
  {id:"asagaya-kaerushokudo", name:"かえる食堂", genre:"定食", area:"阿佐ヶ谷", price:[1000,2000], vibe:"soloQuick",
    tags:["朝7時から営業"], reasonSeeds:{quick:["朝早くから開いているから、時間を気にせず入れる"]}},
  {id:"koenji-marunaga", name:"丸長食堂", genre:"食堂", area:"高円寺", price:[700,999], vibe:"budgetCasual",
    tags:["老舗食堂","安め"], reasonSeeds:{budget:["昔ながらの食堂らしい、控えめな値段設定"]}}
];

/* =========================================================
   追加店舗(第4弾: 評価点・レビュー数を重視して50件)
   ※食べログの「評価点」(=口コミ件数と評価の両方を反映した
     指標)およびランキング順位(=ネット予約数・人気の代理指標)
     が高いものを優先して選定。Google独自の星・口コミ数は
     API連携していないため直接参照できず、食べログの指標を
     実務上の代替指標として使用している。
   ========================================================= */
const NEW_ROWS3 = [
  // ── ラーメン(13・評価点上位から) ──
  {id:"asagaya-ramen-cique", name:"RAMEN CiQUE", genre:"ラーメン", area:"阿佐ヶ谷", price:[700,999], vibe:"soloQuick",
    tags:["鶏と魚介ベース","評価3.77"], reasonSeeds:{quick:["評価の高い一杯を、さっと食べてさっと出られる"], solo:["鶏と魚介のスープが染みる、ひとりの一杯に"]}},
  {id:"koenji-nakasu-yatai", name:"中洲屋台長浜ラーメン初代 健太 東京高円寺本店", genre:"ラーメン", area:"高円寺", price:[700,999], vibe:"soloQuick",
    tags:["博多屋台系豚骨","評価3.77"], reasonSeeds:{quick:["屋台仕込みの豚骨を、さっと替え玉までいける気軽さ"]}},
  {id:"koenji-tonkotsu-souten", name:"豚骨 蒼翔", genre:"ラーメン", area:"高円寺", price:[1000,2000], vibe:"soloQuick",
    tags:["透明感のある豚骨","評価3.74"], reasonSeeds:{quick:["透明感のある上品な豚骨で、するっと一杯"]}},
  {id:"koenji-hayashimaru", name:"麺屋 はやしまる", genre:"ラーメン", area:"高円寺", price:[1000,2000], vibe:"soloQuick",
    tags:["評価3.73"], reasonSeeds:{solo:["スープと麺の評判がよく、ひとりでも満足感がある"]}},
  {id:"asagaya-asagakita", name:"アサガキタ", genre:"ラーメン", area:"阿佐ヶ谷", price:[700,999], vibe:"soloQuick",
    tags:["塩ラーメン系","評価3.72"], reasonSeeds:{quick:["すっきりした塩ラーメンを、さっと一杯"]}},
  {id:"asagaya-menjo-issho", name:"麺処 一笑", genre:"ラーメン", area:"阿佐ヶ谷", price:[1000,2000], vibe:"soloQuick",
    tags:["評価3.71"], reasonSeeds:{solo:["王道のラーメンを、ひとりでじっくり味わう"]}},
  {id:"koenji-chuka-isshin", name:"中華蕎麦 一心", genre:"ラーメン", area:"高円寺", price:[1000,2000], vibe:"soloQuick",
    tags:["評価3.71"], reasonSeeds:{quick:["中華蕎麦らしい澄んだスープを、さっと一杯"]}},
  {id:"koenji-dried-sardine", name:"DRIED SARDINE BROTHERS", genre:"つけ麺", area:"高円寺", price:[1000,2000], vibe:"adventurousUnique",
    tags:["チャーシュー評判","評価3.64"], reasonSeeds:{adventurous:["個性的な店名の通り、いつもと違うつけ麺を試したい日に"]}},
  {id:"asagaya-irohaya", name:"らーめん いろはや", genre:"ラーメン", area:"阿佐ヶ谷", price:[700,999], vibe:"soloQuick",
    tags:["評価3.61"], reasonSeeds:{budget:["標準的なラーメンを、手頃な価格でしっかりと"]}},
  {id:"koenji-abura-fukuho", name:"濃口背脂味噌らーめんと餃子 大福帳", genre:"ラーメン", area:"高円寺", price:[700,999], vibe:"familyHearty",
    tags:["背脂味噌","餃子","評価3.60"], reasonSeeds:{hearty:["背脂の効いた濃厚味噌で、しっかりお腹を満たせる"], family:["餃子もセットで頼めるから、家族での一杯にも"]}},
  {id:"koenji-rokkumen", name:"六九麺", genre:"ラーメン", area:"高円寺", price:[700,999], vibe:"soloQuick",
    tags:["鶏白湯","評価3.59"], reasonSeeds:{quick:["鶏白湯のやさしいスープを、さっと一杯"]}},
  {id:"koenji-taroken", name:"タロー軒", genre:"ラーメン", area:"高円寺", price:[700,999], vibe:"soloQuick",
    tags:["評価3.57"], reasonSeeds:{solo:["昔ながらの一杯を、ひとりでふらっと"]}},
  {id:"koenji-uchida", name:"らーめん うち田", genre:"つけ麺", area:"高円寺", price:[1000,2000], vibe:"familyHearty",
    tags:["つけ麺","評価3.52"], reasonSeeds:{hearty:["つけ麺のボリュームで、がっつり満足できる"]}},

  // ── 焼肉(7・評価点上位含む) ──
  {id:"asagaya-sato-brillant-honten", name:"SATOブリアン 本店", genre:"焼肉", area:"阿佐ヶ谷", price:[20000,29999], vibe:"dateSpecial",
    officialUrl:"https://satobriand.yoyaku.at/", reservationUrl:"https://tabelog.com/tokyo/A1319/A131905/13127046/",
    tags:["最高評価クラスの焼肉","希少部位","評価3.99"], reasonSeeds:{indulgent:["地域随一の評価を誇る、特別な日のための焼肉"], couple:["一生に一度クラスの記念日に、思い切って選びたい一軒"]}},
  {id:"asagaya-sato-brillant-nigou", name:"SATOブリアン にごう", genre:"焼肉", area:"阿佐ヶ谷", price:[15000,19999], vibe:"dateSpecial",
    officialUrl:"https://satobriand.yoyaku.at/", reservationUrl:"https://tabelog.com/tokyo/A1319/A131905/13159782/",
    tags:["高評価焼肉","評価3.91"], reasonSeeds:{indulgent:["本店に迫る評価の高さで、特別な焼肉の夜に"]}},
  {id:"asagaya-sanpoen", name:"炭火焼肉 三宝苑 阿佐ヶ谷店", genre:"焼肉", area:"阿佐ヶ谷", price:[4000,4999], vibe:"familyHearty",
    officialUrl:null, reservationUrl:"https://www.hotpepper.jp/strJ003893067/",
    tags:["炭火焼き","評価3.51"], reasonSeeds:{hearty:["炭火でじっくり焼く肉を、家族でしっかり楽しめる"], family:["評価の高い炭火焼肉を、みんなで囲む"]}},
  {id:"koenji-araiya-honten", name:"焼肉ホルモン 新井屋 高円寺本店", genre:"焼肉", area:"高円寺", price:[6000,7999], vibe:"dateSpecial",
    officialUrl:"https://yakiniku-araiya.com/koenji/", reservationUrl:"https://www.hotpepper.jp/strJ001049734/",
    tags:["ホルモン","評価3.53"], reasonSeeds:{indulgent:["評価の高いホルモン焼肉で、少し贅沢な夜に"]}},
  {id:"asagaya-hasegawa", name:"ほるもんと焼肉屋 はせ川", genre:"焼肉", area:"阿佐ヶ谷", price:[5000,5999], vibe:"groupCasual",
    officialUrl:null, reservationUrl:"https://www.hotpepper.jp/strJ004090450/",
    tags:["ホルモン","評価3.43"], reasonSeeds:{friends:["ホルモンと焼肉、両方楽しめて盛り上がれる"]}},
  {id:"koenji-tamaniha-yakiniku", name:"たまには焼肉 高円寺店", genre:"焼肉", area:"高円寺", price:[3000,3800], vibe:"budgetCasual",
    officialUrl:null, reservationUrl:"https://www.hotpepper.jp/strJ003410539/",
    tags:["コスパの良い肉質","評価3.43"], reasonSeeds:{budget:["「たまには」の名の通り、気張らずコスパよく焼肉を"]}},
  {id:"asagaya-oniku-chan", name:"人情焼肉ONIKUちゃん", genre:"焼肉", area:"阿佐ヶ谷", price:[4000,4999], vibe:"familyHearty",
    officialUrl:"https://onikutyan1999.com/", reservationUrl:"https://tabelog.com/tokyo/A1319/A131905/13300511/",
    tags:["人情味のある接客"], reasonSeeds:{family:["名前の通り人情味あふれる、あたたかい焼肉屋"]}},

  // ── イタリアン(2) ──
  {id:"asagaya-delceppo", name:"デルチェッポ", genre:"イタリアン(パスタ)", area:"阿佐ヶ谷", price:[2000,3000], vibe:"budgetCasual",
    tags:["パスタ専門","ランチ評価が高い"], reasonSeeds:{budget:["パスタ専門店らしい価格で、気軽にイタリアンを"]}},
  {id:"asagaya-haochai", name:"ハオツァイ", genre:"イタリアン", area:"阿佐ヶ谷", price:[3000,3999], vibe:"adventurousUnique",
    tags:["ベジタリアン対応おまかせ"], reasonSeeds:{adventurous:["ベジタリアン対応のおまかせ料理で、いつもと違う一皿に"]}},

  // ── カレー(3) ──
  {id:"asagaya-spice-and-booze", name:"SPICE AND BOOZE", genre:"スパイスカレー", area:"阿佐ヶ谷", price:[1000,2000], vibe:"adventurousUnique",
    tags:["カレーとお酒"], reasonSeeds:{adventurous:["カレーとお酒を一緒に楽しむ、珍しいスタイル"]}},
  {id:"asagaya-curry-kankan", name:"curry Kan-Kan", genre:"カレー", area:"阿佐ヶ谷", price:[1000,2000], vibe:"soloQuick",
    tags:["カレー"], reasonSeeds:{quick:["さっと一皿、カレーで済ませたい日に"]}},
  {id:"asagaya-asian-diamond", name:"アジアンキッチンダイヤモンド", genre:"インドカレー", area:"阿佐ヶ谷", price:[1000,2000], vibe:"groupCasual",
    tags:["インドカレー"], reasonSeeds:{friends:["ナンをシェアしながら、みんなでわいわい食べられる"]}},

  // ── 居酒屋(阿佐ヶ谷・9) ──
  {id:"asagaya-tsurufuku", name:"つる福 阿佐ヶ谷店", genre:"居酒屋", area:"阿佐ヶ谷", price:[3000,3999], vibe:"groupCasual",
    officialUrl:null, reservationUrl:"https://www.hotpepper.jp/strJ001293728/",
    tags:["総合居酒屋"], reasonSeeds:{friends:["メニューの幅が広く、みんなの好みに合わせやすい"]}},
  {id:"asagaya-toriyoshi-second", name:"とり吉 セカンド", genre:"鶏料理", area:"阿佐ヶ谷", price:[3000,3999], vibe:"groupCasual",
    tags:["鶏料理"], reasonSeeds:{drinking:["鶏料理をつまみに、じっくり飲める一軒"]}},
  {id:"asagaya-seiten-jou", name:"魚肴 青天上", genre:"海鮮居酒屋", area:"阿佐ヶ谷", price:[3000,3999], vibe:"dateQuiet",
    officialUrl:null, reservationUrl:"https://www.hotpepper.jp/strJ001295543/",
    tags:["海鮮・魚介"], reasonSeeds:{calm:["魚を肴に、落ち着いて杯を重ねられる"]}},
  {id:"asagaya-donki", name:"呑輝", genre:"居酒屋", area:"阿佐ヶ谷", price:[4000,4999], vibe:"groupCasual",
    officialUrl:"https://nonki-yoyaku.com/", reservationUrl:"https://www.hotpepper.jp/strJ003893820/",
    tags:["総合居酒屋"], reasonSeeds:{friends:["賑やかに飲みたい夜にちょうどいい総合居酒屋"]}},
  {id:"asagaya-hachinohe", name:"旅サロン海っ子八戸 阿佐ヶ谷店", genre:"青森料理", area:"阿佐ヶ谷", price:[3000,3999], vibe:"adventurousUnique",
    tags:["青森料理","ご当地"], reasonSeeds:{adventurous:["青森の郷土料理で、いつもと違う土地の味に触れる"]}},
  {id:"asagaya-dendenkushi", name:"でんでん串", genre:"串揚げ", area:"阿佐ヶ谷", price:[2000,2999], vibe:"budgetCasual",
    tags:["串揚げ"], reasonSeeds:{budget:["串揚げを何本かつまむだけでも、気軽に楽しめる"]}},
  {id:"asagaya-sakurai", name:"阿佐ヶ谷 さくら井", genre:"和食系居酒屋", area:"阿佐ヶ谷", price:[5000,5999], vibe:"dateSpecial",
    officialUrl:"https://sakurai-asagaya.com/", reservationUrl:"https://tabelog.com/tokyo/A1319/A131905/13315286/",
    tags:["和食系居酒屋"], reasonSeeds:{indulgent:["和食を軸にした、少し落ち着いた大人の居酒屋"]}},
  {id:"asagaya-sandal-kitchen", name:"お酒とごはん サンダルキッチン", genre:"居酒屋", area:"阿佐ヶ谷", price:[2000,2999], vibe:"budgetCasual",
    officialUrl:"http://sundal-kitchen.com/asagaya/", reservationUrl:"https://www.hotpepper.jp/strJ001265836/",
    tags:["料理も充実"], reasonSeeds:{budget:["お酒もごはんも両方楽しめて、値段も気張らない"]}},
  {id:"asagaya-aoutei-gyoza", name:"青卯餃子", genre:"餃子", area:"阿佐ヶ谷", price:[3000,3999], vibe:"groupCasual",
    tags:["餃子"], reasonSeeds:{friends:["餃子を何皿も頼んでシェアするのが楽しい"]}},

  // ── 居酒屋(高円寺・7) ──
  {id:"koenji-3b", name:"焼き鳥とワイン ビストロおでん 3B 高円寺", genre:"焼き鳥・おでん", area:"高円寺", price:[4000,4999], vibe:"stylishDrink",
    tags:["焼き鳥とワイン","おでん"], reasonSeeds:{stylish:["焼き鳥やおでんに、ワインを合わせる新しい飲み方"]}},
  {id:"koenji-yamiichi", name:"ヤミイチ 高円寺", genre:"居酒屋", area:"高円寺", price:[3000,4999], vibe:"groupCasual",
    officialUrl:null, reservationUrl:"https://www.hotpepper.jp/strJ004005434/",
    tags:["居酒屋"], reasonSeeds:{friends:["わいわい飲みたい夜に合う、気取らない居酒屋"]}},
  {id:"koenji-tanyaki-kozara", name:"たん焼きと小皿", genre:"牛タン焼き", area:"高円寺", price:[3000,3999], vibe:"dateQuiet",
    tags:["牛タン焼き"], reasonSeeds:{calm:["牛タンを炙る音を聞きながら、静かに飲める"]}},
  {id:"koenji-manmajima", name:"まんまじぃま", genre:"藁炙り料理", area:"高円寺", price:[3000,4999], vibe:"adventurousUnique",
    tags:["藁炙り"], reasonSeeds:{adventurous:["藁で炙るという、他ではあまり見ない調理法"]}},
  {id:"koenji-ajito", name:"地下酒場 亜時戸", genre:"居酒屋", area:"高円寺", price:[3000,3999], vibe:"groupCasual",
    officialUrl:null, reservationUrl:"https://tabelog.com/tokyo/A1319/A131904/13269815/",
    tags:["地下の隠れ家"], reasonSeeds:{friends:["地下の隠れ家的空間で、腰を据えて飲める"]}},
  {id:"koenji-debeko", name:"食堂でべこ。", genre:"海鮮居酒屋", area:"高円寺", price:[1000,3999], vibe:"budgetCasual",
    officialUrl:null, reservationUrl:"https://www.hotpepper.jp/strJ003516239/",
    tags:["海鮮居酒屋"], reasonSeeds:{budget:["価格の幅が広く、財布に合わせて選べる海鮮居酒屋"]}},
  {id:"koenji-bakadoshi", name:"高円寺 ばか同士。", genre:"創作料理", area:"高円寺", price:[2000,4999], vibe:"adventurousUnique",
    tags:["創作料理"], reasonSeeds:{adventurous:["名前からして気になる、創作料理の一軒"]}},

  // ── 食堂・定食(9) ──
  {id:"asagaya-amaterasu", name:"あまてらす 南阿佐ヶ谷", genre:"食堂", area:"南阿佐ヶ谷", price:[1000,1999], vibe:"soloQuick",
    tags:["鳥取系","スナック風食堂"], reasonSeeds:{solo:["肩肘張らずに入れる、スナック風の食堂"]}},
  {id:"asagaya-shinya-shokudo", name:"しんや食堂", genre:"食堂", area:"阿佐ヶ谷", price:[1000,1999], vibe:"soloQuick",
    tags:["食堂"], reasonSeeds:{quick:["昔ながらの食堂で、さっと済ませたい日に"]}},
  {id:"koenji-nagafuji", name:"ながふじ", genre:"食堂", area:"高円寺", price:[700,999], vibe:"budgetCasual",
    tags:["日替わり定食700円"], reasonSeeds:{budget:["日替わり定食が700円という、驚きの価格設定"]}},
  {id:"koenji-agemonya", name:"あげもんや", genre:"食堂", area:"高円寺", price:[1000,1999], vibe:"soloQuick",
    tags:["食堂"], reasonSeeds:{quick:["揚げ物中心の定食で、さっと満足感を得られる"]}},
  {id:"koenji-saikyozuke", name:"西京漬け専門店 魚き食堂", genre:"食堂", area:"高円寺", price:[2000,2999], vibe:"dateQuiet",
    tags:["西京漬け専門"], reasonSeeds:{calm:["西京漬けの上品な味わいを、落ち着いて楽しめる"]}},
  {id:"koenji-yashiro", name:"定食のヤシロ", genre:"食堂", area:"高円寺", price:[700,999], vibe:"budgetCasual",
    tags:["定食"], reasonSeeds:{budget:["定食一筋の、値段も気取らない一軒"]}},
  {id:"koenji-warajiya", name:"わらじや", genre:"食堂", area:"高円寺", price:[700,999], vibe:"soloQuick",
    tags:["食堂"], reasonSeeds:{solo:["ひとりでもさっと座れる、昔ながらの食堂"]}},
  {id:"koenji-daichan", name:"大ちゃん", genre:"食堂", area:"高円寺", price:[1000,1999], vibe:"familyHearty",
    tags:["食堂"], reasonSeeds:{hearty:["ボリュームのある定食で、家族でもしっかり満たされる"]}},
  {id:"koenji-sansei-shokudo", name:"三晴食堂", genre:"食堂", area:"高円寺", price:[700,999], vibe:"soloQuick",
    tags:["食堂"], reasonSeeds:{quick:["さっと入って、さっと食べられる定食屋"]}}
];

/* =========================================================
   追加店舗(第5弾: 口コミ件数の多さも重視して56件)
   ※食べログの「口コミ件数」「予約件数」が具体的に確認できた
     店を優先(例: 成都高円寺本店=口コミ10,255件、
     ジェラテリアシンチェリータ=口コミ1,772件 等)。
   ========================================================= */
const NEW_ROWS4 = [
  // ── 中華(9) ──
  {id:"asagaya-agariko-gyozaro", name:"アガリコ餃子楼 阿佐ヶ谷店", genre:"中華(餃子)", area:"阿佐ヶ谷", price:[2000,3000], vibe:"groupCasual",
    tags:["餃子","口コミ56件"], reasonSeeds:{friends:["餃子を何皿もシェアしながら、わいわい飲める"]}},
  {id:"asagaya-chugoku-meisai-son", name:"中國名菜 孫 阿佐ヶ谷店", genre:"中華", area:"阿佐ヶ谷", price:[3000,4000], vibe:"groupCasual",
    tags:["口コミ105件"], reasonSeeds:{friends:["口コミの多さも納得の、本格中華をみんなで"]}},
  {id:"asagaya-wantantei", name:"阿佐ヶ谷 わんたん亭", genre:"中華", area:"阿佐ヶ谷", price:[2000,3000], vibe:"soloQuick",
    tags:["ワンタン","口コミ79件"], reasonSeeds:{quick:["ワンタンを中心に、さっと食べられる中華"]}},
  {id:"asagaya-suikai", name:"中国料理 翠海", genre:"中華", area:"阿佐ヶ谷", price:[2000,3000], vibe:"groupCasual",
    tags:["口コミ153件・評価3.42"], reasonSeeds:{friends:["このエリアの中華の中でも評価の高い一軒"]}},
  {id:"koenji-chengdu-honten", name:"中華料理 成都 高円寺本店", genre:"中華", area:"高円寺", price:[3000,4000], vibe:"groupCasual",
    tags:["口コミ10,255件","圧倒的な人気"], reasonSeeds:{friends:["口コミ1万件超という圧倒的な人気を誇る中華の名店"], drinking:["中華とお酒の組み合わせで、盛り上がる夜に"]}},
  {id:"koenji-byanbyan-chengdu", name:"ビャンビャン麺 火鍋 成都", genre:"中華(麺・火鍋)", area:"高円寺", price:[3000,4000], vibe:"adventurousUnique",
    tags:["ビャンビャン麺","火鍋"], reasonSeeds:{adventurous:["ビャンビャン麺や火鍋という、いつもと違う中華体験"]}},
  {id:"koenji-dapaidan105", name:"ダパイダン105 高円寺東京本店", genre:"台湾料理", area:"高円寺", price:[2000,3000], vibe:"adventurousUnique",
    tags:["台湾料理"], reasonSeeds:{adventurous:["台湾料理という、いつもとは違う選択肢"]}},
  {id:"koenji-chinki-sakaba", name:"中華料理 陳記酒場", genre:"中華", area:"高円寺", price:[1000,2000], vibe:"budgetCasual",
    tags:["中華酒場"], reasonSeeds:{budget:["中華のつまみを、気張らない値段で"]}},
  {id:"koenji-shou-u", name:"中華創作料理 祥宇", genre:"中華(創作)", area:"高円寺", price:[2000,3000], vibe:"dateQuiet",
    tags:["創作中華"], reasonSeeds:{calm:["創作中華を、落ち着いた雰囲気でゆっくり"]}},

  // ── 寿司(1・超高級) ──
  {id:"asagaya-sushi-souten", name:"鮨 蒼天", genre:"寿司", area:"阿佐ヶ谷", price:[20000,29999], vibe:"dateSpecial",
    officialUrl:"https://sushi-aoi.com/", reservationUrl:"https://restaurant.ikyu.com/125057",
    tags:["超高級寿司","記念日"], reasonSeeds:{indulgent:["一生の思い出になるような、特別な寿司の夜に"], couple:["とっておきの記念日に、思い切って選びたい寿司店"]}},

  // ── とんかつ(3) ──
  {id:"koenji-futaba", name:"とんかつ二葉", genre:"とんかつ", area:"高円寺", price:[700,999], vibe:"soloQuick",
    tags:["オロシトンカツ定食"], reasonSeeds:{budget:["1000円以下から食べられる、気軽なとんかつ"]}},
  {id:"koenji-matsunaga", name:"とんかつ 松永", genre:"とんかつ", area:"高円寺", price:[1000,2000], vibe:"soloQuick",
    tags:["高円寺の老舗"], reasonSeeds:{solo:["高円寺で長く愛される、老舗のとんかつ屋"]}},
  {id:"koenji-fuji-tonkatsu", name:"富士", genre:"とんかつ・居酒屋", area:"高円寺", price:[3000,4000], vibe:"groupCasual",
    officialUrl:null, reservationUrl:"https://tabelog.com/tokyo/A1319/A131904/13082909/",
    tags:["居酒屋併設"], reasonSeeds:{friends:["とんかつだけでなく、飲みにも使える一軒"]}},

  // ── バー・高円寺(10) ──
  {id:"koenji-bakushukobo", name:"高円寺麦酒工房", genre:"ビアバー", area:"高円寺", price:[3000,4000], vibe:"stylishDrink",
    tags:["クラフトビール"], reasonSeeds:{stylish:["自家醸造にこだわるビアバーで、飲み比べを楽しむ"]}},
  {id:"koenji-watashi", name:"私", genre:"バー", area:"高円寺", price:[3000,4000], vibe:"soloDrink",
    tags:["隠れ家バー"], reasonSeeds:{calm:["名前も佇まいも静かな、隠れ家的バー"]}},
  {id:"koenji-sake-kokon", name:"Sake bar KoKoN", genre:"日本酒バー", area:"高円寺", price:[5000,6000], vibe:"dateQuiet",
    tags:["日本酒専門"], reasonSeeds:{couple:["日本酒を選びながら、ふたりで静かに過ごす夜に"]}},
  {id:"koenji-substance", name:"サブスタンス", genre:"バー", area:"高円寺", price:[3000,4000], vibe:"stylishDrink",
    tags:["バー"], reasonSeeds:{stylish:["洗練された空間で、大人の一杯を"]}},
  {id:"koenji-tsukemono-bar", name:"漬物BAR4328 参号店", genre:"バー", area:"高円寺", price:[1000,2000], vibe:"adventurousUnique",
    tags:["漬物×お酒"], reasonSeeds:{adventurous:["漬物をアテに飲むという、他にはない発想のバー"]}},
  {id:"koenji-hako-bar", name:"ハコ バー", genre:"ワインバー", area:"高円寺", price:[3000,4000], vibe:"stylishDrink",
    tags:["ワイン"], reasonSeeds:{stylish:["箱のような小さな空間で、ワインを気軽に"]}},
  {id:"koenji-beaujolais-mura", name:"ボジョレー村", genre:"ワインバー", area:"高円寺", price:[4000,5000], vibe:"dateQuiet",
    tags:["ワイン専門"], reasonSeeds:{couple:["ワインを選ぶ時間も含めて、ふたりで楽しめる"]}},
  {id:"koenji-doggie-boogie", name:"ドギーブギー", genre:"バー", area:"高円寺", price:[2000,3000], vibe:"adventurousUnique",
    tags:["個性的な名前のバー"], reasonSeeds:{adventurous:["名前からして気になる、遊び心のあるバー"]}},
  {id:"koenji-bia-engine", name:"ビア エンジン", genre:"ビアバー", area:"高円寺", price:[3000,4000], vibe:"groupCasual",
    tags:["クラフトビール"], reasonSeeds:{friends:["ビールの種類が豊富で、みんなで飲み比べできる"]}},
  {id:"koenji-mowa", name:"MOWA", genre:"日本酒バー", area:"高円寺", price:[3000,4000], vibe:"dateQuiet",
    tags:["日本酒"], reasonSeeds:{calm:["日本酒を静かに味わう、落ち着いたバー"]}},

  // ── バー・阿佐ヶ谷(10) ──
  {id:"asagaya-olla", name:"olla", genre:"ビアバー", area:"阿佐ヶ谷", price:[3000,4000], vibe:"stylishDrink",
    tags:["クラフトビール"], reasonSeeds:{stylish:["おしゃれなビアバーで、気の利いた一杯を"]}},
  {id:"asagaya-sakenomitsuya", name:"酒ノみつや", genre:"日本酒バー", area:"阿佐ヶ谷", price:[700,999], vibe:"soloDrink",
    tags:["立ち飲み日本酒","安め"], reasonSeeds:{budget:["1000円以下からの日本酒立ち飲みで、気軽に一杯"]}},
  {id:"asagaya-cafe-bar-rigid", name:"CAFE&BAR RIGID", genre:"バー", area:"阿佐ヶ谷", price:[3000,4000], vibe:"stylishDrink",
    tags:["カフェ&バー"], reasonSeeds:{stylish:["昼はカフェ、夜はバーという二つの顔を持つ空間"]}},
  {id:"asagaya-misty-opus", name:"ミスティー オーパース", genre:"バー", area:"阿佐ヶ谷", price:[3000,4000], vibe:"dateQuiet",
    tags:["バー"], reasonSeeds:{calm:["落ち着いた大人の時間を過ごせるバー"]}},
  {id:"asagaya-supersub", name:"スーパーサブ", genre:"ワインバー", area:"阿佐ヶ谷", price:[2000,3000], vibe:"adventurousUnique",
    tags:["ワイン"], reasonSeeds:{adventurous:["個性的な名前の、気取らないワインバー"]}},
  {id:"asagaya-loft-a", name:"阿佐ヶ谷ロフトA", genre:"バー", area:"阿佐ヶ谷", price:[3000,4000], vibe:"groupCasual",
    tags:["ライブ感のある空間"], reasonSeeds:{friends:["賑やかな雰囲気の中で、友達とわいわい飲める"]}},
  {id:"asagaya-under-the-tree", name:"アンダーザツリー", genre:"日本酒バー", area:"阿佐ヶ谷", price:[3000,4000], vibe:"dateQuiet",
    tags:["日本酒"], reasonSeeds:{calm:["木陰にいるような、落ち着いた日本酒バー"]}},
  {id:"asagaya-shukou-fufufu", name:"酒肴 ふふふ", genre:"日本酒バー", area:"阿佐ヶ谷", price:[4000,5000], vibe:"dateQuiet",
    tags:["酒肴"], reasonSeeds:{couple:["酒肴を楽しみながら、ふたりでゆっくり飲める"]}},
  {id:"asagaya-claviere", name:"クラヴィーア", genre:"バー", area:"阿佐ヶ谷", price:[2000,3000], vibe:"stylishDrink",
    tags:["バー"], reasonSeeds:{stylish:["音楽的な名前の、洒落た雰囲気のバー"]}},
  {id:"asagaya-kinokura", name:"木の蔵", genre:"ワインバー", area:"阿佐ヶ谷", price:[2000,3000], vibe:"dateQuiet",
    tags:["木の温もり"], reasonSeeds:{calm:["木の温もりを感じる空間で、静かにワインを"]}},

  // ── 焼き鳥・高円寺(8) ──
  {id:"koenji-odoridori", name:"高円寺おどり鳥", genre:"焼き鳥", area:"高円寺", price:[6000,8000], vibe:"dateSpecial",
    tags:["少し贅沢な焼き鳥"], reasonSeeds:{indulgent:["名物の焼き鳥を、少し贅沢な夜のメインに"]}},
  {id:"koenji-torisuke", name:"とりすけ", genre:"焼き鳥", area:"高円寺", price:[4000,5000], vibe:"groupCasual",
    tags:["焼き鳥"], reasonSeeds:{friends:["焼き鳥をつまみに、気取らず飲める"]}},
  {id:"koenji-daichi-sushi-yakitori", name:"寿司と焼き鳥 大地 高円寺店", genre:"焼き鳥", area:"高円寺", price:[3000,4000], vibe:"groupCasual",
    tags:["寿司と焼き鳥","予約3,000件超の人気"], reasonSeeds:{friends:["寿司も焼き鳥もある、選択肢の広さが嬉しい"]}},
  {id:"koenji-wine-yakitori", name:"ワインとやきとり 東高円寺", genre:"焼き鳥・ワイン", area:"高円寺", price:[4000,5000], vibe:"stylishDrink",
    tags:["焼き鳥×ワイン"], reasonSeeds:{stylish:["焼き鳥にワインを合わせる、新しい組み合わせ"]}},
  {id:"koenji-shutsujin-higashi", name:"炭火焼きとん焼鶏 出陣 東高円寺店", genre:"やきとん・焼き鳥", area:"高円寺", price:[4000,5000], vibe:"groupCasual",
    officialUrl:null, reservationUrl:"https://www.hotpepper.jp/strJ003497090/",
    tags:["炭火"], reasonSeeds:{drinking:["炭火で焼く肉をつまみに、じっくり飲める"]}},
  {id:"koenji-tomimaru", name:"焼きとり おでん 富まる", genre:"焼き鳥・おでん", area:"高円寺", price:[2000,3000], vibe:"budgetCasual",
    tags:["おでん"], reasonSeeds:{budget:["焼き鳥とおでん、両方楽しめて価格も手頃"]}},
  {id:"koenji-tori-jiro", name:"炭火串焼 鶏ジロー 新高円寺店", genre:"焼き鳥", area:"高円寺", price:[2000,3000], vibe:"budgetCasual",
    tags:["炭火串焼き"], reasonSeeds:{budget:["炭火の串焼きを、気張らない価格で"]}},
  {id:"koenji-shutsujin", name:"炭火 焼とん 焼鳥 出陣", genre:"やきとん・焼き鳥", area:"高円寺", price:[3000,4000], vibe:"groupCasual",
    officialUrl:null, reservationUrl:"https://www.hotpepper.jp/strJ003473405/",
    tags:["炭火"], reasonSeeds:{friends:["焼とんと焼き鳥、両方をつまみにわいわい"]}},

  // ── スイーツ(7・口コミ数重視) ──
  {id:"asagaya-cincirella", name:"ジェラテリア シンチェリータ", genre:"ジェラート", area:"阿佐ヶ谷", price:[700,999], vibe:"soloQuick",
    tags:["口コミ1,772件","圧倒的人気"], reasonSeeds:{quick:["口コミ1,700件超、このエリア随一の人気ジェラート"], solo:["食後にひとりでふらっと寄れるジェラート店"]}},
  {id:"asagaya-tomoean", name:"ともえ庵", genre:"たい焼き", area:"阿佐ヶ谷", price:[700,999], vibe:"soloQuick",
    tags:["たい焼き","口コミ384件"], reasonSeeds:{quick:["食後の締めに、たい焼きをひとつ"]}},
  {id:"asagaya-gyunyuya-soft", name:"牛乳屋さんのソフトクリーム", genre:"ソフトクリーム", area:"阿佐ヶ谷", price:[700,999], vibe:"soloQuick",
    tags:["口コミ174件"], reasonSeeds:{quick:["濃厚なソフトクリームで、軽く締めくくる"]}},
  {id:"koenji-lapre-cochere", name:"パティスリー ラブリコチエ", genre:"ケーキ", area:"高円寺", price:[700,999], vibe:"dateQuiet",
    tags:["口コミ912件"], reasonSeeds:{couple:["評判のケーキを、ふたりで分け合う締めくくりに"]}},
  {id:"koenji-trianon", name:"トリアノン洋菓子店 高円寺本店", genre:"洋菓子", area:"高円寺", price:[700,999], vibe:"familyHearty",
    tags:["老舗","口コミ472件"], reasonSeeds:{family:["地元で長く愛される洋菓子店、家族の締めくくりに"]}},
  {id:"koenji-florestas", name:"フロレスタ 高円寺店", genre:"ドーナツ", area:"高円寺", price:[700,999], vibe:"groupCasual",
    tags:["自然素材ドーナツ"], reasonSeeds:{friends:["ドーナツを何個か選んで、みんなでシェア"]}},
  {id:"koenji-beta-stand", name:"β STAND", genre:"クレープ", area:"高円寺", price:[1000,2000], vibe:"adventurousUnique",
    tags:["クレープ・ガレット"], reasonSeeds:{adventurous:["いつものデザートとはひと味違うクレープ・ガレット"]}},

  // ── フレンチ(5) ──
  {id:"asagaya-bistrot33", name:"Bistrot33 santrois", genre:"フレンチ", area:"阿佐ヶ谷", price:[5000,6000], vibe:"dateQuiet",
    tags:["ビストロ"], reasonSeeds:{couple:["ビストロらしい気取らない雰囲気で、ふたりの夜を"]}},
  {id:"asagaya-le-terroir", name:"ビストロ ル・テロワール 阿佐ヶ谷", genre:"フレンチ(ビストロ)", area:"阿佐ヶ谷", price:[5000,6000], vibe:"dateQuiet",
    tags:["ビストロ"], reasonSeeds:{calm:["土地の恵みを生かした料理を、落ち着いて味わう"]}},
  {id:"asagaya-ruvi", name:"RUVI", genre:"フレンチ", area:"阿佐ヶ谷", price:[5000,6000], vibe:"dateSpecial",
    officialUrl:null, reservationUrl:"https://www.hotpepper.jp/strJ001139666/",
    tags:["フレンチ"], reasonSeeds:{indulgent:["少し特別な日のフレンチとして選びたい一軒"]}},
  {id:"asagaya-meat-kitchen-harmers", name:"Meat Kitchen HARMER's GRILL", genre:"洋食・グリル", area:"阿佐ヶ谷", price:[5000,6000], vibe:"groupCasual",
    tags:["肉料理","グリル"], reasonSeeds:{friends:["肉料理を中心に、みんなでシェアしながら楽しめる"]}},
  {id:"asagaya-101-anzeroan", name:"101アンゼロアン", genre:"フレンチ", area:"阿佐ヶ谷", price:[3000,4000], vibe:"dateQuiet",
    tags:["フレンチ"], reasonSeeds:{calm:["手が届く価格帯のフレンチで、ゆっくり過ごせる"]}},

  // ── 韓国料理・高円寺(3) ──
  {id:"koenji-millineyangkopchang", name:"ミリネヤンコプチャン 高円寺店", genre:"韓国料理", area:"高円寺", price:[4000,5000], vibe:"groupCasual",
    tags:["京都ミシュラン掲載の技","予約6,531件"], reasonSeeds:{friends:["ミシュラン掲載店仕込みの技を、みんなで楽しめる"], drinking:["ホルモンをつまみに、じっくり飲める夜に"]}},
  {id:"koenji-omnimatt", name:"おむにまっ", genre:"韓国料理", area:"高円寺", price:[2000,3000], vibe:"groupCasual",
    tags:["韓国料理"], reasonSeeds:{friends:["取り分けて楽しむ韓国料理で、わいわい過ごせる"]}},
  {id:"koenji-halhal", name:"ハルハル", genre:"韓国料理", area:"高円寺", price:[2000,3000], vibe:"groupCasual",
    tags:["韓国料理"], reasonSeeds:{friends:["気軽な韓国料理店で、友達との時間を"]}}
];

/* =========================================================
   追加店舗(第6弾: カフェ・洋食・定食・ラーメン残り 49件)
   ========================================================= */
const NEW_ROWS5 = [
  // ── カフェ・阿佐ヶ谷(10) ──
  {id:"asagaya-gion", name:"ギオン", genre:"喫茶店", area:"阿佐ヶ谷", price:[1000,2000], vibe:"dateQuiet",
    tags:["口コミ592件","老舗喫茶"], reasonSeeds:{calm:["口コミ600件近い、地元で愛される老舗喫茶"]}},
  {id:"asagaya-hachicafe", name:"ハチカフェ 阿佐ヶ谷店", genre:"カフェ", area:"阿佐ヶ谷", price:[1000,2000], vibe:"groupCasual",
    tags:["口コミ225件"], reasonSeeds:{friends:["気軽に入れるカフェで、ランチ後のひと休みに"]}},
  {id:"asagaya-penguin-cafe", name:"ペンギン カフェ", genre:"カフェ", area:"阿佐ヶ谷", price:[1000,2000], vibe:"dateQuiet",
    tags:["口コミ106件"], reasonSeeds:{calm:["名前の通り、ほっとひと息つける空間"]}},
  {id:"asagaya-dodonaea", name:"ドドナエア", genre:"カフェ", area:"阿佐ヶ谷", price:[1000,2000], vibe:"adventurousUnique",
    tags:["個性的な名前のカフェ"], reasonSeeds:{adventurous:["珍しい名前の通り、個性のあるカフェ体験"]}},
  {id:"asagaya-coffee-bake-achoo", name:"COFFEE&BAKE achoo!", genre:"カフェ", area:"阿佐ヶ谷", price:[1000,2000], vibe:"soloQuick",
    tags:["コーヒー&焼き菓子"], reasonSeeds:{quick:["コーヒーと焼き菓子で、さっとひと休み"]}},
  {id:"asagaya-panda-coffee", name:"ぱんだ珈琲店", genre:"カフェ", area:"阿佐ヶ谷", price:[1000,2000], vibe:"soloQuick",
    tags:["口コミ206件"], reasonSeeds:{solo:["ひとりでふらっと寄れる、地域で人気の珈琲店"]}},
  {id:"asagaya-fresco-coffee", name:"フレスコ コーヒーロースターズ", genre:"コーヒースタンド", area:"阿佐ヶ谷", price:[700,999], vibe:"soloQuick",
    tags:["自家焙煎"], reasonSeeds:{quick:["自家焙煎のコーヒーを、立ち寄りでさっと"]}},
  {id:"asagaya-cafe-de-wing", name:"カフェ・ド・ウィング", genre:"喫茶店", area:"阿佐ヶ谷", price:[1000,2000], vibe:"dateQuiet",
    tags:["喫茶店"], reasonSeeds:{calm:["昔ながらの喫茶店らしい、落ち着いた時間"]}},
  {id:"asagaya-kuroneko-sabo", name:"黒猫茶房", genre:"喫茶店", area:"阿佐ヶ谷", price:[1000,2000], vibe:"dateQuiet",
    tags:["喫茶店"], reasonSeeds:{calm:["猫の名を冠した、静かで居心地のいい茶房"]}},
  {id:"asagaya-parlor-l", name:"パーラーエル", genre:"喫茶店", area:"阿佐ヶ谷", price:[700,999], vibe:"soloQuick",
    tags:["喫茶店"], reasonSeeds:{quick:["昔ながらのパーラーで、さっとひと休み"]}},

  // ── カフェ・高円寺(10) ──
  {id:"koenji-nanatsumori", name:"七つ森", genre:"喫茶店", area:"高円寺", price:[1000,2000], vibe:"dateQuiet",
    tags:["口コミ663件"], reasonSeeds:{calm:["口コミ600件超、地域屈指の人気喫茶店"]}},
  {id:"koenji-poeme-mano", name:"ぽえむ マノ ア マノ コーヒー 高円寺南口店", genre:"喫茶店", area:"高円寺", price:[2000,3000], vibe:"dateQuiet",
    tags:["口コミ660件"], reasonSeeds:{couple:["じっくり淹れるコーヒーを、ふたりでゆっくり"]}},
  {id:"koenji-rad-bros", name:"RAD BROS CAFE", genre:"カフェ", area:"高円寺", price:[1000,2000], vibe:"groupCasual",
    tags:["口コミ334件"], reasonSeeds:{friends:["賑やかな雰囲気で、友達との時間にちょうどいい"]}},
  {id:"koenji-aruza-dokushokan", name:"アール座読書館", genre:"カフェ", area:"高円寺", price:[700,999], vibe:"dateQuiet",
    tags:["読書がテーマ"], reasonSeeds:{calm:["本に囲まれて、静かに過ごせる読書カフェ"]}},
  {id:"koenji-nostalgia-cafe", name:"NOSTALGIA CAFE", genre:"カフェ", area:"高円寺", price:[1000,2000], vibe:"adventurousUnique",
    tags:["ノスタルジックな内装"], reasonSeeds:{adventurous:["ノスタルジックな内装で、いつもと違う時間旅行を"]}},
  {id:"koenji-aimu", name:"AIMU", genre:"カフェ", area:"高円寺", price:[1000,2000], vibe:"dateQuiet",
    tags:["口コミ239件"], reasonSeeds:{calm:["落ち着いた空間で、静かに会話を楽しめる"]}},
  {id:"koenji-neyo", name:"NEYO", genre:"カフェ", area:"高円寺", price:[1000,2000], vibe:"groupCasual",
    tags:["口コミ259件"], reasonSeeds:{friends:["友達と気軽に立ち寄れる人気カフェ"]}},
  {id:"koenji-tabisuru-kissa", name:"旅する喫茶", genre:"喫茶店", area:"高円寺", price:[1000,2000], vibe:"adventurousUnique",
    tags:["旅がテーマ"], reasonSeeds:{adventurous:["旅をテーマにした空間で、いつもと違う気分に"]}},
  {id:"koenji-taw", name:"TAW.", genre:"カフェ", area:"高円寺", price:[1000,2000], vibe:"dateQuiet",
    tags:["口コミ210件"], reasonSeeds:{calm:["シンプルで洗練された空間で、ゆっくり過ごせる"]}},
  {id:"koenji-nerken", name:"ネルケン", genre:"喫茶店", area:"高円寺", price:[700,999], vibe:"soloQuick",
    tags:["喫茶店"], reasonSeeds:{quick:["昔ながらの喫茶店で、さっとひと息"]}},

  // ── 洋食(4) ──
  {id:"asagaya-tando-tan", name:"洋食 タンドタン", genre:"洋食", area:"阿佐ヶ谷", price:[2000,3000], vibe:"groupCasual",
    tags:["洋食"], reasonSeeds:{friends:["洋食の定番メニューを、気軽にみんなで"]}},
  {id:"koenji-kuronbo", name:"クロンボ", genre:"洋食", area:"高円寺", price:[700,999], vibe:"soloQuick",
    tags:["口コミ322件","エリア最安値帯"], reasonSeeds:{budget:["このエリアの洋食では最安値クラス、ひとりでもさっと"]}},
  {id:"koenji-kitchen-fuji", name:"キッチン フジ", genre:"洋食", area:"高円寺", price:[700,999], vibe:"familyHearty",
    tags:["高円寺の老舗"], reasonSeeds:{family:["高円寺で長く愛される、老舗洋食の味"]}},
  {id:"koenji-light-side-cafe", name:"light side cafe", genre:"洋食", area:"高円寺", price:[2000,3000], vibe:"dateQuiet",
    tags:["洋食カフェ"], reasonSeeds:{calm:["カフェのような雰囲気で、洋食をゆっくり楽しめる"]}},

  // ── 食堂・定食(14) ──
  {id:"asagaya-chawan-beans", name:"chawan ビーンズ阿佐ヶ谷店", genre:"食堂", area:"阿佐ヶ谷", price:[1000,2000], vibe:"soloQuick",
    tags:["駅近"], reasonSeeds:{quick:["駅近ですぐ入れる、気軽な食堂"]}},
  {id:"asagaya-bancho-shokudo", name:"食堂ばんちょう", genre:"食堂", area:"阿佐ヶ谷", price:[1000,2000], vibe:"familyHearty",
    tags:["羽釜炊きご飯"], reasonSeeds:{hearty:["羽釜で炊いたご飯が自慢の、しっかり系食堂"]}},
  {id:"asagaya-asagaya-shokudo", name:"あさがや食堂", genre:"食堂", area:"阿佐ヶ谷", price:[1000,2000], vibe:"soloQuick",
    tags:["焼き魚定食"], reasonSeeds:{solo:["焼き魚定食を、ひとりでほっと味わえる"]}},
  {id:"asagaya-mammy-menchi", name:"マミーメンチ", genre:"食堂", area:"阿佐ヶ谷", price:[1000,2000], vibe:"budgetCasual",
    tags:["メンチカツ"], reasonSeeds:{budget:["メンチカツが名物の、気取らない食堂"]}},
  {id:"koenji-kitchen-nankai", name:"キッチン 南海 高円寺店", genre:"食堂", area:"高円寺", price:[1000,2000], vibe:"familyHearty",
    tags:["洋食系食堂"], reasonSeeds:{hearty:["ボリュームのある洋食系メニューで満足感"]}},
  {id:"koenji-yanagiya", name:"定食ハウス やなぎや", genre:"食堂", area:"高円寺", price:[700,999], vibe:"budgetCasual",
    tags:["定食"], reasonSeeds:{budget:["定食一本で、値段も気取らない一軒"]}},
  {id:"koenji-kadoichi", name:"門一", genre:"食堂", area:"高円寺", price:[1000,2000], vibe:"soloQuick",
    tags:["食堂"], reasonSeeds:{quick:["ひとりでもさっと入れる、地元の食堂"]}},
  {id:"koenji-maruchan", name:"お食事 まるちゃん", genre:"食堂", area:"高円寺", price:[1000,1999], vibe:"budgetCasual",
    tags:["食堂"], reasonSeeds:{budget:["気取らない値段で、しっかりごはんが食べられる"]}},
  {id:"koenji-washokudo-fudo", name:"和食堂 風土", genre:"食堂", area:"高円寺", price:[1000,2000], vibe:"dateQuiet",
    tags:["和食"], reasonSeeds:{calm:["和食を中心に、落ち着いて食事ができる"]}},
  {id:"koenji-oshokuji-iida", name:"御食事 飯田", genre:"食堂", area:"高円寺", price:[700,999], vibe:"soloQuick",
    tags:["食堂"], reasonSeeds:{quick:["昔ながらの食堂で、さっと済ませたい日に"]}},
  {id:"koenji-murata", name:"むらた", genre:"食堂", area:"高円寺", price:[1000,2000], vibe:"soloQuick",
    tags:["食堂"], reasonSeeds:{solo:["ひとりでも入りやすい、落ち着いた食堂"]}},
  {id:"koenji-gohan-cafe-kimito", name:"ごはん＆カフェ きみと", genre:"カフェ食堂", area:"高円寺", price:[1000,2000], vibe:"dateQuiet",
    tags:["カフェのようなごはん屋"], reasonSeeds:{calm:["カフェのような空気感で、ごはんをゆっくり"]}},
  {id:"koenji-osakana-teishoku", name:"おさかな定食屋さん", genre:"食堂", area:"高円寺", price:[1000,2000], vibe:"soloQuick",
    tags:["魚料理中心"], reasonSeeds:{solo:["魚中心の定食を、ひとりでほっと味わえる"]}},
  {id:"koenji-kosugiyu-tonari", name:"小杉湯となり", genre:"カフェ", area:"高円寺", price:[1000,2000], vibe:"dateQuiet",
    tags:["銭湯併設のカフェ"], reasonSeeds:{calm:["銭湯のとなりという、他にはない癒やしの立地"]}},

  // ── ラーメン(7) ──
  {id:"asagaya-nidaime-genkotsuya", name:"二代目げんこつ屋 阿佐ヶ谷南口店", genre:"家系ラーメン", area:"阿佐ヶ谷", price:[1000,2000], vibe:"familyHearty",
    tags:["家系"], reasonSeeds:{hearty:["家系らしいがっつりスープで満足感"]}},
  {id:"asagaya-kurosuke", name:"らーめん処 くろ助", genre:"ラーメン", area:"阿佐ヶ谷", price:[1000,2000], vibe:"soloQuick",
    tags:["醤油ラーメン"], reasonSeeds:{solo:["醤油の効いた一杯を、ひとりでじっくり"]}},
  {id:"asagaya-manpukuhonpo", name:"萬福本舗", genre:"ラーメン", area:"阿佐ヶ谷", price:[1000,2000], vibe:"soloQuick",
    tags:["ラーメン"], reasonSeeds:{quick:["標準的な一杯を、さっと食べたい日に"]}},
  {id:"asagaya-waganahaneko", name:"吾ガ輩ハネコ", genre:"ラーメン", area:"阿佐ヶ谷", price:[700,999], vibe:"soloQuick",
    tags:["個性的な店名"], reasonSeeds:{adventurous:["個性的な店名の通り、気になる一杯"]}},
  {id:"asagaya-tokyo-gurecchi", name:"中華そば 東京ぐれっち", genre:"ラーメン", area:"阿佐ヶ谷", price:[1000,2000], vibe:"soloQuick",
    tags:["中華そば"], reasonSeeds:{solo:["中華そばらしい澄んだスープを、ひとりで"]}},
  {id:"koenji-niboshi-ginsei", name:"煮干し中華そば 麺屋 銀星 高円寺", genre:"つけ麺", area:"高円寺", price:[700,999], vibe:"soloQuick",
    tags:["煮干し系"], reasonSeeds:{quick:["煮干しの効いたつけ麺を、さっと一杯"]}},
  {id:"koenji-ichizo", name:"らーめん一蔵", genre:"味噌ラーメン", area:"高円寺", price:[1000,2000], vibe:"familyHearty",
    tags:["辛味噌"], reasonSeeds:{hearty:["辛味噌のガツンとくる一杯で満足感"]}},

  // ── スイーツ追加(4) ──
  {id:"asagaya-toraya-tsubakiyama", name:"とらや椿山", genre:"和菓子", area:"阿佐ヶ谷", price:[700,999], vibe:"soloQuick",
    tags:["和菓子","口コミ115件"], reasonSeeds:{quick:["食後の甘味に、和菓子をひとつ"]}},
  {id:"koenji-patissier-junhomma", name:"パティシエ ジュン ホンマ 高円寺", genre:"ケーキ", area:"高円寺", price:[700,999], vibe:"dateQuiet",
    tags:["口コミ201件"], reasonSeeds:{couple:["評判のケーキを、ふたりで分け合う締めくくりに"]}},
  {id:"koenji-san-crepe", name:"サン・くれーぷ", genre:"クレープ", area:"高円寺", price:[700,999], vibe:"soloQuick",
    tags:["クレープ"], reasonSeeds:{quick:["食後にクレープをひとつ、軽い締めくくりに"]}},
  {id:"koenji-shimizuya", name:"清水屋", genre:"和菓子", area:"高円寺", price:[1000,2000], vibe:"familyHearty",
    tags:["和菓子"], reasonSeeds:{family:["地元で長く愛される和菓子店、手土産にも"]}}
];

/* =========================================================
   追加店舗(第7弾: スイーツ・バー残り 34件、300件到達分)
   ========================================================= */
const NEW_ROWS6 = [
  // ── スイーツ・阿佐ヶ谷(9) ──
  {id:"asagaya-budo-kamakuraza", name:"ぶどうの木＆鎌倉座 阿佐谷トータルショップ", genre:"ケーキ", area:"阿佐ヶ谷", price:[1000,2000], vibe:"familyHearty",
    tags:["ケーキ"], reasonSeeds:{family:["手土産にもなるケーキを、家族の締めくくりに"]}},
  {id:"asagaya-rustica", name:"ルスティカ菓子店", genre:"洋菓子", area:"阿佐ヶ谷", price:[1000,2000], vibe:"dateQuiet",
    tags:["洋菓子"], reasonSeeds:{calm:["丁寧な洋菓子を、静かに味わう締めくくりに"]}},
  {id:"asagaya-tsukitokurumi", name:"ツキトクルミ", genre:"かき氷", area:"阿佐ヶ谷", price:[1000,2000], vibe:"adventurousUnique",
    tags:["かき氷"], reasonSeeds:{adventurous:["季節のかき氷で、いつもと違うデザートの時間"]}},
  {id:"asagaya-sunset-cookies", name:"サンセット クッキーズ ジャスミン", genre:"ケーキ", area:"阿佐ヶ谷", price:[1000,2000], vibe:"groupCasual",
    tags:["ケーキ"], reasonSeeds:{friends:["名前も可愛いケーキ店で、みんなでシェア"]}},
  {id:"asagaya-arindo", name:"ありん堂", genre:"和菓子", area:"阿佐ヶ谷", price:[700,999], vibe:"soloQuick",
    tags:["和菓子"], reasonSeeds:{quick:["食後の和菓子を、さっとひとつ"]}},
  {id:"asagaya-patisserie-hana", name:"パティスリー華", genre:"ケーキ", area:"阿佐ヶ谷", price:[700,999], vibe:"dateQuiet",
    tags:["ケーキ"], reasonSeeds:{couple:["繊細なケーキを、ふたりで分け合う締めくくりに"]}},
  {id:"asagaya-fukukichi", name:"福吉", genre:"和菓子", area:"阿佐ヶ谷", price:[1000,2000], vibe:"familyHearty",
    tags:["和菓子"], reasonSeeds:{family:["縁起の良い名前の和菓子店、手土産にも"]}},
  {id:"asagaya-masuya", name:"マスヤ", genre:"和菓子", area:"阿佐ヶ谷", price:[700,999], vibe:"soloQuick",
    tags:["和菓子"], reasonSeeds:{quick:["昔ながらの和菓子を、さっと買って帰れる"]}},
  {id:"asagaya-cinq-jours", name:"Cinq jours", genre:"洋菓子", area:"阿佐ヶ谷", price:[1000,2000], vibe:"dateQuiet",
    tags:["洋菓子"], reasonSeeds:{calm:["洗練された洋菓子で、静かな締めくくりを"]}},

  // ── スイーツ・高円寺(9) ──
  {id:"koenji-patisserie-chacoli", name:"カフェ ド パティスリー チャコリ", genre:"ケーキ", area:"高円寺", price:[700,999], vibe:"dateQuiet",
    tags:["ケーキ"], reasonSeeds:{couple:["カフェ併設のパティスリーで、ふたりでゆっくり"]}},
  {id:"koenji-kakigori-fuurindo", name:"カキ氷 フウリン堂", genre:"かき氷", area:"高円寺", price:[1000,2000], vibe:"adventurousUnique",
    tags:["かき氷"], reasonSeeds:{adventurous:["季節限定のかき氷で、いつもと違う一皿を"]}},
  {id:"koenji-patisserie-copeau", name:"パティスリー コポー", genre:"ケーキ", area:"高円寺", price:[700,999], vibe:"dateQuiet",
    tags:["口コミ53件"], reasonSeeds:{calm:["丁寧に作られたケーキで、静かな締めくくりを"]}},
  {id:"koenji-donut-you-and", name:"ドーナツショップ YOU AND", genre:"ドーナツ", area:"高円寺", price:[700,999], vibe:"groupCasual",
    tags:["ドーナツ"], reasonSeeds:{friends:["ドーナツを何個か選んで、みんなでシェア"]}},
  {id:"koenji-shugoro", name:"周五郎", genre:"ケーキ", area:"高円寺", price:[700,999], vibe:"dateQuiet",
    tags:["ケーキ"], reasonSeeds:{calm:["落ち着いた和の名前の、ケーキの締めくくりに"]}},
  {id:"koenji-black-mountain", name:"ブラックマウンテン", genre:"ケーキ", area:"高円寺", price:[700,999], vibe:"adventurousUnique",
    tags:["ケーキ"], reasonSeeds:{adventurous:["個性的な店名の通り、ひと味違うケーキ体験"]}},
  {id:"koenji-shirotokuro", name:"しろとくろ", genre:"ジェラート", area:"高円寺", price:[700,999], vibe:"soloQuick",
    tags:["ジェラート"], reasonSeeds:{quick:["食後にジェラートをひとつ、軽い締めくくりに"]}},
  {id:"koenji-umemura", name:"梅むら", genre:"和菓子", area:"高円寺", price:[700,999], vibe:"soloQuick",
    tags:["和菓子"], reasonSeeds:{quick:["昔ながらの和菓子を、さっと買って帰れる"]}},
  {id:"koenji-mynt", name:"MYNT", genre:"ケーキ", area:"高円寺", price:[700,999], vibe:"dateQuiet",
    tags:["ケーキ"], reasonSeeds:{couple:["シンプルで上品なケーキを、ふたりで"]}},

  // ── バー・高円寺(7) ──
  {id:"koenji-toiown", name:"十話音 toi-own", genre:"バー", area:"高円寺", price:[1000,2000], vibe:"dateQuiet",
    tags:["バー"], reasonSeeds:{calm:["静かな音の響く空間で、落ち着いて過ごせる"]}},
  {id:"koenji-ampoule", name:"アンプール", genre:"バー", area:"高円寺", price:[2000,3000], vibe:"stylishDrink",
    tags:["バー"], reasonSeeds:{stylish:["洗練された一杯を楽しめる、大人のバー"]}},
  {id:"koenji-uroko", name:"uroko", genre:"ワインバー", area:"高円寺", price:[3000,4000], vibe:"dateQuiet",
    tags:["ワイン"], reasonSeeds:{couple:["ワインを選びながら、ふたりで静かに過ごせる"]}},
  {id:"koenji-a-wine-house", name:"A WINE HOUSE", genre:"ワインバー", area:"高円寺", price:[1000,2000], vibe:"budgetCasual",
    tags:["ワイン","手頃な価格"], reasonSeeds:{budget:["手頃な価格でワインを楽しめる、気軽なワインバー"]}},
  {id:"koenji-bar-chico", name:"バー チコ 高円寺店", genre:"バー", area:"高円寺", price:[1000,2000], vibe:"soloDrink",
    tags:["バー"], reasonSeeds:{solo:["ひとりでもふらっと寄れる、気軽なバー"]}},
  {id:"koenji-post", name:"ポスト", genre:"バー", area:"高円寺", price:[3000,4000], vibe:"dateQuiet",
    tags:["バー"], reasonSeeds:{calm:["ポストという名の通り、日々の区切りに立ち寄れる"]}},
  {id:"koenji-alba-en", name:"ALBA 圓", genre:"バー", area:"高円寺", price:[2000,3000], vibe:"stylishDrink",
    tags:["バー"], reasonSeeds:{stylish:["洒落た雰囲気で、大人の時間を過ごせるバー"]}},

  // ── バー・阿佐ヶ谷(9) ──
  {id:"asagaya-golden-slumber", name:"ゴールデンスランバー", genre:"バー", area:"阿佐ヶ谷", price:[2000,3000], vibe:"adventurousUnique",
    tags:["音楽的な店名"], reasonSeeds:{adventurous:["音楽好きの心をくすぐる名前のバー"]}},
  {id:"asagaya-yoru-cafe-popotto", name:"夜カフェ ポポット", genre:"バー", area:"阿佐ヶ谷", price:[700,999], vibe:"soloQuick",
    tags:["夜カフェ"], reasonSeeds:{solo:["カフェのような気軽さで、夜にひとり立ち寄れる"]}},
  {id:"asagaya-jazz-bar-donngaraku", name:"ジャズバー鈍我楽", genre:"バー", area:"阿佐ヶ谷", price:[1000,2000], vibe:"dateQuiet",
    tags:["ジャズ"], reasonSeeds:{calm:["ジャズが流れる中で、静かにグラスを傾ける"]}},
  {id:"asagaya-akatsuki-bar", name:"暁", genre:"バー", area:"阿佐ヶ谷", price:[2000,3000], vibe:"dateQuiet",
    tags:["バー"], reasonSeeds:{calm:["夜が更けていく時間を、静かに楽しめる一軒"]}},
  {id:"asagaya-sake-to-ate-kamosu", name:"酒とあて 醸す", genre:"日本酒バー", area:"阿佐ヶ谷", price:[4000,5000], vibe:"dateQuiet",
    tags:["日本酒"], reasonSeeds:{couple:["日本酒とアテを合わせながら、ふたりで静かに"]}},
  {id:"asagaya-ichi-plus-ichi", name:"1＋1", genre:"日本酒バー", area:"阿佐ヶ谷", price:[2000,3000], vibe:"adventurousUnique",
    tags:["個性的な店名"], reasonSeeds:{adventurous:["シンプルながら気になる店名の日本酒バー"]}},
  {id:"asagaya-cocktail-bar-meride", name:"カクテルバー メリデ", genre:"バー", area:"阿佐ヶ谷", price:[1000,2000], vibe:"stylishDrink",
    tags:["カクテル"], reasonSeeds:{stylish:["カクテルを片手に、少し大人な時間を"]}},
  {id:"asagaya-wine-bar-saikantei", name:"ワインバー 菜環亭", genre:"ワインバー", area:"阿佐ヶ谷", price:[2000,3000], vibe:"dateQuiet",
    tags:["野菜料理とワイン"], reasonSeeds:{couple:["野菜料理とワインを合わせて、ふたりでゆっくり"]}},
  {id:"asagaya-sakegohan-akanegumo", name:"酒ごはん屋 あかね雲", genre:"日本酒バー", area:"阿佐ヶ谷", price:[3000,4000], vibe:"dateQuiet",
    tags:["酒とごはん"], reasonSeeds:{calm:["お酒もごはんも両方楽しめる、落ち着いた一軒"]}}
];

function withExtensionDefaults(r){
  return Object.assign({image:null, officialUrl:null, reservationUrl:null, notice:null}, r);
}

const RESTAURANTS = BASE_RESTAURANTS.map(withExtensionDefaults)
  .concat(NEW_ROWS.map(buildRestaurant))
  .concat(NEW_ROWS2.map(buildRestaurant))
  .concat(NEW_ROWS3.map(buildRestaurant))
  .concat(NEW_ROWS4.map(buildRestaurant))
  .concat(NEW_ROWS5.map(buildRestaurant))
  .concat(NEW_ROWS6.map(buildRestaurant));
