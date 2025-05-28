import { defineConfig } from "astro/config";
import keystatic from "@keystatic/astro";
import react from "@astrojs/react";

export default defineConfig({
  output: "hybrid",
  integrations: [react(), keystatic()],
});