import { defineConfig, PluginOption } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(async ({ mode }) => {
  const plugins: PluginOption[] = [react()];

  if (mode === "coverage" || process.env.CYPRESS_COVERAGE === "true") {
    const { default: istanbul } = await import("vite-plugin-istanbul");
    plugins.push(
      istanbul({
        cypress: true,
        requireEnv: false,
        forceBuildInstrument: mode === "coverage",
        include: "src/**/*.{ts,tsx,js,jsx}",
        exclude: ["node_modules", "tests", "build"],
      }) as PluginOption
    );
  }

  return {
    plugins,
    css: {
      modules: {
        localsConvention: "camelCase" as const,
      },
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      port: 3000,
      open: false,
      proxy: {
        "/api": {
          target: "http://localhost:5249",
          changeOrigin: true,
          secure: false,
        },
      },
    },
    build: {
      outDir: "build",
      sourcemap: true,
      target: "es2022",
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              if (id.includes("react-dom")) return "vendor-react-dom";
              if (id.includes("react-router")) return "vendor-router";
              if (id.includes("react")) return "vendor-react";
              if (id.includes("@reduxjs") || id.includes("react-redux")) return "vendor-redux";
              if (id.includes("@tanstack")) return "vendor-query";
              if (id.includes("lucide-react")) return "vendor-icons";
              if (id.includes("zod") || id.includes("hook-form")) return "vendor-forms";
              return "vendor";
            }
          },
        },
      },
    },
    define: {
      global: "globalThis",
    },
    esbuild: {
      sourcemap: true,
    },
    optimizeDeps: {
      include: [],
    },
  };
});
