import { docUrl } from "./utils";
import { version } from "../package.json" with { type: "json" };

it("links rule documentation in the monorepo", () => {
	expect(docUrl("no-http-url")).toBe(
		`https://github.com/ryoppippi/lint-plugin-ryoppippi/tree/v${version}/packages/eslint/src/rules/no-http-url.md`,
	);
});
