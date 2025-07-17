import baseConfig from "../../lint-staged.config.js";

/** @type {import('lint-staged').Configuration} */
const config = {
	...baseConfig,
	"**/*.ts": [
		() => "npm run lint:js -w apps/backend",
		() => "npm run lint:types -w apps/backend",
	],
};

export default config;
