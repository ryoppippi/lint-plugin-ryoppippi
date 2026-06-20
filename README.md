# lint-plugin-ryoppippi

Lint plugins maintained by ryoppippi.

## Packages

- [`eslint-plugin-ryoppippi`](./packages/eslint)
- [`oxlint-plugin-ryoppippi`](./packages/oxlint)

## Development

Enter the Nix development environment directly or allow direnv:

```sh
nix develop
direnv allow
```

Install dependencies and run all checks with Vite+:

```sh
vp install --frozen-lockfile
vp run check
vp run build
vp run test
```
