/**
 * @import { Config } from "prettier";
 */

const config = /** @type {const} @satisfies {Config} */ ({
	arrowParens: "always",
	bracketSpacing: true,
	printWidth: 80,
	quoteProps: "preserve",
	semi: true,
	singleQuote: false,
	tabWidth: 2,
	useTabs: true,
});

export default config;
