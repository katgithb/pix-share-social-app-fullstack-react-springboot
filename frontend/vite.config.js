import terser from "@rollup/plugin-terser";
import react from "@vitejs/plugin-react";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import { defineConfig, splitVendorChunkPlugin } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    splitVendorChunkPlugin(),
    ViteImageOptimizer({
      png: {
        // https://sharp.pixelplumbing.com/api-output#png
        quality: 80,
      },
      jpeg: {
        // https://sharp.pixelplumbing.com/api-output#jpeg
        quality: 80,
      },
      jpg: {
        // https://sharp.pixelplumbing.com/api-output#jpeg
        quality: 80,
      },
      tiff: {
        // https://sharp.pixelplumbing.com/api-output#tiff
        quality: 80,
      },
    }),
  ],
  build: {
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      plugins: [
        // Terser minification for production
        terser({
          compress: {
            drop_console: true, // Remove console logs in production
            drop_debugger: true, // Remove debugger statements
          },
        }),
      ],
      output: {
        assetFileNames: (assetInfo) => {
          // Customize asset filenames for better organization (optional)
          const extension = assetInfo.name.endsWith(".css") ? ".css" : ".[ext]";
          return `assets/[name]-[hash]${extension}`;
        },
        chunkFileNames: (chunkInfo) => {
          // Chunk filenames with content hash for cache invalidation
          const name = `chunks/[name]-[hash].js`;
          return chunkInfo.name === "vendor" ? `vendor_${name}` : name;
        },
        manualChunks(id) {
          if (id.includes("src/hooks/") || id.includes("src/utils/")) {
            return "utils";
          }
        },
      },
    },
  },
});
