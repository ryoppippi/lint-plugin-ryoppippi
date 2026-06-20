/**
 * # no-http-url
 *
 * This rule aims to ensure that all URLs are HTTPS.
 *
 * `localhost` is allowed.
 *
 * ## Rule Details
 *
 * ```ts
 * "https://example.com"; // 👍 ok
 *
 * "http://localhost"; // 👍 ok
 *
 * "http:127.0.0.1:3000"; // 👍 ok
 * ```
 *
 * ```ts
 * "http://example.com"; // 👎 error
 * ```
 *
 * ## Options
 *
 * This rule accepts an optional configuration object with an `allowedOrigins` array. The default value for `allowedOrigins` is `['localhost', '127.0.0.1']`.
 *
 * ### Example
 *
 * ```ts
 * // eslint no-http-url: ["error", { "allowedOrigins": ["custom.com"] }]
 *
 * "http://custom.com"; // 👍 ok
 *
 * "http://example.com"; // 👎 error
 * ```
 */
import type { Rule } from "eslint";
import { docUrl } from "../utils";

export const RULE_NAME = `no-http-url`;
export const MESSAGE_ID = `httpNotAllowed`;

/**
 * Default allowed origins for HTTP URLs.
 */
const DEFAULT_ALLOWED_ORIGIN = ["localhost", "127.0.0.1"] as const;

const HTTP_PROTOCOL_REGEXP = /http:\/\//gi;
const HTTP_URL_REGEXP = /http:\/\/[^\s"'`<>]+/gi;

const rule = {
	meta: {
		type: "problem",
		docs: {
			description: "disallow http url",
			url: docUrl("no-http-url"),
		},
		schema: [
			{
				type: "object",
				properties: {
					allowedOrigins: {
						type: "array",
						items: {
							type: "string",
						},
						default: DEFAULT_ALLOWED_ORIGIN,
					},
				},
				additionalProperties: false,
			},
		],
		fixable: "code",
		messages: {
			[MESSAGE_ID]: "HTTP is not safe enough. use HTTPS.",
		},
	},
	create: (context) => {
		const options = (context.options.at(0) ?? {}) as { allowedOrigins?: readonly string[] };
		const allowedOrigins = options?.allowedOrigins ?? DEFAULT_ALLOWED_ORIGIN;
		const allowedHostnames = new Set(allowedOrigins.map((origin) => origin.toLowerCase()));

		const containsDisallowedHttpUrl = (value: string): boolean => {
			for (const match of value.matchAll(HTTP_URL_REGEXP)) {
				try {
					if (!allowedHostnames.has(new URL(match[0]).hostname.toLowerCase())) {
						return true;
					}
				} catch {
					return true;
				}
			}
			return false;
		};

		/**
		 * Check whether the URL is HTTP and fix it to HTTPS.
		 */
		const checkHttpUrl = (node: Rule.Node, value: string, raw: string | null | undefined): void => {
			if (value != null && typeof value === "string" && containsDisallowedHttpUrl(value)) {
				context.report({
					node,
					messageId: MESSAGE_ID,
					fix(fixer) {
						if (raw == null) {
							return null;
						}
						const result = raw.replace(HTTP_PROTOCOL_REGEXP, "https://");
						return fixer.replaceText(node, result);
					},
				});
			}
		};

		return {
			Literal: (node) => {
				const token = context.sourceCode.getFirstToken(node);

				if (token != null && token.type === "String" && typeof node.value === "string") {
					checkHttpUrl(node, node.value, node.raw);
				}
			},
			TemplateLiteral: (node) => {
				// Handle template literals correctly, keeping all quasi and expression parts
				const sourceCode = context.sourceCode;
				const fullText = sourceCode.getText(node);
				const value = node.quasis.map((q) => q.value.cooked).join("");

				if (containsDisallowedHttpUrl(value)) {
					context.report({
						node,
						messageId: MESSAGE_ID,
						fix(fixer) {
							const newText = fullText.replace(HTTP_PROTOCOL_REGEXP, "https://");
							return fixer.replaceText(node, newText);
						},
					});
				}
			},
		};
	},
} as const satisfies Rule.RuleModule;

export default rule;

if (import.meta.vitest) {
	const { run } = await import("./_test");
	const valid = [
		`'https'`,
		`'http'`,
		`'//github.com'`,
		`'https://github.com'`,
		"`https://github.com`",
		`"https://github.com"`,
		`'&url=https://github.com'`,
		`'http://localhost'`,
		`'http://localhost:8080'`,
		`'http://127.0.0.1'`,
		`'http://127.0.0.1:30'`,
		"`http://localhost`",
		`"http://localhost"`,
		"`\nhttp://localhost\n`",
		"`my profile url is https://example.com/ryoppippi`",
		{
			code: `'http://custom.com'`,
			options: [{ allowedOrigins: ["custom.com"] }],
		},
		{
			code: `'http://a.b'`,
			options: [{ allowedOrigins: ["a.b"] }],
		},
	];
	const invalid = [
		{
			code: `'http://github.com'`,
			output: `'https://github.com'`,
			errors: [{ messageId: MESSAGE_ID }],
		},
		{
			code: `"http://github.com"`,
			output: `"https://github.com"`,
			errors: [{ messageId: MESSAGE_ID }],
		},
		{
			code: `"http://github.com http://ryoppippi.com"`,
			output: `"https://github.com https://ryoppippi.com"`,
			errors: [{ messageId: MESSAGE_ID }],
		},
		{
			code: "`http://github.com`",
			output: "`https://github.com`",
			errors: [{ messageId: MESSAGE_ID }],
		},
		{
			code: "`\nhttp://github.com/ryoppippi\n`",
			output: "`\nhttps://github.com/ryoppippi\n`",
			errors: [{ messageId: MESSAGE_ID }],
		},
		{
			code: "`http://example.com/ryoppippi http://example.com/ryoppippi-2 https://example.com/ryoppippi`",
			output:
				"`https://example.com/ryoppippi https://example.com/ryoppippi-2 https://example.com/ryoppippi`",
			errors: [{ messageId: MESSAGE_ID }],
		},
		{
			code: "`my profile url is http://example.com/ryoppippi`",
			output: "`my profile url is https://example.com/ryoppippi`",
			errors: [{ messageId: MESSAGE_ID }],
		},
		{
			code: "`http://github.com/ryoppippi/${path}`",
			output: "`https://github.com/ryoppippi/${path}`",
			errors: [{ messageId: MESSAGE_ID }],
		},
		{
			code: "`http://github.com/ryoppippi/${path}/${path2}`",
			output: "`https://github.com/ryoppippi/${path}/${path2}`",
			errors: [{ messageId: MESSAGE_ID }],
		},
		{
			code: `'&url=http://github.com'`,
			output: `'&url=https://github.com'`,
			errors: [{ messageId: MESSAGE_ID }],
		},
		{
			code: `'http://notallowed.com'`,
			output: `'https://notallowed.com'`,
			options: [{ allowedOrigins: ["custom.com"] }],
			errors: [{ messageId: MESSAGE_ID }],
		},
		{
			code: `'http://notlocalhost-evil.com'`,
			output: `'https://notlocalhost-evil.com'`,
			errors: [{ messageId: MESSAGE_ID }],
		},
		{
			code: `'http://aXb'`,
			output: `'https://aXb'`,
			options: [{ allowedOrigins: ["a.b"] }],
			errors: [{ messageId: MESSAGE_ID }],
		},
	];

	await run({
		name: RULE_NAME,
		rule,
		valid,
		invalid,
	});
}
