/** @type {import('lint-staged').Configuration} */
const config = {
	"*": [
		() => "npm run lint:editor",
		() => "npm run lint:files",
		() => "npm run lint:unused",
		() => "npm run lint:format",
	],
};

export default config;
