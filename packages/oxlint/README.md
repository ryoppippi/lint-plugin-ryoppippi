# oxlint-plugin-ryoppippi

Oxlint JavaScript plugin for ryoppippi's custom lint rules.

## Install

```sh
vp add -D oxlint oxlint-plugin-ryoppippi
```

## Configure

```jsonc
{
  "jsPlugins": ["oxlint-plugin-ryoppippi"],
  "rules": {
    "ryoppippi/no-http-url": "error",
    "ryoppippi/require-comment-on-useEffect": "error",
  },
}
```
