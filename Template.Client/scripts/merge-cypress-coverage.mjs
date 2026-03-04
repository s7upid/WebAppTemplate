/**
 * Merges per-split Cypress coverage JSON files into a single combined coverage report.
 *
 * Istanbul coverage objects are keyed by file path. Each value contains statement/branch/function
 * maps and their hit counters. Merging sums the counters so no coverage data is lost.
 *
 * Input:  .c8_output/coverage-split-*.json  (written by parallel Cypress processes)
 * Output: .nyc_output/out.json  &  coverage/cypress/out.json
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDir = path.resolve(__dirname, "..");

const c8OutputDir = path.join(clientDir, ".c8_output");
const nycOutputDir = path.join(clientDir, ".nyc_output");
const cypressCoverageDir = path.join(clientDir, "coverage", "cypress");

function mergeCoverageObjects(target, source) {
  for (const filePath of Object.keys(source)) {
    if (!target[filePath]) {
      target[filePath] = source[filePath];
      continue;
    }

    const t = target[filePath];
    const s = source[filePath];

    for (const key of Object.keys(s.s ?? {})) {
      t.s[key] = (t.s[key] ?? 0) + (s.s[key] ?? 0);
    }
    for (const key of Object.keys(s.f ?? {})) {
      t.f[key] = (t.f[key] ?? 0) + (s.f[key] ?? 0);
    }
    for (const key of Object.keys(s.b ?? {})) {
      if (!t.b[key]) {
        t.b[key] = s.b[key];
      } else {
        t.b[key] = t.b[key].map((count, i) => count + (s.b[key][i] ?? 0));
      }
    }
  }
  return target;
}

const splitFiles = fs.existsSync(c8OutputDir)
  ? fs.readdirSync(c8OutputDir).filter((f) => /^coverage-split-\d+\.json$/.test(f))
  : [];

if (splitFiles.length === 0) {
  console.log("No coverage-split-*.json files found in .c8_output — nothing to merge.");
  process.exit(0);
}

console.log(`Merging ${splitFiles.length} split coverage files...`);

let merged = {};
for (const file of splitFiles) {
  const filePath = path.join(c8OutputDir, file);
  try {
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    merged = mergeCoverageObjects(merged, data);
    console.log(`  + ${file} (${Object.keys(data).length} files)`);
  } catch (err) {
    console.warn(`  Warning: could not read ${file}: ${err.message}`);
  }
}

const fileCount = Object.keys(merged).length;
const json = JSON.stringify(merged, null, 2);

for (const dir of [nycOutputDir, cypressCoverageDir]) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

const nycPath = path.join(nycOutputDir, "out.json");
fs.writeFileSync(nycPath, json);
console.log(`Wrote ${nycPath} (${fileCount} files)`);

const cypressPath = path.join(cypressCoverageDir, "out.json");
fs.writeFileSync(cypressPath, json);
console.log(`Wrote ${cypressPath} (${fileCount} files)`);

console.log("Coverage merge complete.");
