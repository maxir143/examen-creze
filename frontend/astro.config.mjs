// @ts-check
import { defineConfig, envField } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  redirects: {
    "/": "/login",
  },
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
  env: {
    schema: {
      API_URL: envField.string({
        context: "client",
        access: "public",
        default: "http://127.0.0.1:8000",
      }),
    },
  },
});
