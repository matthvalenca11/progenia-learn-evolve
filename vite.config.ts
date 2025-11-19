import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Force single React instance - point to directories, not files
      "react": path.resolve(__dirname, "node_modules/react"),
      "react-dom": path.resolve(__dirname, "node_modules/react-dom"),
    },
    // Critical: Dedupe to single instance
    dedupe: ["react", "react-dom"],
  },
  optimizeDeps: {
    // CRITICAL: Pre-bundle and lock React dependencies
    include: [
      "react",
      "react-dom",
      "react-dom/client",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
    ],
    // Aggressive: Force complete rebuild on every start
    force: true,
    esbuildOptions: {
      resolveExtensions: [".tsx", ".ts", ".jsx", ".js"],
    },
  },
  // Clear all caches on server start
  cacheDir: "node_modules/.vite-fresh",
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Consolidate React into single vendor chunk
          'react-vendor': ['react', 'react-dom', 'react/jsx-runtime'],
        },
      },
    },
    commonjsOptions: {
      include: [/node_modules/],
    },
  },
}));
