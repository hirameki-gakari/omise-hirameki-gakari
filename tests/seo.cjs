#!/usr/bin/env node
/**
 * 検索エンジン向けの設定(SEO)の静的チェック。
 *   node tests/seo.cjs
 * - title / description / canonical / robots / OGP / Twitterカード / 構造化データ / 見出し / アイコン
 * - sitemap.xml と robots.txt、サイト内リンク切れ
 * - サービスの実態と食い違う表現(位置情報の「近く」など)を入れていない
 * 実際の公開サイトの確認は scripts/check-live-seo.js(公開後に実行)。
 */
const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");
const read = f => fs.readFileSync(path.join(ROOT, f), "utf8");
const exists = f => fs.existsSync(path.join(ROOT, f));
const BASE = "https://hirameki-gakari.github.io/omise-hirameki-gakari/";
const index = read("index.html"), privacy = read("privacy.html");

let failures = 0, checks = 0;
function ok(cond, msg){ checks++; if(!cond){ failures++; console.log("NG", msg); } }
const meta = (html, attr, name) => (html.match(new RegExp("<meta " + attr + '="' + name + '" content="([^"]*)"')) || [])[1];
const len = s => [...s].length;
function pngSize(file){
  const b = fs.readFileSync(path.join(ROOT, file));
  if(b.slice(1, 4).toString() !== "PNG") return null;
  return {w: b.readUInt32BE(16), h: b.readUInt32BE(20)};
}

// ---- title / description ----
const title = (index.match(/<title>([^<]*)<\/title>/) || [])[1] || "";
const desc = meta(index, "name", "description") || "";
ok(title.startsWith("お店のひらめき係"), "titleがサービス名で始まっていない: " + title);
ok(/阿佐ヶ谷/.test(title) && /高円寺/.test(title), "titleに対象エリア(阿佐ヶ谷・高円寺)がない");
ok(len(title) <= 40, "titleが長すぎる(" + len(title) + "字): 検索結果で切れる");
ok(len(desc) >= 60 && len(desc) <= 130, "descriptionの長さが範囲外(60〜130字): " + len(desc));
ok(/阿佐ヶ谷・高円寺/.test(desc), "descriptionに対象エリアがない");
// このサービスは現在地(位置情報)を使わない。実態と違う表現を入れない
[["title", title], ["description", desc]].forEach(([n, t]) => ok(!/近く|現在地|位置情報|周辺/.test(t), n + "に、位置情報を使うかのような表現がある: " + t));
ok(!/1位|No\.?1|最大級|日本一|絶対/.test(title + desc), "title/descriptionに根拠のない最上級表現がある");

// ---- canonical / robots meta ----
ok((index.match(/<link rel="canonical" href="([^"]*)"/) || [])[1] === BASE, "canonicalが公開URLと一致しない");
const robotsMeta = meta(index, "name", "robots") || "";
ok(/index/.test(robotsMeta) && !/noindex|nofollow|none/.test(robotsMeta), "robots metaが不適切: " + robotsMeta);
["index.html", "privacy.html"].forEach(f => ok(!/noindex/i.test(read(f)), f + " に noindex が含まれている"));
ok((privacy.match(/<link rel="canonical" href="([^"]*)"/) || [])[1] === BASE + "privacy.html", "privacy.htmlのcanonicalが不正");
ok(/<html lang="ja"/.test(index), "html lang=ja がない");

// ---- OGP / Twitter ----
ok(meta(index, "property", "og:title") === title, "og:titleがtitleと違う");
ok(meta(index, "property", "og:description") === desc, "og:descriptionがdescriptionと違う");
ok(meta(index, "property", "og:url") === BASE, "og:urlがcanonicalと違う");
ok(meta(index, "property", "og:type") === "website", "og:typeがwebsiteでない");
ok(meta(index, "property", "og:site_name") === "お店のひらめき係", "og:site_nameが不正");
const ogImage = meta(index, "property", "og:image") || "";
ok(ogImage.startsWith(BASE + "assets/"), "og:imageが公開URL配下の絶対URLでない: " + ogImage);
const ogFile = ogImage.replace(BASE, "");
ok(exists(ogFile), "og:imageのファイルがリポジトリにない: " + ogFile);
const sz = exists(ogFile) ? pngSize(ogFile) : null;
ok(sz && sz.w === 1200 && sz.h === 630, "og:imageのサイズが1200x630でない: " + JSON.stringify(sz));
ok(meta(index, "property", "og:image:width") === "1200" && meta(index, "property", "og:image:height") === "630", "og:image:width/heightが不正");
ok(len(meta(index, "property", "og:image:alt") || "") >= 10, "og:image:altがない");
ok(meta(index, "name", "twitter:card") === "summary_large_image", "twitter:cardが不正");
ok(meta(index, "name", "twitter:image") === ogImage, "twitter:imageがog:imageと違う");
ok(meta(index, "name", "twitter:title") === title && meta(index, "name", "twitter:description") === desc, "twitterのtitle/descriptionがずれている");

// ---- アイコン ----
[["assets/favicon-48.png", 48], ["assets/favicon-192.png", 192], ["assets/apple-touch-icon.png", 180]].forEach(([f, n]) => {
  const s = exists(f) ? pngSize(f) : null;
  ok(s && s.w === n && s.h === n, f + " が " + n + "x" + n + " のPNGでない");
  ok(index.includes('href="' + f + '"'), f + " が <head> から参照されていない");
});

// ---- 構造化データ ----
const ldBlocks = [...index.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m => m[1]);
ok(ldBlocks.length >= 1, "構造化データがない");
let graph = [];
try{ ldBlocks.forEach(b => { const j = JSON.parse(b); graph = graph.concat(j["@graph"] || [j]); }); }catch(e){ ok(false, "構造化データがJSONとして不正: " + e.message); }
const site = graph.find(g => g["@type"] === "WebSite"), app = graph.find(g => g["@type"] === "WebApplication");
ok(site && site.url === BASE && site.name === "お店のひらめき係", "WebSiteの url/name が不正");
ok(app && app.url === BASE && app.name === "お店のひらめき係", "WebApplicationの url/name が不正");
ok(app && app.isAccessibleForFree === true && app.offers && app.offers.price === "0", "WebApplicationの無料表記が実態と合わない");
// 実在しない評価・レビュー・運営会社情報を入れていない
const ldText = ldBlocks.join(" ");
ok(!/aggregateRating|"review"|ratingValue|reviewCount|"Organization"|telephone|address"/.test(ldText), "構造化データに、評価・レビュー・会社情報など裏付けのない項目が含まれている");
const ids = new Set(graph.map(g => g["@id"]).filter(Boolean));
JSON.stringify(graph).replace(/"@id":"([^"]+)"/g, (m, id) => { ok(ids.has(id), "構造化データが存在しない@idを参照: " + id); return m; });

// ---- 見出し構造・本文 ----
const h1s = [...index.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)].map(m => m[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
ok(h1s.length === 1, "h1が1つでない: " + h1s.length);
ok(h1s[0] && h1s[0].includes("お店のひらめき係"), "h1にサービス名が含まれていない: " + h1s[0]);
const aboutMatch = index.match(/<section class="about"[\s\S]*?<\/section>/);
ok(!!aboutMatch, "「お店のひらめき係とは？」の説明セクションがない");
if(aboutMatch){
  const about = aboutMatch[0];
  ok(/<h2[^>]*>お店のひらめき係とは？<\/h2>/.test(about), "説明セクションのh2がない");
  ok(/阿佐ヶ谷・高円寺/.test(about) && /登録なし・無料/.test(about), "説明に対象エリア・無料の記載がない");
  ok(/こんなときに/.test(about) && /使い方/.test(about), "説明に「こんなときに」「使い方」がない");
  ok(about.includes("gohan-hirameki-gakari"), "説明から姉妹サービスへのリンクがない");
  ok(len(about.replace(/<[^>]+>/g, "")) < 700, "説明セクションが長すぎる(UXを壊さない短さにする)");
}
// 非表示の計測パネルに見出しタグを置かない(検索エンジンに、画面に出ない見出しを読ませない)
const panel = (index.match(/<div id="stats-panel"[\s\S]*?<script/) || [""])[0];
ok(!/<h[1-6]/.test(panel), "非表示の計測パネルに見出しタグ(h1〜h6)がある");
ok(/<div id="stats-panel"[^>]*hidden/.test(index), "計測パネルが hidden でない");

// ---- sitemap.xml / robots.txt ----
const sitemap = read("sitemap.xml");
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
ok(locs.length >= 1 && new Set(locs).size === locs.length, "sitemapのURLが空か重複している");
locs.forEach(u => {
  ok(u.startsWith(BASE), "sitemapに、公開URL配下でないURL: " + u);
  const file = u === BASE ? "index.html" : u.replace(BASE, "");
  ok(exists(file), "sitemapのURLに対応するファイルがない: " + u);
  ok(!/\?|#/.test(u), "sitemapにパラメータ・フラグメント付きURL: " + u);
});
ok(locs.includes(BASE), "sitemapにトップページがない");
const robots = read("robots.txt");
ok(new RegExp("^Sitemap: " + (BASE + "sitemap.xml").replace(/[.*+?^${}()|[\]\\\/]/g, "\\$&") + "$", "m").test(robots), "robots.txtのSitemap行が正しくない");
ok(!/^Disallow:\s*\/\s*$/m.test(robots), "robots.txtがサイト全体をDisallowしている");

// ---- サイト内リンク切れ(相対パスのhref/src) ----
["index.html", "privacy.html"].forEach(f => {
  const html = read(f);
  [...html.matchAll(/(?:href|src)="([^"#:?]+)"/g)].map(m => m[1]).filter(u => !/^(https?|tel|mailto|data)/.test(u) && u !== "./").forEach(u => {
    ok(exists(u), f + " の相対リンク先がない: " + u);
  });
});

console.log("検証 " + checks + " 件、失敗 " + failures + " 件");
process.exit(failures ? 1 : 0);
