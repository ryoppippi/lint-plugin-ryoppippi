import type { Rule } from "eslint";
import { docUrl } from "../utils";

export const RULE_NAME = `no-http-url`;
export const MESSAGE_ID = `httpNotAllowed`;

/**
 * Default allowed origins for HTTP URLs.
 */
const DEFAULT_ALLOWED_ORIGIN = ["localhost", "127.0.0.1"] as const;

// Top-level regex definitions
const URL_REGEXP = /http:\/\//gi;

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
    const LOCAL_REGEXP = new RegExp(allowedOrigins.join("|"), "gi");

    /**
     * Check whether the URL is HTTP and fix it to HTTPS.
     */
    const checkHttpUrl = (node: Rule.Node, value: string, raw: string | null | undefined): void => {
      if (
        value != null &&
        typeof value === "string" &&
        // eslint-disable-next-line ts/strict-boolean-expressions
        value.match(URL_REGEXP) &&
        // eslint-disable-next-line ts/strict-boolean-expressions
        !value.match(LOCAL_REGEXP)
      ) {
        context.report({
          node,
          messageId: MESSAGE_ID,
          fix(fixer) {
            if (raw == null) {
              return null;
            }
            const result = raw.replace(URL_REGEXP, "https://");
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

        if (
          // eslint-disable-next-line ts/strict-boolean-expressions
          value.match(URL_REGEXP) &&
          // eslint-disable-next-line ts/strict-boolean-expressions
          !value.match(LOCAL_REGEXP)
        ) {
          context.report({
            node,
            messageId: MESSAGE_ID,
            fix(fixer) {
              const newText = fullText.replace(URL_REGEXP, "https://");
              return fixer.replaceText(node, newText);
            },
          });
        }
      },
    };
  },
} as const satisfies Rule.RuleModule;

export default rule;
