import terser from "@rollup/plugin-terser";
import react from "@vitejs/plugin-react-swc";
import { defineConfig, splitVendorChunkPlugin } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), splitVendorChunkPlugin()],
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
