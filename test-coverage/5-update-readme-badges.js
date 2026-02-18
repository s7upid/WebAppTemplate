#!/usr/bin/env node

/**
 * 5. Update README Badges
 * 
 * This script reads the coverage-report.json and updates
 * the badges in Template.Client/README.md
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths - test-coverage folder is now in root
const ROOT_DIR = path.join(__dirname, "..");
const CLIENT_DIR = path.join(ROOT_DIR, "Template.Client");
const COVERAGE_REPORT_PATH = path.join(CLIENT_DIR, "coverage-report.json");
const README_PATH = path.join(ROOT_DIR, "README.md"); // Root README only

function updateReadmeBadges() {
  console.log("📝 Updating README badges...\n");

  // Read coverage report
  if (!fs.existsSync(COVERAGE_REPORT_PATH)) {
    console.log(`  ⚠️  Coverage report not found at ${COVERAGE_REPORT_PATH}`);
    console.log("  Run 4-extract-results.js first to generate the coverage report.");
    process.exit(1);
  }

  const coverageReport = JSON.parse(fs.readFileSync(COVERAGE_REPORT_PATH, "utf8"));
  const { backend: backendData, unit: jestData, e2e: cypressData } = coverageReport;

  if (!fs.existsSync(README_PATH)) {
    console.log(`  ⚠️  README not found at ${README_PATH}`);
    process.exit(1);
  }

  try {
    let content = fs.readFileSync(README_PATH, "utf8");
    
    // Normalize line endings to \n for processing and remove BOM
    content = content.replace(/\r\n/g, "\n").replace(/^\uFEFF/, "");
    
    // Build badges on a single line
    const badges = [];
    
    if (backendData) {
      badges.push(`![Backend Coverage](https://img.shields.io/badge/backend-${backendData.coverage}%25-${backendData.badgeColor}?style=flat-square&logo=dotnet)`);
      console.log(`  Backend badge: ${backendData.coverage}%`);
    }
    
    if (jestData) {
      badges.push(`![Unit Test Coverage](https://img.shields.io/badge/unit%20tests-${jestData.coverage}%25-${jestData.badgeColor}?style=flat-square&logo=jest)`);
      console.log(`  Jest badge: ${jestData.coverage}%`);
    }
    
    if (cypressData) {
      badges.push(`![E2E Test Coverage](https://img.shields.io/badge/e2e%20tests-${cypressData.coverage}%25-${cypressData.badgeColor}?style=flat-square&logo=cypress)`);
      console.log(`  Cypress badge: ${cypressData.coverage}%`);
    }

    if (badges.length === 0) {
      console.log("  ⚠️  No coverage data to update badges");
      return;
    }

    // Put all badges on one line with spaces
    const badgesLine = badges.join(" ");
    
    // Remove existing badges (single or multi-line)
    content = content.replace(/!\[(Backend Coverage|Unit Test Coverage|E2E Test Coverage)\]\(https:\/\/img\.shields\.io\/badge\/[^\)]+\)\s*/g, "");
    
    // Insert badges after title (must be at the very start of the file)
    if (content.startsWith("# ")) {
      // Find the end of the title line
      const titleEndIndex = content.indexOf("\n");
      if (titleEndIndex !== -1) {
        const title = content.substring(0, titleEndIndex);
        const rest = content.substring(titleEndIndex).replace(/^\n+/, ""); // Remove leading newlines
        content = `${title}\n\n${badgesLine}\n\n${rest}`;
      }
    } else {
      // Prepend badges if no title found
      content = `${badgesLine}\n\n${content}`;
    }
    
    // Clean up multiple empty lines
    content = content.replace(/\n{4,}/g, "\n\n");
    
    fs.writeFileSync(README_PATH, content, "utf8");
    console.log(`\n  ✅ README badges updated at ${README_PATH}`);
  } catch (error) {
    console.log(`  ❌ Error updating README: ${error.message}`);
    process.exit(1);
  }
}

updateReadmeBadges();

export { updateReadmeBadges };

