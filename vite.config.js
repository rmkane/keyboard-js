import { resolve } from "path";
import { defineConfig } from "vite";

const __dirname = import.meta.dirname;

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "lib/main.ts"),
      name: "KeyboardJS",
      fileName: (format) => `keyboard-js.${format}.js`,
    },
  },
});
