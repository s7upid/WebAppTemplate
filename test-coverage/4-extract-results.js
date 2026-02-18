#!/usr/bin/env node

/**
 * 4. Extract Coverage Results
 * 
 * This script reads coverage data from:
 * - Backend: coverage/report/Cobertura.xml (from .NET tests)
 * - Jest: Template.Client/coverage/jest/coverage-summary.json
 * - Cypress: Template.Client/coverage/cypress/out.json
 *
 * And generates:
 * - Template.Client/coverage-report.json with all coverage data
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { XMLParser } from "fast-xml-parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths - test-coverage folder is now in root
const ROOT_DIR = path.join(__dirname, "..");
const CLIENT_DIR = path.join(ROOT_DIR, "Template.Client");

const BACKEND_COVERAGE_PATH = path.join(ROOT_DIR, "coverage", "report", "Cobertura.xml");
const JEST_COVERAGE_PATH = path.join(CLIENT_DIR, "coverage", "jest", "coverage-summary.json");
const CYPRESS_COVERAGE_PATH = path.join(CLIENT_DIR, "coverage", "cypress", "out.json");
const CYPRESS_NYC_PATH = path.join(CLIENT_DIR, ".nyc_output", "out.json");
const COVERAGE_REPORT_PATH = path.join(CLIENT_DIR, "coverage-report.json");

function getBadgeColor(coverage) {
  if (coverage >= 90) return "brightgreen";
  if (coverage >= 80) return "green";
  if (coverage >= 70) return "yellowgreen";
  if (coverage >= 60) return "yellow";
  if (coverage >= 50) return "orange";
  return "red";
}

function extractBackendCoverage() {
  console.log(`  Backend path: ${BACKEND_COVERAGE_PATH}`);
  
  if (!fs.existsSync(BACKEND_COVERAGE_PATH)) {
    console.log("  ⚠️  Backend coverage not found");
    return null;
  }

  try {
    const xmlContent = fs.readFileSync(BACKEND_COVERAGE_PATH, "utf8");
    const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "" });
    const result = parser.parse(xmlContent);
    
    const coverage = result.coverage;
    const lineRate = parseFloat(coverage["line-rate"]) || 0;
    const branchRate = parseFloat(coverage["branch-rate"]) || 0;
    const coveragePercent = Math.round(lineRate * 100);
    
    console.log(`  ✅ Backend coverage: ${coveragePercent}% (${getBadgeColor(coveragePercent)})`);
    
    return {
      coverage: coveragePercent,
      badgeColor: getBadgeColor(coveragePercent),
      details: {
        lineRate: lineRate,
        branchRate: branchRate,
        linesCovered: coverage["lines-covered"],
        linesValid: coverage["lines-valid"],
        branchesCovered: coverage["branches-covered"],
        branchesValid: coverage["branches-valid"],
      },
    };
  } catch (error) {
    console.log(`  ❌ Error reading backend coverage: ${error.message}`);
    return null;
  }
}

function extractJestCoverage() {
  console.log(`  Jest path: ${JEST_COVERAGE_PATH}`);
  
  if (!fs.existsSync(JEST_COVERAGE_PATH)) {
    console.log("  ⚠️  Jest coverage not found");
    return null;
  }

  try {
    const coverageSummary = JSON.parse(fs.readFileSync(JEST_COVERAGE_PATH, "utf8"));
    const total = coverageSummary.total;

    if (!total || total.lines.total === 0) {
      let totalLines = 0;
      let coveredLines = 0;

      for (const [filePath, coverage] of Object.entries(coverageSummary)) {
        if (filePath === "total") continue;
        totalLines += coverage.lines.total;
        coveredLines += coverage.lines.covered;
      }

      if (totalLines === 0) {
        return { coverage: 0, badgeColor: "red", details: null };
      }

      const coverage = Math.round((coveredLines / totalLines) * 100);
      console.log(`  ✅ Jest coverage: ${coverage}% (${getBadgeColor(coverage)})`);
      return { coverage, badgeColor: getBadgeColor(coverage), details: { lines: { total: totalLines, covered: coveredLines } } };
    }

    const coverage = Math.round(total.lines.pct);
    console.log(`  ✅ Jest coverage: ${coverage}% (${getBadgeColor(coverage)})`);
    
    return {
      coverage,
      badgeColor: getBadgeColor(coverage),
      details: {
        lines: total.lines,
        statements: total.statements,
        functions: total.functions,
        branches: total.branches,
      },
    };
  } catch (error) {
    console.log(`  ❌ Error reading Jest coverage: ${error.message}`);
    return null;
  }
}

function extractCypressCoverage() {
  const paths = [CYPRESS_COVERAGE_PATH, CYPRESS_NYC_PATH];
  console.log(`  Cypress paths: ${paths.join(", ")}`);
  
  let coverageData = null;
  let usedPath = null;

  for (const p of paths) {
    if (fs.existsSync(p)) {
      try {
        coverageData = JSON.parse(fs.readFileSync(p, "utf8"));
        usedPath = p;
        break;
      } catch (e) {
        continue;
      }
    }
  }

  if (!coverageData) {
    console.log("  ⚠️  Cypress coverage not found");
    return null;
  }

  try {
    let totalStatements = 0;
    let coveredStatements = 0;

    for (const [filePath, fileCoverage] of Object.entries(coverageData)) {
      if (typeof fileCoverage !== "object" || !fileCoverage.s) continue;
      
      for (const [stmtId, count] of Object.entries(fileCoverage.s)) {
        totalStatements++;
        if (count > 0) coveredStatements++;
      }
    }

    if (totalStatements === 0) {
      console.log("  ⚠️  Cypress coverage: 0% (no instrumented code found)");
      return { coverage: 0, badgeColor: "red", details: null };
    }

    const coverage = Math.round((coveredStatements / totalStatements) * 100);
    console.log(`  ✅ Cypress coverage: ${coverage}% (${getBadgeColor(coverage)}) from ${path.basename(usedPath)}`);
    
    return {
      coverage,
      badgeColor: getBadgeColor(coverage),
      details: {
        statements: { total: totalStatements, covered: coveredStatements },
      },
      source: usedPath,
    };
  } catch (error) {
    console.log(`  ❌ Error reading Cypress coverage: ${error.message}`);
    return null;
  }
}

function main() {
  console.log("🔍 Extracting coverage data...\n");
  console.log("Paths:");
  console.log(`  Root: ${ROOT_DIR}`);
  console.log(`  Client: ${CLIENT_DIR}\n`);

  const backendCoverage = extractBackendCoverage();
  const jestCoverage = extractJestCoverage();
  const cypressCoverage = extractCypressCoverage();

  // Save coverage report
  const coverageReport = {
    backend: backendCoverage,
    unit: jestCoverage,
    e2e: cypressCoverage,
    timestamp: new Date().toISOString(),
  };

  fs.writeFileSync(COVERAGE_REPORT_PATH, JSON.stringify(coverageReport, null, 2));
  console.log(`\n📄 Coverage report saved to: ${COVERAGE_REPORT_PATH}`);

  // Summary
  console.log("\n==========================================");
  console.log("Coverage Summary:");
  if (backendCoverage) console.log(`  Backend (.NET):    ${backendCoverage.coverage}%`);
  if (jestCoverage) console.log(`  Unit Tests (Jest): ${jestCoverage.coverage}%`);
  if (cypressCoverage) console.log(`  E2E (Cypress):     ${cypressCoverage.coverage}%`);
  console.log("==========================================\n");

  return coverageReport;
}

const result = main();
export { main, result };

