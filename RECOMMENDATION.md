# 推薦ロジック仕様(評価基準・Must/Want設計)

「なんとなく」の数値付けを無くすための基準書。今後、店舗を追加・修正する際はこの基準に沿う。

## 評価基準(0〜5)

### companionFit(誰と)— solo / couple / family / friends / colleagues 共通の考え方

- **0〜1:** その相手との利用が明らかに成立しない、または浮く業態
- **2:** 不可能ではないが積極的には勧めにくい
- **3:** 自然に利用できる(この値以上でMustを満たす)
- **4〜5:** その相手を前提に設計されている

### atmosphere.quietLevel / casualLevel / specialLevel / luxuryLevel

- **0〜1:** その性質がほぼ無い、または真逆(quietLevelが低い=騒がしい前提)
- **2:** 弱く存在する
- **3:** 明確にその性質を持つ(Must基準)
- **4〜5:** その性質が主役級に強い

### quality.costPerformance / foodQuality / volume

- **3以上:** その軸で「良い」と言える水準
- **1〜2:** 平均以下、またはその軸を売りにしていない

### moodFit(気分)各項目

- vibe(性格タイプ)から一律に継承されるが、**業態的に無関係な項目は上限をキャップする**(例: ラーメン・カフェ・スイーツ等の非酒類ジャンルは`drinking`の実効値を3未満に扱う。`NON_ALCOHOL_GENRE_RE`参照)

## Must / Want 設計(お店のひらめき係)

`index.html`の`MOOD_MUST` / `satisfiesCompanionMust`が正。要点:

- **companionFit[誰と] &ge; 3** は常にMust(緩和しない)
- 気分側のMustは`MOOD_MUST`テーブルで定義。0件になった場合のみ気分側を緩和する(誰とMustは死守)
- `stylish` / `adventurous` / `quick` はMustを設けず、Want(加点)のみ

## reasonSeeds(推薦理由)のルール

- **理由文で使うキー(誰と/気分)は、対応する数値属性が上記Mustの閾値を満たす場合のみ使ってよい**
- 監査スクリプト(下記)で全件、機械的にチェックできる

```js
// 監査例(Node上で data/restaurants.js を読み込んで実行)
const COMPANION_KEYS = ['solo','couple','family','friends','colleagues'];
const MOOD_MIN = { drinking:3, calm:3, lively:3, indulgent:3, budget:3, hearty:3, familyFun:3, stylish:0, adventurous:0, quick:0 };
RESTAURANTS.forEach(r => {
  Object.keys(r.reasonSeeds || {}).forEach(key => {
    if (COMPANION_KEYS.includes(key) && r.companionFit[key] < 3) {
      console.log('矛盾:', r.id, key, r.companionFit[key]);
    } else if (key in MOOD_MIN && r.moodFit[key] < MOOD_MIN[key]) {
      console.log('矛盾:', r.id, key, r.moodFit[key]);
    }
  });
});
```

2026-09-12時点、全300件でこの監査を実行し、矛盾0件を確認済み。

## vibe(性格テンプレート)一覧

`data/restaurants.js`の`VIBES`参照。9種類: dateQuiet / dateSpecial / groupCasual / soloQuick / soloDrink / familyHearty / budgetCasual / adventurousUnique / stylishDrink。

新しい業態パターンが増えた場合(例: 「ひとり飲み」がsoloQuickでは表現できなかった)は、既存vibeを歪めず新しいvibeを追加する。
