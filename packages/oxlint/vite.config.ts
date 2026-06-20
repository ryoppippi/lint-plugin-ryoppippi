import { defineConfig } from "vite-plus";

export default defineConfig({
	pack: {
		dts: true,
		exports: true,
		publint: true,
		unused: {
			ignore: {
				peerDependencies: ["oxlint"],
			},
			level: "error",
		},
	},
	test: {
		globals: true,
	},
});
