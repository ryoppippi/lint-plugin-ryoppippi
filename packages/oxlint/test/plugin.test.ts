import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { createFixture } from "fs-fixture";
import plugin from "../src/index.ts";

it("exports both ryoppippi rules", () => {
	expect(plugin.meta?.name).toBe("oxlint-plugin-ryoppippi");
	expect(Object.keys(plugin.rules).sort()).toEqual(["no-http-url", "require-comment-on-useEffect"]);
});

it("reports missing useEffect comments through Oxlint", async () => {
	await using fixture = await createOxlintFixture("useEffect(() => {}, []);\n");
	const result = runOxlint(fixture.path);

	expect(result.status).toBe(1);
	expect(`${result.stdout}${result.stderr}`).toContain("ryoppippi(require-comment-on-useEffect)");
});

it("fixes insecure HTTP URLs through Oxlint", async () => {
	await using fixture = await createOxlintFixture("const url = 'http://example.com';\n");
	const result = runOxlint(fixture.path, "--fix");

	expect(result.status).toBe(0);
	expect(await fixture.readFile("input.js", "utf8")).toBe("const url = 'https://example.com';\n");
});

function createOxlintFixture(source: string) {
	return createFixture({
		".oxlintrc.json": JSON.stringify({
			categories: { correctness: "off" },
			jsPlugins: [resolve("dist/index.mjs")],
			rules: {
				"ryoppippi/no-http-url": "error",
				"ryoppippi/require-comment-on-useEffect": "error",
			},
		}),
		"input.js": source,
	});
}

function runOxlint(cwd: string, ...arguments_: string[]) {
	return spawnSync(
		process.execPath,
		[
			resolve("node_modules/oxlint/bin/oxlint"),
			"--config",
			".oxlintrc.json",
			"input.js",
			...arguments_,
		],
		{
			cwd,
			encoding: "utf8",
			killSignal: "SIGKILL",
			timeout: 30_000,
		},
	);
}
