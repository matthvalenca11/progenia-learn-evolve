import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(), 
    mode === "development" && componentTagger(),
    // VitePWA temporarily disabled for debugging
    // VitePWA({
    //   registerType: 'autoUpdate',
    //   includeAssets: ['icon-192.png', 'icon-512.png'],
    //   manifest: {
    //     name: 'ProGenia - Plataforma de Aprendizado Médico',
    //     short_name: 'ProGenia',
    //     description: 'Plataforma digital para profissionais de saúde',
    //     theme_color: '#0B3E5A',
    //     background_color: '#ffffff',
    //     display: 'standalone',
    //     orientation: 'portrait-primary',
    //     icons: [
    //       {
    //         src: '/icon-192.png',
    //         sizes: '192x192',
    //         type: 'image/png',
    //         purpose: 'any maskable'
    //       },
    //       {
    //         src: '/icon-512.png',
    //         sizes: '512x512',
    //         type: 'image/png',
    //         purpose: 'any maskable'
    //       }
    //     ]
    //   },
    //   workbox: {
    //     runtimeCaching: [
    //       {
    //         urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
    //         handler: 'NetworkFirst',
    //         options: {
    //           cacheName: 'supabase-cache',
    //           expiration: {
    //             maxEntries: 50,
    //             maxAgeSeconds: 60 * 60 * 24 // 24 hours
    //           }
    //         }
    //       }
    //     ]
    //   }
    // })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
    },
  },
}));
