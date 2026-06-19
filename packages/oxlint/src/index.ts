import eslintPlugin from "eslint-plugin-ryoppippi";
import packageJson from "../package.json" with { type: "json" };

export interface OxlintPlugin {
  meta: {
    name: string;
    version: string;
  };
  rules: Readonly<Record<string, object>>;
}

const plugin: OxlintPlugin = {
  meta: {
    name: "oxlint-plugin-ryoppippi",
    version: packageJson.version,
  },
  rules: eslintPlugin.rules ?? {},
};

export default plugin;
