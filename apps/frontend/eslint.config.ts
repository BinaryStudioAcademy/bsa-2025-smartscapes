import { type Linter } from "eslint";
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import globals from "globals";

import baseConfig from "../../eslint.config.js";

const ignoresConfig = {
	ignores: ["build"],
} satisfies Linter.Config;

const mainConfig = {
	languageOptions: {
		globals: {
			...globals.node,
			...globals.browser,
			JSX: true,
			React: true,
		},
	},
} satisfies Linter.Config;

const reactConfig = {
	files: ["**/*.tsx"],
	plugins: {
		react: reactPlugin,
	},
	rules: {
		...reactPlugin.configs["jsx-runtime"].rules,
		...reactPlugin.configs["recommended"].rules,
		"react/jsx-boolean-value": ["error"],
		"react/jsx-curly-brace-presence": ["error"],
		"react/jsx-no-bind": ["error", { ignoreRefs: true }],
		"react/prop-types": ["off"],
		"react/self-closing-comp": ["error"],
	},
	settings: {
		react: {
			version: "detect",
		},
	},
} satisfies Linter.Config;

const reactHooksConfig = {
	files: ["**/*.tsx"],
	plugins: {
		"react-hooks": reactHooksPlugin,
	},
	rules: reactHooksPlugin.configs.recommended.rules,
} satisfies Linter.Config;

const jsxA11yConfig = {
	files: ["**/*.tsx"],
	plugins: {
		"jsx-a11y": jsxA11yPlugin,
	},
	rules: jsxA11yPlugin.configs.recommended.rules as Linter.RulesRecord,
} satisfies Linter.Config;

const explicitGenericsConfig = {
	rules: {
		"require-explicit-generics/require-explicit-generics": [
			"error",
			["useState"],
		],
	},
} satisfies Linter.Config;

const overridesConfigs = [
	{
		files: ["vite.config.ts"],
		rules: {
			"import/no-default-export": ["off"],
		},
	},
	{
		files: ["src/vite-env.d.ts"],
		rules: {
			"unicorn/prevent-abbreviations": ["off"],
		},
	},
] satisfies Linter.Config[];

const config = [
	...baseConfig,
	ignoresConfig,
	mainConfig,
	reactConfig,
	reactHooksConfig,
	jsxA11yConfig,
	explicitGenericsConfig,
	...overridesConfigs,
] satisfies Linter.Config[];

export default config;
