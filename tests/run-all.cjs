#!/usr/bin/env node
/**
 * すべてのテストを順に実行する。
 *   node tests/run-all.cjs
 * どれかが失敗したら終了コード1。データやコードを変更したら、公開の前に実行する。
 * (実サイトにはアクセスしない。scripts/check-store-status.js の実行は別途。)
 */
const path = require("path");
const { spawnSync } = require("child_process");

const tests = ["closed-today", "open-hours", "links", "privacy", "seo", "reroll-copy", "check-store-status"];
let failed = 0;
for(const t of tests){
  const res = spawnSync(process.execPath, [path.join(__dirname, t + ".cjs")], {encoding: "utf8"});
  const last = (res.stdout || "").trim().split("\n").pop();
  console.log((res.status === 0 ? "OK  " : "NG  ") + t.padEnd(20) + last);
  if(res.status !== 0){ failed++; console.log(res.stdout); console.log(res.stderr); }
}
console.log(failed ? failed + " 件のテストが失敗" : "すべて成功");
process.exit(failed ? 1 : 0);
