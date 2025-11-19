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
      // CRITICAL FIX: Force single React instance by explicit aliasing
      "react": path.resolve(__dirname, "./node_modules/react"),
      "react-dom": path.resolve(__dirname, "./node_modules/react-dom"),
      "react/jsx-runtime": path.resolve(__dirname, "./node_modules/react/jsx-runtime"),
    },
    // Dedupe React to prevent multiple instances
    dedupe: ["react", "react-dom"],
  },
  optimizeDeps: {
    // Pre-bundle React to ensure single instance
    include: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
    ],
    // Force fresh rebuild
    force: true,
    esbuildOptions: {
      resolveExtensions: [".tsx", ".ts", ".jsx", ".js"],
    },
  },
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
