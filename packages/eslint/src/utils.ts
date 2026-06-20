import { version } from "../package.json" with { type: "json" };

const BASE_URL = `https://github.com/ryoppippi/lint-plugin-ryoppippi/tree/v${version}/packages/eslint/src/rules`;

export function docUrl(ruleName: string): string {
	return `${BASE_URL}/${ruleName}.md`;
}
