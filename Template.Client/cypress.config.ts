import { defineConfig } from "cypress";
import webpackPreprocessor from "@cypress/webpack-preprocessor";
import cypressSplit from "cypress-split";
import path from "path";
import fs from "fs";

const enableCoverage = process.env.ENABLE_COVERAGE === "true" || 
                       process.env.CYPRESS_COVERAGE === "true";

// Custom coverage tasks - writes to both .nyc_output and coverage/cypress.
// Parallel-safe: each split process writes to its own file (coverage-split-<index>.json).
function setupCoverageTasks(on: Cypress.PluginEvents, splitIndex: string | number | undefined) {
  const c8OutputDir = path.resolve(__dirname, ".c8_output");
  const nycOutputDir = path.resolve(__dirname, ".nyc_output");
  const cypressCoverageDir = path.resolve(__dirname, "coverage", "cypress");
  const suffix = splitIndex != null ? `-split-${splitIndex}` : "";

  [c8OutputDir, nycOutputDir, cypressCoverageDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  let accumulatedCoverage: Record<string, unknown> = {};

  on("task", {
    saveCoverage(coverage: object) {
      if (!coverage) {
        console.log("Warning: No coverage data received in saveCoverage task");
        return null;
      }
      Object.assign(accumulatedCoverage, coverage);

      const filename = `coverage${suffix}-${Date.now()}.json`;
      const filepath = path.join(c8OutputDir, filename);
      fs.writeFileSync(filepath, JSON.stringify(coverage));
      console.log(`Coverage saved to ${filepath} (${Object.keys(coverage).length} files)`);
      return null;
    },

    getCoverage() {
      if (Object.keys(accumulatedCoverage).length > 0) {
        return accumulatedCoverage;
      }
      if (!fs.existsSync(c8OutputDir)) return {};

      const files = fs.readdirSync(c8OutputDir).filter(f => f.endsWith(".json"));
      const combined: Record<string, unknown> = {};
      for (const file of files) {
        try {
          const content = JSON.parse(fs.readFileSync(path.join(c8OutputDir, file), "utf8"));
          Object.assign(combined, content);
        } catch (e) {
          console.log(`Warning: Error reading ${file}: ${e}`);
        }
      }
      return combined;
    },

    // Only clears files belonging to the current split (or all files when running without splits).
    clearCoverage() {
      accumulatedCoverage = {};

      [c8OutputDir, nycOutputDir].forEach(dir => {
        if (!fs.existsSync(dir)) return;
        const pattern = suffix ? `coverage${suffix}-` : "coverage";
        const files = fs.readdirSync(dir).filter(f => f.endsWith(".json") && f.startsWith(pattern));
        for (const file of files) {
          try { fs.unlinkSync(path.join(dir, file)); } catch { /* ignore */ }
        }
      });
      console.log(`Coverage data cleared${suffix ? ` (split ${splitIndex})` : ""}`);
      return null;
    },

    writeFinalCoverage(coverage: object) {
      if (!coverage || Object.keys(coverage).length === 0) {
        console.log("Warning: No coverage data to write");
        return null;
      }

      const fileCount = Object.keys(coverage).length;

      if (suffix) {
        // Parallel mode: write a per-split file; the merge script combines them later.
        const splitPath = path.join(c8OutputDir, `coverage${suffix}.json`);
        fs.writeFileSync(splitPath, JSON.stringify(coverage, null, 2));
        console.log(`Coverage written to ${splitPath} (${fileCount} files)`);
      } else {
        // Sequential mode: write directly to final locations.
        const coverageJson = JSON.stringify(coverage, null, 2);
        const nycPath = path.join(nycOutputDir, "out.json");
        fs.writeFileSync(nycPath, coverageJson);
        console.log(`Coverage written to ${nycPath} (${fileCount} files)`);

        const cypressPath = path.join(cypressCoverageDir, "out.json");
        fs.writeFileSync(cypressPath, coverageJson);
        console.log(`Coverage written to ${cypressPath} (${fileCount} files)`);
      }
      return null;
    }
  });
}

export default defineConfig({
  allowCypressEnv: false,
  expose: {
    ENABLE_COVERAGE: enableCoverage,
  },
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
      cypressSplit(on, config);

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

      const coverageEnabled = enableCoverage || config.env?.ENABLE_COVERAGE === true || config.env?.ENABLE_COVERAGE === "true";
      if (coverageEnabled) {
        const splitIndex = config.env?.splitIndex;
        setupCoverageTasks(on, splitIndex);
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
