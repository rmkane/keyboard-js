import { resolve } from "path";
import { defineConfig } from "vite";

const __dirname = import.meta.dirname;

const LIB_NAME = "keyboard-js";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "lib/main.ts"),
      name: LIB_NAME,
      fileName: (format) => `${LIB_NAME}.${format}.js`,
    },
  },
});
