# eslint-plugin-ryoppippi

[Rules List](./src/rules)

## Install

### npm

```sh
pnpm install --D eslint-plugin-ryoppippi
```

`eslint.config.js`

```ts
import ryoppippi from 'eslint-plugin-ryoppippi';

export default [
	...ryoppippi.configs['flat/recommended']
];
```
