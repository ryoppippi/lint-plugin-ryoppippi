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

if (import.meta.vitest) {
	const { expect, it } = import.meta.vitest;
	const [{ spawnSync }, { resolve }, { createFixture }] = await Promise.all([
		import("node:child_process"),
		import("node:path"),
		import("fs-fixture"),
	]);

	it("exports both ryoppippi rules", () => {
		expect(plugin.meta.name).toBe("oxlint-plugin-ryoppippi");
		expect(Object.keys(plugin.rules).sort()).toEqual([
			"no-http-url",
			"require-comment-on-useEffect",
		]);
	});

	it("reports missing useEffect comments through Oxlint", async () => {
		await using fixture = await createOxlintFixture("useEffect(() => {}, []);\n");
		const result = runOxlint(fixture.path);
		const output = `${result.stdout}${result.stderr}`;

		expect(result.status).toBe(1);
		expect(output).toContain("ryoppippi(require-comment-on-useEffect)");
		expect(output).toContain("https://react.dev/learn/you-might-not-need-an-effect");
		expect(output).toContain("https://www.pandanoir.info/entry/2025/01/29/205439");
		expect(output).toContain(
			"https://jisou-programmer.beproud.jp/%E9%96%A2%E6%95%B0%E8%A8%AD%E8%A8%88/10-%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88%E3%81%AB%E3%81%AF%E3%80%8C%E3%81%AA%E3%81%9C%E3%80%8D%E3%82%92%E6%9B%B8%E3%81%8F.html",
		);
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
				jsPlugins: [resolve(import.meta.dirname, "../dist/index.mjs")],
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
				resolve(import.meta.dirname, "../node_modules/oxlint/bin/oxlint"),
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
}
