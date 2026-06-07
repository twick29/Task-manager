import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  server: {
    port: 5173, // Frontend runs on this port
    proxy: {
      // Any request starting with /api will be
      // forwarded to your backend at port 5000
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },

  build: {
    outDir: "dist",        // Built files go here
    sourcemap: true,       // Helps with debugging
  },
});