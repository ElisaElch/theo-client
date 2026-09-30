import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],

  // In development, forward every request starting with /api to the local API.
  // The browser only ever talks to localhost:5173, so cookies are first-party.
  server: {
    proxy: {
      "/api": "http://localhost:5000",
    },
  },
});
