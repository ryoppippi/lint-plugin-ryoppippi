# require-comment-on-useEffect

Enforce a comment on every `useEffect` hook.

## Rule Details

```ts
// 👍 ok

const someValue = 1;

// prints the value of `someValue` whenever it changes
useEffect(() => {
  console.log(someValue);
}, [someValue]);
```

```ts
// 👎 error

const someValue = 1;
useEffect(() => {
  console.log(someValue);
}, [someValue]);
```

## Why

`useEffect` is an escape hatch from the React paradigm, so you need a reason to use it (it should be avoided if possible).

## References

- [ You might not need an effect ](https://react.dev/learn/you-might-not-need-an-effect)
- [ Add comments to useEffect ](https://www.pandanoir.info/entry/2025/01/29/205439)
- [ Write "why" in comments ](https://jisou-programmer.beproud.jp/%E9%96%A2%E6%95%B0%E8%A8%AD%E8%A8%88/10-%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88%E3%81%AB%E3%81%AF%E3%80%8C%E3%81%AA%E3%81%9C%E3%80%8D%E3%82%92%E6%9B%B8%E3%81%8F.html)
