import { defineConfig } from "vite-plus";

export default defineConfig({
	pack: {
		dts: true,
		exports: true,
		inputOptions: {
			transform: {
				define: {
					"import.meta.vitest": "undefined",
				},
			},
		},
		publint: true,
		unbundle: true,
		unused: {
			ignore: {
				peerDependencies: ["oxlint"],
			},
			level: "error",
		},
	},
	test: {
		includeSource: ["src/**/*.ts"],
	},
});
