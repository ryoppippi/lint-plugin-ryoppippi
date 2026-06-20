import type { RuleTesterInitOptions, TestCasesOptions } from "eslint-vitest-rule-tester";
import tsParser from "@typescript-eslint/parser";
import { run as _run } from "eslint-vitest-rule-tester";

export async function run(options: TestCasesOptions & RuleTesterInitOptions): Promise<void> {
	await _run({
		...options,
		parser: tsParser,
	});
}
