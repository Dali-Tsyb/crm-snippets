import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
   base: "/crm-snippets/",
   plugins: [vue()],
   resolve: {
      alias: {
         "@": "/src",
      },
   },
});
