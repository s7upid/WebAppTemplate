import { defineConfig } from "cypress";
import webpackPreprocessor from "@cypress/webpack-preprocessor";
import path from "path";
import fs from "fs";

const enableCoverage = process.env.ENABLE_COVERAGE === "true" || 
                       process.env.CYPRESS_COVERAGE === "true";

// Custom coverage tasks - writes to both .nyc_output and coverage/cypress
function setupCoverageTasks(on: Cypress.PluginEvents) {
  const c8OutputDir = path.resolve(__dirname, ".c8_output");
  const nycOutputDir = path.resolve(__dirname, ".nyc_output");
  const cypressCoverageDir = path.resolve(__dirname, "coverage", "cypress");
  
  // Ensure all coverage directories exist
  [c8OutputDir, nycOutputDir, cypressCoverageDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  // Track accumulated coverage
  let accumulatedCoverage: Record<string, unknown> = {};

  on("task", {
    // Save coverage data after each test
    saveCoverage(coverage: object) {
      if (!coverage) {
        console.log("⚠️  No coverage data received in saveCoverage task");
        return null;
      }
      
      // Merge into accumulated coverage
      Object.assign(accumulatedCoverage, coverage);
      
      // Also save to individual file for debugging
      const filename = `coverage-${Date.now()}.json`;
      const filepath = path.join(c8OutputDir, filename);
      fs.writeFileSync(filepath, JSON.stringify(coverage));
      console.log(`📊 Coverage saved to ${filepath} (${Object.keys(coverage).length} files)`);
      return null;
    },
    
    // Get combined coverage (for reporting)
    getCoverage() {
      // First, try to use accumulated coverage
      if (Object.keys(accumulatedCoverage).length > 0) {
        return accumulatedCoverage;
      }
      
      // Fallback: read from individual files
      if (!fs.existsSync(c8OutputDir)) return {};
      
      const files = fs.readdirSync(c8OutputDir).filter(f => f.endsWith(".json"));
      const combined: Record<string, unknown> = {};
      
      for (const file of files) {
        try {
          const content = JSON.parse(fs.readFileSync(path.join(c8OutputDir, file), "utf8"));
          Object.assign(combined, content);
        } catch (e) {
          console.log(`⚠️  Error reading ${file}: ${e}`);
        }
      }
      
      return combined;
    },
    
    // Clear coverage data
    clearCoverage() {
      accumulatedCoverage = {};
      
      [c8OutputDir, nycOutputDir].forEach(dir => {
        if (fs.existsSync(dir)) {
          const files = fs.readdirSync(dir).filter(f => f.endsWith(".json"));
          for (const file of files) {
            try {
              fs.unlinkSync(path.join(dir, file));
            } catch {
              // Ignore errors
            }
          }
        }
      });
      console.log("🧹 Coverage data cleared");
      return null;
    },
    
    // Write final coverage to all expected locations
    writeFinalCoverage(coverage: object) {
      if (!coverage || Object.keys(coverage).length === 0) {
        console.log("⚠️  No coverage data to write");
        return null;
      }
      
      const coverageJson = JSON.stringify(coverage, null, 2);
      const fileCount = Object.keys(coverage).length;
      
      // Write to .nyc_output (for nyc/c8 compatibility)
      const nycPath = path.join(nycOutputDir, "out.json");
      fs.writeFileSync(nycPath, coverageJson);
      console.log(`📊 Coverage written to ${nycPath} (${fileCount} files)`);
      
      // Write to coverage/cypress (for extraction script)
      const cypressPath = path.join(cypressCoverageDir, "out.json");
      fs.writeFileSync(cypressPath, coverageJson);
      console.log(`📊 Coverage written to ${cypressPath} (${fileCount} files)`);
      
      return null;
    }
  });
}

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    supportFile: "cypress/support/e2e.ts",
    specPattern: "cypress/e2e/**/*.cy.ts",
    env: {
      ENABLE_COVERAGE: enableCoverage,
    },
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: false,
    numTestsKeptInMemory: 0,
    defaultCommandTimeout: 8000,
    requestTimeout: 8000,
    responseTimeout: 8000,
    pageLoadTimeout: 30000,
    setupNodeEvents(on, config) {
      // Configure webpack preprocessor with path aliases
      const webpackOptions = {
        resolve: {
          extensions: [".ts", ".tsx", ".js", ".jsx"],
          alias: {
            "@": path.resolve(__dirname, "./src"),
            "@/components": path.resolve(__dirname, "./src/components"),
            "@/config": path.resolve(__dirname, "./src/config"),
            "@/models": path.resolve(__dirname, "./src/models"),
            "@/pages": path.resolve(__dirname, "./src/pages"),
            "@/services": path.resolve(__dirname, "./src/services"),
            "@/store": path.resolve(__dirname, "./src/store"),
            "@/types": path.resolve(__dirname, "./src/types"),
            "@/utils": path.resolve(__dirname, "./src/utils"),
          },
        },
        module: {
          rules: [
            {
              test: /\.tsx?$/,
              exclude: [/node_modules/],
              use: [
                {
                  loader: "ts-loader",
                  options: {
                    transpileOnly: true,
                    configFile: path.resolve(__dirname, "cypress/tsconfig.json"),
                  },
                },
              ],
            },
          ],
        },
      };

      on("file:preprocessor", webpackPreprocessor({ webpackOptions }));

      // Setup custom coverage tasks (c8-compatible)
      if (enableCoverage) {
        setupCoverageTasks(on);
      }
      
      return config;
    },
  },
  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },
});
