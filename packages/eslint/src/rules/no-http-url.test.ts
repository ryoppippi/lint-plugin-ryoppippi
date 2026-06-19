import { run } from "./_test";
import rule from "./no-http-url";

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
  // Test with custom allowedOrigins
  {
    code: `'http://custom.com'`,
    options: [{ allowedOrigins: ["custom.com"] }],
  },
];

const invalid = [
  {
    code: `'http://github.com'`,
    output: `'https://github.com'`,
    errors: [{ messageId: "httpNotAllowed" }],
  },
  {
    code: `"http://github.com"`,
    output: `"https://github.com"`,
    errors: [{ messageId: "httpNotAllowed" }],
  },
  {
    code: `"http://github.com http://ryoppippi.com"`,
    output: `"https://github.com https://ryoppippi.com"`,
    errors: [{ messageId: "httpNotAllowed" }],
  },
  {
    code: "`http://github.com`",
    output: "`https://github.com`",
    errors: [{ messageId: "httpNotAllowed" }],
  },
  {
    code: "`\nhttp://github.com/ryoppippi\n`",
    output: "`\nhttps://github.com/ryoppippi\n`",
    errors: [{ messageId: "httpNotAllowed" }],
  },
  {
    code: "`http://example.com/ryoppippi http://example.com/ryoppippi-2 https://example.com/ryoppippi`",
    output:
      "`https://example.com/ryoppippi https://example.com/ryoppippi-2 https://example.com/ryoppippi`",
    errors: [{ messageId: "httpNotAllowed" }],
  },
  {
    code: "`my profile url is http://example.com/ryoppippi`",
    output: "`my profile url is https://example.com/ryoppippi`",
    errors: [{ messageId: "httpNotAllowed" }],
  },
  {
    // eslint-disable-next-line no-template-curly-in-string
    code: "`http://github.com/ryoppippi/${path}`",
    // eslint-disable-next-line no-template-curly-in-string
    output: "`https://github.com/ryoppippi/${path}`",
    errors: [{ messageId: "httpNotAllowed" }],
  },
  {
    // eslint-disable-next-line no-template-curly-in-string
    code: "`http://github.com/ryoppippi/${path}/${path2}`",
    // eslint-disable-next-line no-template-curly-in-string
    output: "`https://github.com/ryoppippi/${path}/${path2}`",
    errors: [{ messageId: "httpNotAllowed" }],
  },
  {
    code: `'&url=http://github.com'`,
    output: `'&url=https://github.com'`,
    errors: [{ messageId: "httpNotAllowed" }],
  },
  // Test with custom allowedOrigins
  {
    code: `'http://notallowed.com'`,
    output: `'https://notallowed.com'`,
    options: [{ allowedOrigins: ["custom.com"] }],
    errors: [{ messageId: "httpNotAllowed" }],
  },
];

await run({
  name: "no-http-url",
  rule,
  valid,
  invalid,
});
