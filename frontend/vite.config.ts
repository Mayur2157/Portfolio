import { existsSync } from "node:fs";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    // Resume buttons render only when the PDF is present, so a missing file never becomes a dead link.
    __HAS_RESUME__: JSON.stringify(existsSync(new URL("./public/resume.pdf", import.meta.url))),
  },
  build: {
    // Never inline assets as data: URIs; the CSP only allows fonts and images from 'self'.
    assetsInlineLimit: 0,
  },
  server: {
    proxy: { "/api": "http://127.0.0.1:8000" },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
  },
});
