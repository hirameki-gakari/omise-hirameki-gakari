#!/usr/bin/env node
/**
 * 公開サイトを実際に取得して、検索エンジンから見える状態かを確認する(読み取り専用)。
 *
 *   node scripts/check-live-seo.js                       # 公開サイト(GitHub Pages)を確認。公開(push)のあとに実行する
 *   node scripts/check-live-seo.js --base http://127.0.0.1:8765/   # ローカルサーバーを確認(公開前の動作確認)
 *
 * 確認すること:
 *   - トップページ・privacy.html・robots.txt・sitemap.xml が 200(リダイレクトなし)で取得できる
 *   - 取得したtitle・description・canonical・OGPが、リポジトリのindex.htmlと一致(=最新版が公開されている)
 *   - og:image(1200x630のPNG)・ファビコン・sitemap内の全URLが取得できる
 *   - noindex(metaにもX-Robots-Tagにも)が無い
 *   - 構造化データがJSONとして読める、h1にサービス名がある
 * 終了コード: 0=すべてOK / 1=NGあり
 * 注: GitHub Pagesは反映に数分かかり、キャッシュも効く。NGが出たら数分待って再実行する。
 */
const fs = require("fs");
const path = require("path");
const PUBLIC_BASE = "https://hirameki-gakari.github.io/omise-hirameki-gakari/";
const i = process.argv.indexOf("--base");
const BASE = i === -1 ? PUBLIC_BASE : process.argv[i + 1].replace(/\/?$/, "/");
const ROOT = path.join(__dirname, "..");
const local = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const bust = u => u + (u.includes("?") ? "&" : "?") + "t=" + Date.now();
const toFetch = u => u.startsWith(PUBLIC_BASE) ? BASE + u.slice(PUBLIC_BASE.length) : u;
const meta = (html, attr, name) => (html.match(new RegExp("<meta " + attr + '="' + name + '" content="([^"]*)"')) || [])[1];
const title = html => (html.match(/<title>([^<]*)<\/title>/) || [])[1];

let ng = 0, n = 0;
function ok(c, m){ n++; console.log((c ? "  OK  " : "  NG  ") + m); if(!c) ng++; }

async function get(url, binary){
  const res = await fetch(bust(url), {redirect: "manual", headers: {"User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"}});
  const body = binary ? Buffer.from(await res.arrayBuffer()) : await res.text();
  return {status: res.status, headers: res.headers, body};
}

(async () => {
  console.log("確認先: " + BASE);
  const top = await get(BASE);
  ok(top.status === 200, "トップページが 200 で取得できる (" + top.status + ")");
  const html = top.body;
  ok(!/noindex/i.test(html) && !/noindex/i.test(top.headers.get("x-robots-tag") || ""), "noindex がない(meta・X-Robots-Tag)");
  ok(title(html) === title(local), "title が最新版と一致: " + title(html));
  ok(meta(html, "name", "description") === meta(local, "name", "description"), "description が最新版と一致");
  ok((html.match(/<link rel="canonical" href="([^"]*)"/) || [])[1] === PUBLIC_BASE, "canonical が公開URL(サブディレクトリ込み)と一致");
  ok(meta(html, "property", "og:image") === meta(local, "property", "og:image"), "og:image が最新版と一致");
  ok(/<html lang="ja"/.test(html), "html lang=ja");
  const h1 = ((html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [])[1] || "").replace(/<[^>]+>/g, " ");
  ok(h1.includes("お店のひらめき係"), "h1 にサービス名がある");
  ok(/<h2[^>]*>お店のひらめき係とは？<\/h2>/.test(html), "初期HTMLに「お店のひらめき係とは？」の説明がある(JavaScript実行前から読める)");
  let ldOk = false;
  try{ const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m => JSON.parse(m[1])); ldOk = blocks.length > 0; }catch(e){}
  ok(ldOk, "構造化データがJSONとして読める");

  // 画像・アイコン
  const og = meta(html, "property", "og:image");
  if(og){
    const img = await get(toFetch(og), true);
    const b = img.body;
    ok(img.status === 200 && b.slice(1, 4).toString() === "PNG" && b.readUInt32BE(16) === 1200 && b.readUInt32BE(20) === 630, "og:image が 1200x630 のPNGで取得できる");
  } else ok(false, "og:image がない");
  for(const f of ["assets/favicon-48.png", "assets/favicon-192.png", "assets/apple-touch-icon.png", "assets/character/hirameki-reveal.webp", "assets/character/hirameki-thinking.webp"]){
    const r = await get(BASE + f, true); ok(r.status === 200, f + " が取得できる (" + r.status + ")");
  }

  // privacy / robots / sitemap
  const pv = await get(BASE + "privacy.html"); ok(pv.status === 200 && !/noindex/i.test(pv.body), "privacy.html が 200・noindexなし");
  const rb = await get(BASE + "robots.txt"); ok(rb.status === 200 && /^Sitemap: /m.test(rb.body) && !/^Disallow:\s*\/\s*$/m.test(rb.body), "robots.txt が取得でき、全体をDisallowしていない");
  const sm = await get(BASE + "sitemap.xml"); ok(sm.status === 200, "sitemap.xml が 200 で取得できる");
  const locs = [...sm.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
  ok(locs.length > 0 && locs.every(u => u.startsWith(PUBLIC_BASE)), "sitemap のURLがすべて公開URL配下 (" + locs.length + "件)");
  for(const u of locs){
    const r = await get(toFetch(u));
    ok(r.status === 200, "sitemap内のURLが 200 で取得できる: " + u + " (" + r.status + ")");
    const canon = (r.body.match(/<link rel="canonical" href="([^"]*)"/) || [])[1];
    ok(canon === u, "  そのページのcanonical がsitemapのURLと一致: " + canon);
  }
  // 公開ホストのルート robots.txt(参考: GitHub Pagesのプロジェクトサイトでは、検索エンジンはここしか読まない)
  if(BASE === PUBLIC_BASE){
    const root = await get("https://hirameki-gakari.github.io/robots.txt");
    console.log("  参考 ホスト直下の robots.txt: " + root.status + (root.status === 404 ? "(無い=制限なしとして扱われる。sitemapはSearch Consoleから送信する)" : ""));
  }
  console.log("\n確認 " + n + " 件、NG " + ng + " 件");
  process.exit(ng ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
