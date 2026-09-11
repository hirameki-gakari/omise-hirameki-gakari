/* =========================================================
   店舗データ(阿佐ヶ谷・高円寺エリア 61件)
   ※名称・ジャンル・エリアは公開情報を参照。距離や価格帯は目安。
     公開前に営業時間・電話番号・正確な住所は現地/公式情報で要確認。
   UIロジック(index.html側)から分離し、100〜500件規模に
   増やしても index.html が肥大化しない構成にしている。
   ========================================================= */
const BASE_RESTAURANTS = [
  {
    id:"asagaya-impronte", name:"リストランテ impronte", genre:"イタリアン", area:"阿佐ヶ谷",
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
    id:"asagaya-koshikawa", name:"越川", genre:"和食・居酒屋", area:"阿佐ヶ谷",
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
    id:"koenji-amane", name:"焼肉 あまね", genre:"焼肉", area:"高円寺", station:"高円寺", walkMinutes:2,
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
    id:"koenji-nikuichi", name:"肉問屋直営 焼肉 肉一 高円寺店", genre:"焼肉", area:"高円寺",
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
    id:"koenji-fujikawa", name:"富士川食堂", genre:"定食", area:"高円寺",
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
    id:"koenji-mensaibou", name:"麺彩房", genre:"ラーメン", area:"高円寺",
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
    id:"asagaya-gift", name:"Gift食堂 阿佐ヶ谷", genre:"日本酒バル", area:"阿佐ヶ谷",
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
    id:"koenji-fukuraimon", name:"福来門", genre:"中華", area:"高円寺",
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
    id:"asagaya-kotaro", name:"こたろう", genre:"海鮮居酒屋", area:"南阿佐ヶ谷",
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
    id:"asagaya-nui", name:"nui", genre:"バル(創作・ワイン)", area:"阿佐ヶ谷",
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
    id:"asagaya-lamaisoncourtine", name:"ラ・メゾン・クルティーヌ", genre:"フレンチ", area:"阿佐ヶ谷", station:"阿佐ヶ谷", walkMinutes:1,
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
  }
};

function buildRestaurant(row){
  const v = VIBES[row.vibe];
  return {
    id:row.id, name:row.name, genre:row.genre, area:row.area,
    station:row.station, walkMinutes:row.walkMinutes,
    priceRange:{dinner:row.price},
    companionFit:Object.assign({}, v.companionFit),
    moodFit:Object.assign({}, v.moodFit),
    atmosphere:Object.assign({}, v.atmosphere),
    quality:Object.assign({}, v.quality),
    audienceFit:Object.assign({}, v.audienceFit),
    tags:row.tags,
    reasonSeeds:row.reasonSeeds
  };
}

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
    tags:["ディナー限定","特別感"], reasonSeeds:{indulgent:["ディナーだけの特別な時間に集中できる一軒"], couple:["ディナーのみの営業だから、夜の時間に集中して向き合える"], stylish:["派手すぎない、大人の店構え"]}},
  {id:"koenji-kamatetsu", name:"ピザ&ステーキ酒場 窯鉄", genre:"ピザ・ステーキ酒場", area:"高円寺", price:[2000,3000], vibe:"groupCasual",
    tags:["ピザ","ステーキ","酒場"], reasonSeeds:{drinking:["ピザとステーキ、両方つまみに飲める気軽さ"], friends:["ピザとステーキ、好みが違う友達同士でも満足しやすい"], budget:["酒場価格で気軽に楽しめる"]}},
  {id:"koenji-junction", name:"Junction", genre:"イタリアン", area:"高円寺", price:[5000,6000], vibe:"stylishDrink",
    tags:["ディナー限定","おしゃれ"], reasonSeeds:{stylish:["夜だけの営業で落ち着いた大人の時間"], couple:["夜だけの静かな時間、ふたりで過ごすのにも"], drinking:["お酒に合わせた一皿が期待できる"]}},
  {id:"koenji-bocca-lupo", name:"トラットリア ボッカ・ルーポ", genre:"イタリアン", area:"高円寺", price:[10000,15000], vibe:"dateSpecial",
    tags:["本格トラットリア","記念日向け"], reasonSeeds:{indulgent:["本格イタリアンをコースでじっくり味わう特別な夜に"], couple:["特別な記念日の主役になれる一軒"], stylish:["本格トラットリアらしい、洗練された雰囲気"]}},
  {id:"asagaya-gatto-calico", name:"Gatto Calico", genre:"イタリアン", area:"阿佐ヶ谷", price:[5000,6000], vibe:"dateQuiet",
    tags:["ディナー中心","落ち着いた空間"], reasonSeeds:{calm:["派手すぎない、ふたりで話しやすい空間"], couple:["ディナー中心の営業で、夜にじっくり向き合える"], indulgent:["派手さより、料理の質で満足させてくれそう"]}},
  {id:"asagaya-lupi32", name:"Lupi32", genre:"薪窯ピザ", area:"阿佐ヶ谷", price:[10000,15000], vibe:"dateSpecial",
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
    tags:["海鮮","安め"], reasonSeeds:{budget:["海鮮を気軽な値段でつまみに"], friends:["海鮮を色々つまみながら、わいわい飲むのに向いてる"], drinking:["魚をアテに、じっくり飲める一軒"]}},
  {id:"asagaya-rokukan", name:"六燗", genre:"ジビエ・ナチュールワイン", area:"阿佐ヶ谷", price:[2000,3000], vibe:"adventurousUnique",
    tags:["ジビエ","ナチュールワイン"], reasonSeeds:{adventurous:["ジビエとナチュールワインという、他にはない組み合わせ"], couple:["ナチュールワインを選びながら、ふたりでゆっくり"], stylish:["ジビエという、少し特別な選択肢"]}},
  {id:"asagaya-fujisan-baniku", name:"阿佐ヶ谷 大衆馬肉酒場 冨士山", genre:"馬肉酒場", area:"阿佐ヶ谷", price:[3000,4000], vibe:"adventurousUnique",
    tags:["馬肉","大衆酒場"], reasonSeeds:{adventurous:["馬肉料理という、いつもと違う一軒"], friends:["馬肉料理を話題にしながら、友達とわいわい"], drinking:["大衆酒場らしい気軽な飲み"]}},
  {id:"asagaya-uotetsu", name:"阿佐ヶ谷 魚てつ", genre:"海鮮居酒屋", area:"阿佐ヶ谷", price:[5000,6000], vibe:"dateQuiet",
    tags:["刺身","海鮮"], reasonSeeds:{indulgent:["新鮮な刺身をゆっくり味わえる"], couple:["刺身をアテに、ふたりでゆっくり飲める"], calm:["落ち着いて魚と向き合える雰囲気"]}},
  {id:"asagaya-otoriya", name:"音鶏家 阿佐ヶ谷店", genre:"焼き鳥", area:"阿佐ヶ谷", price:[2000,3000], vibe:"budgetCasual",
    tags:["焼き鳥","安め"], reasonSeeds:{budget:["焼き鳥を気軽な値段で"], solo:["ひとりでも気軽に立ち寄れる焼き鳥屋"], quick:["ランチ帯の実績もあり、提供も早そう"]}},
  {id:"asagaya-kushibar", name:"阿佐ヶ谷串バル", genre:"串料理バル", area:"阿佐ヶ谷", price:[2000,3000], vibe:"soloQuick",
    tags:["串料理","ランチも安い"], reasonSeeds:{quick:["串をつまみながら、軽く立ち寄れる"], solo:["串を数本つまむだけでもいい、身軽さ"], budget:["ランチも安いから、価格の安心感がある"]}},
  {id:"asagaya-nihonshu-zero", name:"にほんしゅ ぜろ", genre:"日本酒バル", area:"阿佐ヶ谷", price:[3000,4000], vibe:"dateQuiet",
    tags:["日本酒","落ち着いた飲み"], reasonSeeds:{calm:["日本酒を静かに選びながら飲める"], couple:["日本酒を選びながら、静かに語り合える"], drinking:["総合居酒屋としての品揃えの広さも魅力"]}},
  {id:"asagaya-24-gyoza", name:"24時間 餃子酒場 阿佐ヶ谷店", genre:"餃子・深夜酒場", area:"阿佐ヶ谷", price:[2000,3000], vibe:"soloQuick",
    tags:["24時間営業","餃子"], reasonSeeds:{quick:["24時間営業だから、時間を気にせず入れる"], solo:["深夜でもひとりでふらっと入れる"], budget:["餃子中心で、価格も気取らない"]}},
  {id:"koenji-doki", name:"動悸", genre:"隠れ家居酒屋", area:"高円寺", price:[6000,8000], vibe:"dateSpecial",
    tags:["隠れ家","少し贅沢"], reasonSeeds:{indulgent:["隠れ家感のある特別な一軒"], couple:["隠れ家だからこそ、ふたりだけの時間に集中できる"], stylish:["少し背伸びしたい夜にちょうどいい佇まい"]}},
  {id:"koenji-kaisen", name:"貝せん", genre:"貝料理専門", area:"高円寺", price:[4000,5000], vibe:"groupCasual",
    tags:["貝料理専門","つまみが豊富"], reasonSeeds:{friends:["貝料理を色々つまみながらわいわい"], drinking:["貝料理は日本酒にもワインにも合わせやすい"], colleagues:["つまみが豊富だから、職場の集まりにも"]}},
  {id:"koenji-citraba", name:"クラフト麦酒酒場 シトラバ 高円寺店", genre:"クラフトビール酒場", area:"高円寺", price:[1000,6000], vibe:"stylishDrink",
    tags:["クラフトビール","種類豊富"], reasonSeeds:{stylish:["クラフトビールの飲み比べが楽しい"], friends:["飲み比べをネタに、みんなで盛り上がれる"], couple:["クラフトビールを選ぶ時間も、ふたりの会話のきっかけに"]}},
  {id:"koenji-hakata-standard", name:"ハカタスタンダード 高円寺店", genre:"博多料理", area:"高円寺", price:[3000,4000], vibe:"groupCasual",
    tags:["博多料理","もつ鍋"], reasonSeeds:{friends:["もつ鍋を囲んでわいわい飲むのに合う"], hearty:["もつ鍋でしっかりお腹も満たせる"], colleagues:["鍋を囲むから、職場の集まりにも向いてる"]}},

  // ── 和食(12) ──
  {id:"asagaya-shinkei", name:"神鶏 阿佐ヶ谷店", genre:"焼き鳥", area:"阿佐ヶ谷", price:[3000,4000], vibe:"groupCasual",
    tags:["焼き鳥","飲み向き"], reasonSeeds:{drinking:["焼き鳥をつまみに、じっくり飲める"], friends:["焼き鳥を何本もシェアしながら、わいわい飲める"], budget:["焼き鳥中心だから、価格も気張らない"]}},
  {id:"asagaya-sugidama", name:"鮨・酒・肴 杉玉 阿佐ヶ谷", genre:"寿司", area:"阿佐ヶ谷", price:[3000,4000], vibe:"dateQuiet",
    tags:["寿司","日本酒"], reasonSeeds:{indulgent:["寿司と日本酒で、少し贅沢な気分に"], couple:["寿司と日本酒を、ふたりでゆっくり味わう夜に"], calm:["落ち着いた雰囲気で、静かに語り合える"]}},
  {id:"asagaya-tonkatsu-narikura", name:"とんかつ成蔵", genre:"とんかつ", area:"阿佐ヶ谷", price:[6000,8000], vibe:"dateSpecial",
    tags:["とんかつ","上質な一皿"], reasonSeeds:{indulgent:["じっくり揚げたとんかつを主役に、特別な食事を"], couple:["じっくり揚げる一皿を、特別な日の主役に"], stylish:["とんかつなのに、どこか特別感のある佇まい"]}},
  {id:"asagaya-soba", name:"阿佐ヶ谷SOBA", genre:"そば(創作)", area:"阿佐ヶ谷", price:[5000,6000], vibe:"dateQuiet",
    tags:["そば","落ち着いた空間"], reasonSeeds:{calm:["そばを肴に、静かに飲みながら話せる"], couple:["そばを肴に、ふたりで静かな時間を"], indulgent:["創作そばという、少し特別な選択肢"]}},
  {id:"asagaya-sushi-ichi", name:"すしいち", genre:"寿司", area:"阿佐ヶ谷", price:[5000,6000], vibe:"dateSpecial",
    tags:["寿司","職人技"], reasonSeeds:{indulgent:["職人が握る寿司で、特別な夜に"], couple:["職人の握りを、特別な記念日に"], stylish:["寿司屋らしい、背筋が伸びる緊張感も魅力"]}},
  {id:"koenji-abusan", name:"あぶさん", genre:"海鮮・貝料理", area:"高円寺", price:[5000,6000], vibe:"groupCasual",
    tags:["海鮮","貝料理"], reasonSeeds:{friends:["海鮮と貝をつまみに、飲みが長引いても飽きない"], drinking:["海鮮と貝、両方あるから飲みが長引いても飽きない"], colleagues:["つまみの種類が多く、職場の集まりにも"]}},
  {id:"koenji-osoubi-kappou", name:"創作割烹おあそび", genre:"創作割烹", area:"高円寺", price:[6000,8000], vibe:"dateSpecial",
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

const RESTAURANTS = BASE_RESTAURANTS.concat(NEW_ROWS.map(buildRestaurant));
