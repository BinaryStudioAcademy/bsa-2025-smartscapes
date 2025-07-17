import baseConfig from "../../lint-staged.config.js";

/** @type {import('lint-staged').Configuration} */
const config = {
	...baseConfig,
	"**/*.ts": [
		() => "npm run lint:js -w packages/shared",
		() => "npm run lint:types -w packages/shared",
	],
};

export default config;
