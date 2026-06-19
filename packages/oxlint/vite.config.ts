import { defineConfig } from "vite-plus";

export default defineConfig({
  pack: {
    dts: true,
    exports: true,
  },
  test: {
    globals: true,
  },
});
