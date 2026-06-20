import { defineConfig } from "vite-plus";

export default defineConfig({
	pack: {
		dts: true,
		exports: true,
		publint: true,
		unused: {
			ignore: {
				dependencies: ["@types/estree"],
			},
			level: "error",
		},
	},
	test: {
		globals: true,
	},
});
