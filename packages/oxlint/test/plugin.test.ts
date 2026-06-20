import { spawnSync } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import plugin from "../src/index.ts";

const temporaryDirectories: string[] = [];

afterEach(async () => {
	await Promise.all(
		temporaryDirectories
			.splice(0)
			.map((directory) => rm(directory, { force: true, recursive: true })),
	);
});

it("exports both ryoppippi rules", () => {
	expect(plugin.meta?.name).toBe("oxlint-plugin-ryoppippi");
	expect(Object.keys(plugin.rules).sort()).toEqual(["no-http-url", "require-comment-on-useEffect"]);
});

it("reports missing useEffect comments through Oxlint", async () => {
	const cwd = await createFixture("useEffect(() => {}, []);\n");
	const result = runOxlint(cwd);

	expect(result.status).toBe(1);
	expect(`${result.stdout}${result.stderr}`).toContain("ryoppippi(require-comment-on-useEffect)");
});

it("fixes insecure HTTP URLs through Oxlint", async () => {
	const cwd = await createFixture("const url = 'http://example.com';\n");
	const result = runOxlint(cwd, "--fix");

	expect(result.status).toBe(0);
	expect(await readFile(join(cwd, "input.js"), "utf8")).toBe(
		"const url = 'https://example.com';\n",
	);
});

async function createFixture(source: string): Promise<string> {
	const cwd = await mkdtemp(join(tmpdir(), "oxlint-plugin-ryoppippi-"));
	temporaryDirectories.push(cwd);
	await writeFile(join(cwd, "input.js"), source);
	await writeFile(
		join(cwd, ".oxlintrc.json"),
		JSON.stringify({
			categories: { correctness: "off" },
			jsPlugins: [resolve("dist/index.mjs")],
			rules: {
				"ryoppippi/no-http-url": "error",
				"ryoppippi/require-comment-on-useEffect": "error",
			},
		}),
	);
	return cwd;
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
