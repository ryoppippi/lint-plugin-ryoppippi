import { defineConfig } from "vite-plus";

export default defineConfig({
	fmt: {
		useTabs: true,
	},
	lint: {
		options: {
			typeAware: true,
			typeCheck: true,
		},
	},
});
