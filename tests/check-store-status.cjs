#!/usr/bin/env node
/**
 * scripts/check-store-status.js の検知ロジックの検証(通信はモックに差し替え、実サイトにはアクセスしない)。
 *   node tests/check-store-status.cjs
 * 先頭4店について、次の状況を作って、レポートに正しく出るかを確認する。
 *   1店目: 食べログに【閉店】表示      → 「1. 閉店・移転・休業」に出る
 *   2店目: 電話番号が変わっている      → 「3. 電話番号・住所が変わった店」に出る
 *   3店目: 最新の口コミが2年前         → 「2. 口コミが古い店」に出る
 *   4店目: 問題なし                    → どこにも出ない
 * あわせて、データファイルを書き換えない(読み取り専用)ことを確認する。
 */
const fs = require("fs");
const os = require("os");
const path = require("path");
const crypto = require("crypto");
const { spawnSync } = require("child_process");

const ROOT = path.join(__dirname, "..");
const dataFiles = ["restaurants", "store-info", "store-contact"].map(f => path.join(ROOT, "data", f + ".js"));
const hashAll = () => dataFiles.map(f => crypto.createHash("sha1").update(fs.readFileSync(f)).digest("hex")).join();
const before = hashAll();

const src = dataFiles.map(f => fs.readFileSync(f, "utf8")).join("\n");
const R = new Function(src + "; return RESTAURANTS;")().filter(r => !r.closed && r.tabelogUrl);
const [closed, telChanged, stale, fine] = R;
const info = {};
R.slice(0, 4).forEach(r => { info[r.tabelogUrl] = {tel: r.tel || "03-1234-5678", street: (r.address || "杉並区高円寺北1-1-1").replace(/^(杉並区|中野区)/, "")}; });

const mockFile = path.join(os.tmpdir(), "mock-fetch-" + process.pid + ".cjs");
fs.writeFileSync(mockFile, `
const T = ${JSON.stringify({closed: closed.tabelogUrl, telChanged: telChanged.tabelogUrl, stale: stale.tabelogUrl})};
const INFO = ${JSON.stringify(info)};
function page(title, tel, addr){
  return "<title>" + title + "</title><script type='application/ld+json'>{\\"telephone\\":\\"" + tel + "\\",\\"streetAddress\\":\\"" + addr + "\\"}</script>";
}
global.fetch = async (url) => {
  const isReview = url.includes("dtlrvwlst");
  const base = url.replace(/dtlrvwlst.*$/, "");
  const i = INFO[base] || {tel: "03-1234-5678", street: "高円寺北1-1-1"};
  let body;
  if(isReview) body = base === T.stale ? "2024/08訪問 2024/06訪問" : "2026/09訪問 2026/08訪問";
  else if(base === T.closed) body = page("【閉店】テスト店 - 高円寺 | 食べログ", i.tel, i.street);
  else if(base === T.telChanged) body = page("テスト店 - 高円寺 | 食べログ", "03-9999-9999", i.street);
  else body = page("テスト店 - 高円寺 | 食べログ", i.tel, i.street);
  return {status: 200, text: async () => body};
};
`);
const res = spawnSync(process.execPath, ["-r", mockFile, path.join(ROOT, "scripts/check-store-status.js"), "--limit", "4", "--sleep", "0", "--stale-months", "8"], {encoding: "utf8"});
fs.unlinkSync(mockFile);
const out = res.stdout;

let failures = 0, checks = 0;
function ok(cond, msg){ checks++; if(!cond){ failures++; console.log("NG", msg); } }
const section = title => { const i = out.indexOf(title); if(i === -1) return ""; const j = out.indexOf("\n## ", i + 3); return out.slice(i, j === -1 ? undefined : j); };
const s1 = section("## 1."), s2 = section("## 2."), s3 = section("## 3.");

ok(res.status === 2, "要対応あり(閉店・連絡先の変化)のとき終了コードが2でない: " + res.status);
ok(s1.includes(closed.name) && s1.includes("閉店"), "閉店表示の店が「1.」に出ていない");
ok(s1.includes('"' + closed.id + '"'), "STORE_CLOSED への追記候補に出ていない");
ok(s2.includes(stale.name) && s2.includes("2024/08"), "口コミが古い店が「2.」に出ていない");
ok(s3.includes(telChanged.name) && s3.includes("03-9999-9999"), "電話番号が変わった店が「3.」に出ていない");
[s1, s2, s3].forEach((s, i) => {
  const expected = [closed.name, stale.name, telChanged.name][i];
  ok(!s.includes(fine.name) || fine.name === expected, "問題のない店が「" + (i + 1) + ".」に出ている");
});
ok(!s1.includes(stale.name) && !s1.includes(telChanged.name), "閉店でない店が「1.」に出ている");
ok(!s2.includes(closed.name), "閉店表示の店が「2.」にも重複して出ている");
ok(hashAll() === before, "データファイルが書き換えられた(読み取り専用のはず)");

console.log("検証 " + checks + " 件、失敗 " + failures + " 件");
if(failures) console.log(out);
process.exit(failures ? 1 : 0);
