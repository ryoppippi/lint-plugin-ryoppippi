import { docUrl } from "./utils";

it("links rule documentation in the monorepo", () => {
  expect(docUrl("no-http-url")).toBe(
    "https://github.com/ryoppippi/lint-plugin-ryoppippi/tree/v0.2.6/packages/eslint/src/rules/no-http-url.md",
  );
});
