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
      // CRITICAL: Force ALL React imports to use the exact same instance
      "react": path.resolve(__dirname, "./node_modules/react"),
      "react-dom": path.resolve(__dirname, "./node_modules/react-dom"),
      "react/jsx-runtime": path.resolve(__dirname, "./node_modules/react/jsx-runtime"),
    },
    dedupe: ["react", "react-dom"],
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
    ],
    // Force complete rebuild to clear any cached duplicate instances
    force: true,
    esbuildOptions: {
      resolveExtensions: [".tsx", ".ts", ".jsx", ".js"],
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Force React into a single vendor chunk to prevent duplication
          'react-vendor': ['react', 'react-dom', 'react/jsx-runtime'],
        },
      },
    },
    commonjsOptions: {
      include: [/node_modules/],
    },
  },
}));
