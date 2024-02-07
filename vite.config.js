import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "lib/index.ts"),
      name: "KeyboardJS",
      fileName: (format) => `keyboard-js.${format}.js`,
      formats: ["cjs", "es", "iife", "umd"],
    },
  },
});
