#!/usr/bin/env node
/**
 * photos/ フォルダの画像を data/photos.js に反映するスクリプト。
 *
 * 使い方:
 *   1. photos/ フォルダに、店舗id.jpg (または .jpeg / .png / .webp) という
 *      ファイル名で写真を置く(店舗idは data/restaurants.js の id と一致させる)
 *      例: photos/asagaya-impronte.jpg
 *   2. ターミナルで次を実行:
 *        node scripts/sync-photos.js
 *   3. data/photos.js が自動生成/更新される
 *   4. index.html を開いて表示を確認し、問題なければ commit & push
 *
 * data/restaurants.js は一切書き換えない(安全のため写真情報は完全に分離)。
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const PHOTOS_DIR = path.join(ROOT, "photos");
const OUTPUT_FILE = path.join(ROOT, "data", "photos.js");
const RESTAURANTS_FILE = path.join(ROOT, "data", "restaurants.js");
const VALID_EXT = [".jpg", ".jpeg", ".png", ".webp"];

function getValidIds() {
  const src = fs.readFileSync(RESTAURANTS_FILE, "utf8");
  const ids = new Set();
  const re = /id:"([^"]+)"/g;
  let m;
  while ((m = re.exec(src))) ids.add(m[1]);
  return ids;
}

function main() {
  if (!fs.existsSync(PHOTOS_DIR)) {
    console.error("photos/ フォルダが見つかりません: " + PHOTOS_DIR);
    process.exit(1);
  }
  const validIds = getValidIds();
  const files = fs.readdirSync(PHOTOS_DIR).filter((f) => VALID_EXT.includes(path.extname(f).toLowerCase()));

  const entries = [];
  const warnings = [];

  files.forEach((file) => {
    const id = path.basename(file, path.extname(file));
    if (!validIds.has(id)) {
      warnings.push(`⚠ "${file}" のファイル名 "${id}" は data/restaurants.js のidと一致しません(スキップ)`);
      return;
    }
    entries.push({ id, url: "photos/" + file });
  });

  entries.sort((a, b) => a.id.localeCompare(b.id));

  const body = entries
    .map((e) => `  "${e.id}": {url:"${e.url}", credit:null, source:"self"}`)
    .join(",\n");

  const output =
    "/* 自動生成ファイル。手編集せず、scripts/sync-photos.js を実行して更新してください。\n" +
    "   photos/ フォルダの画像(自社撮影)を店舗idごとに上書きするための対応表です。 */\n" +
    "const RESTAURANT_PHOTOS = {\n" +
    body +
    (body ? "\n" : "") +
    "};\n";

  fs.writeFileSync(OUTPUT_FILE, output);

  console.log(`✅ ${entries.length}件の写真を data/photos.js に反映しました。`);
  if (warnings.length) {
    console.log("\n" + warnings.join("\n"));
  }
}

main();
