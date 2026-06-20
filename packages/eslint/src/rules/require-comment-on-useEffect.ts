/** @see https://gist.github.com/azu/0dc07179f66a6471f0a0aa681709b2f5 */

import type { Rule } from "eslint";
import { docUrl } from "../utils";

export const RULE_NAME = "require-comment-on-useEffect";
export const MESSAGE_ID = "requireCommentOnUseEffect";

const rule = {
	meta: {
		type: "suggestion",
		docs: {
			description: "Comments are required for useEffect.",
			url: docUrl("require-comment-on-useEffect"),
		},
		schema: [],
		messages: {
			[MESSAGE_ID]: `Comments are required for useEffect.
useEffect is an escape hatch from the React paradigm, so you need a reason to use it (it should be avoided if possible).
Please write in comments "what you want to do", "why you use useEffect", and "when it is called" for useEffect.
// What: The process that ~
// Why: Using an effect to integrate with ~
// When: Called when ~ value changes (please write if the second argument is an empty array or in complex cases)
Example)
function Form() {
  // Process to record Form component display in analytics tool
  // Record only once when the component mounts (may be called multiple times in dev, but it's only dev so no problem)
  useEffect(() => {
    post('/analytics/event', { eventName: 'visit_form' });
  }, []);
  return <form>...</form>;
}
References:
- You might not need an effect: https://react.dev/learn/you-might-not-need-an-effect
- Add comments to useEffect: https://www.pandanoir.info/entry/2025/01/29/205439
- Write "why" in comments: https://jisou-programmer.beproud.jp/%E9%96%A2%E6%95%B0%E8%A8%AD%E8%A8%88/10-%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88%E3%81%AB%E3%81%AF%E3%80%8C%E3%81%AA%E3%81%9C%E3%80%8D%E3%82%92%E6%9B%B8%E3%81%8F.html
`,
		},
	},
	create(context) {
		return {
			CallExpression(node) {
				// Show error if there is no comment before `useEffect()`
				if (node.callee.type === "Identifier" && node.callee.name === "useEffect") {
					const comments = context.sourceCode.getCommentsBefore(node);
					if (comments.length === 0) {
						context.report({
							node,
							messageId: MESSAGE_ID,
						});
					}
				}
				// Show error if there is no comment before `React.useEffect()`
				if (node.callee.type === "MemberExpression") {
					const { object, property } = node.callee;
					if (
						object.type === "Identifier" &&
						object.name === "React" &&
						property.type === "Identifier" &&
						property.name === "useEffect"
					) {
						const comments = context.sourceCode.getCommentsBefore(node);
						if (comments.length === 0) {
							context.report({
								node,
								messageId: MESSAGE_ID,
							});
						}
					}
				}
			},
		};
	},
} as const satisfies Rule.RuleModule;

export default rule;
