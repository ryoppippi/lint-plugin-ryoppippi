import eslintPlugin from "eslint-plugin-ryoppippi";
import packageJson from "../package.json" with { type: "json" };

export interface OxlintPlugin {
	meta: {
		name: string;
		version: string;
	};
	rules: Readonly<Record<string, object>>;
}

const rules = eslintPlugin.rules;
if (rules == null || Object.keys(rules).length === 0) {
	throw new Error("eslint-plugin-ryoppippi did not expose any rules");
}

const plugin: OxlintPlugin = {
	meta: {
		name: "oxlint-plugin-ryoppippi",
		version: packageJson.version,
	},
	rules,
};

export default plugin;
