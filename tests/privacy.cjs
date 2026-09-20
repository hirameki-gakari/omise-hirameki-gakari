#!/usr/bin/env node
/**
 * プライバシーポリシーが、サイトの実際の挙動と食い違っていないことの検証。
 *   node tests/privacy.cjs
 * - 計測(GA4)・フォント・保存(sessionStorage/localStorage)・位置情報を使っていないこと、が本文と一致する
 * - フッターとサイトマップからページに辿れる
 */
const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");
const read = f => fs.readFileSync(path.join(ROOT, f), "utf8");
const index = read("index.html"), privacy = read("privacy.html"), sitemap = read("sitemap.xml");

let failures = 0, checks = 0;
function ok(cond, msg){ checks++; if(!cond){ failures++; console.log("NG", msg); } }

// 計測・外部読み込み: 使っているものは必ず本文に書いてある
ok(/googletagmanager\.com\/gtag/.test(index) ? /Google アナリティクス/.test(privacy) : true, "GA4を使っているのに、ポリシーに記載がない");
ok(/fonts\.googleapis\.com/.test(index) ? /Google Fonts/.test(privacy) : true, "Googleフォントを使っているのに、ポリシーに記載がない");
ok(/sessionStorage/.test(index) ? /sessionStorage/.test(privacy) : true, "sessionStorageを使っているのに、ポリシーに記載がない");
ok(/localStorage/.test(index) ? /localStorage/.test(privacy) : true, "localStorageを使っているのに、ポリシーに記載がない");
// 「使わない」と書いたものを、実際に使っていない
ok(!/geolocation/.test(index), "「位置情報は使いません」と書いているのに、geolocationを使っている");
ok(!/<form|<input|<textarea|type="email"/.test(index), "「入力フォームがない」と書いているのに、入力欄がある");
ok(!/document\.cookie/.test(index), "独自にCookieを書き込んでいる(ポリシーに記載がない)");
// 計測しているイベントの種類が本文に反映されている
const events = new Set();
[...index.matchAll(/trackEvent\(\s*"([a-z_]+)"/g)].forEach(m => events.add(m[1]));
["call_click", "map_click"].forEach(e => { ok(index.includes(e), e + " の計測が見つからない"); });
ok(/電話する/.test(privacy) && /Googleマップで見る/.test(privacy), "電話・地図ボタンの計測が、ポリシーに記載されていない");
ok(/条件を変える/.test(privacy), "「条件を変える」の計測が、ポリシーに記載されていない");
ok(/ひらめきを見る/.test(privacy) && /別のお店をひらめく/.test(privacy), "ひらめき・再提案の計測が、ポリシーに記載されていない");
// 問い合わせ先と導線
ok(/x\.com\/hirameki365/.test(privacy), "お問い合わせ先(X)が記載されていない");
ok(/href="privacy\.html"/.test(index), "フッターからプライバシーポリシーへのリンクがない");
ok(/privacy\.html<\/loc>/.test(sitemap), "sitemap.xml にプライバシーポリシーがない");
ok(/canonical" href="https:\/\/hirameki-gakari\.github\.io\/omise-hirameki-gakari\/privacy\.html"/.test(privacy), "canonical URLが正しくない");

console.log("検証 " + checks + " 件、失敗 " + failures + " 件");
process.exit(failures ? 1 : 0);
