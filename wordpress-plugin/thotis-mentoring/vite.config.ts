import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    lib: {
      entry: "src/main.tsx",
      name: "ThotisApp",
      fileName: () => "thotis.js",
      formats: ["iife"],
    },
    rollupOptions: {
      // React is bundled (not externalized) since WP doesn't provide it
      output: {
        assetFileNames: "thotis.[ext]",
      },
    },
    cssCodeSplit: false,
    minify: "terser",
  },
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
});
