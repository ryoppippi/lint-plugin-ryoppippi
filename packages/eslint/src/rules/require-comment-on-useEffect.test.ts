import { run } from "./_test";
import rule from "./require-comment-on-useEffect";

const valid = [
	`
// display log after rendering
useEffect(() => {
  console.log('Hello, useEffect!');
}, []);
`,
	`
// display log after rendering
React.useEffect(() => {
  console.log('Hello, React.useEffect!');
}, []);
`,
];

const invalids = [
	`
useEffect(() => {
  console.log('Hello, useEffect!');
}, []);`,
	`
React.useEffect(() => {
  console.log('Hello, React.useEffect!');
}, []);`,
];

await run({
	name: "require-comment-on-useEffect",
	rule,
	valid,
	invalid: invalids.map((i) => ({
		code: i,
		output: null,
		errors: [{ messageId: "requireCommentOnUseEffect" }],
	})),
});
