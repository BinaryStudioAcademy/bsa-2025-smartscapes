import jsPlugin from "@eslint/js";
import stylisticPlugin from "@stylistic/eslint-plugin";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import { type ESLint, type Linter } from "eslint";
import { resolve as tsResolver } from "eslint-import-resolver-typescript";
import importPlugin from "eslint-plugin-import";
import jsdocPlugin from "eslint-plugin-jsdoc";
import perfectionistPlugin from "eslint-plugin-perfectionist";
import explicitGenericsPlugin from "eslint-plugin-require-explicit-generics";
import sonarjsPlugin from "eslint-plugin-sonarjs";
import unicornPlugin from "eslint-plugin-unicorn";
import globals from "globals";

const JS_MAX_PARAMS_ALLOWED = 3;

const filesConfig: Linter.Config = {
	files: ["**/*.{js,ts,tsx}"],
};

const ignoresConfig: Linter.Config = {
	ignores: ["apps", "packages", "scripts", "dangerfile.ts"],
};

const jsConfig: Linter.Config = {
	languageOptions: {
		globals: globals.node,
		parserOptions: {
			ecmaVersion: "latest",
			sourceType: "module",
		},
	},
	rules: {
		...jsPlugin.configs.recommended.rules,
		"arrow-parens": ["error", "always"],
		curly: ["error", "all"],
		eqeqeq: ["error", "always"],
		"max-params": ["error", JS_MAX_PARAMS_ALLOWED],
		"no-console": ["error"],
		"no-multiple-empty-lines": [
			"error",
			{
				max: 1,
			},
		],
		"no-restricted-syntax": [
			"error",
			{
				message: "Export/Import all (*) is forbidden.",
				selector: "ExportAllDeclaration,ImportAllDeclaration",
			},
			{
				message: "Exports should be at the end of the file.",
				selector: "ExportNamedDeclaration[declaration!=null]",
			},
			{
				message: "TS features are forbidden.",
				selector: "TSEnumDeclaration,ClassDeclaration[abstract=true]",
			},
			{
				message:
					"Avoid import/export type { Type } from './module'. Prefer import/export { type Type } from './module'.",
				selector:
					"ImportDeclaration[importKind=type],ExportNamedDeclaration[exportKind=type]",
			},
		],
		"object-shorthand": ["error"],
		"prefer-destructuring": ["error"],
		quotes: ["error", "double"],
	},
};

const importConfig: Linter.Config = {
	plugins: {
		import: importPlugin,
	},
	rules: {
		...importPlugin.configs.recommended.rules,
		"import/exports-last": ["error"],
		"import/extensions": [
			"error",
			{
				js: "always",
			},
		],
		"import/newline-after-import": ["error"],
		"import/no-default-export": ["error"],
		"import/no-duplicates": ["error"],
	},
	settings: {
		"import/parsers": {
			espree: [".js", ".cjs"],
		},
		"import/resolver": {
			typescript: tsResolver,
		},
	},
};

const sonarConfig: Linter.Config = {
	plugins: {
		sonarjs: sonarjsPlugin as ESLint.Plugin,
	},
	rules: {
		...sonarjsPlugin.configs.recommended.rules,
		"sonarjs/no-duplicate-string": ["off"],
		"sonarjs/no-hardcoded-passwords": ["off"],
		"sonarjs/todo-tag": ["off"],
	},
};

const unicornConfig: Linter.Config = {
	plugins: {
		unicorn: unicornPlugin,
	},
	rules: {
		...unicornPlugin.configs.recommended.rules,
		"unicorn/no-null": ["off"],
	},
};

const perfectionistConfig: Linter.Config = {
	plugins: {
		perfectionist: perfectionistPlugin,
	},
	rules: perfectionistPlugin.configs["recommended-natural"]
		.rules as Linter.RulesRecord,
};

const stylisticConfig: Linter.Config = {
	plugins: {
		"@stylistic/js": stylisticPlugin,
	},
	rules: {
		"@stylistic/js/padding-line-between-statements": [
			"error",
			{
				blankLine: "never",
				next: "export",
				prev: "export",
			},
			{
				blankLine: "always",
				next: "*",
				prev: ["block-like", "throw", "type"],
			},
			{
				blankLine: "always",
				next: ["return", "block-like", "throw", "type"],
				prev: "*",
			},
		],
	},
};

const typescriptConfig: Linter.Config = {
	ignores: [
		"prettier.config.js",
		"lint-staged.config.js",
		"stylelint.config.js",
	],
	languageOptions: {
		parser: tsParser,
		parserOptions: {
			project: "./tsconfig.json",
		},
	},
	plugins: {
		"@typescript-eslint": tsPlugin as unknown as ESLint.Plugin,
	},
	rules: {
		...tsPlugin.configs["strict-type-checked"]?.rules,
		"@typescript-eslint/consistent-type-exports": ["error"],
		"@typescript-eslint/consistent-type-imports": [
			"error",
			{
				fixStyle: "inline-type-imports",
			},
		],
		"@typescript-eslint/explicit-function-return-type": [
			"error",
			{
				allowTypedFunctionExpressions: true,
			},
		],
		"@typescript-eslint/explicit-member-accessibility": ["error"],
		"@typescript-eslint/no-magic-numbers": [
			"error",
			{
				ignoreEnums: true,
				ignoreReadonlyClassProperties: true,
				ignoreTypeIndexes: true,
			},
		],
		"@typescript-eslint/no-unnecessary-type-parameters": ["off"],
		"@typescript-eslint/return-await": ["error", "always"],
	},
};

const jsdocConfig: Linter.Config = {
	files: ["prettier.config.js", "lint-staged.config.js", "stylelint.config.js"],
	plugins: {
		jsdoc: jsdocPlugin,
	},
	rules: {
		...(
			jsdocPlugin.configs[
				"recommended-typescript-flavor-error"
			] as Linter.Config
		).rules,
		"jsdoc/no-undefined-types": ["error"],
		"jsdoc/require-returns-description": ["off"],
	},
};

const explicitGenericsConfig: Linter.Config = {
	plugins: {
		"require-explicit-generics": explicitGenericsPlugin as ESLint.Plugin,
	},
};

const overridesConfigs: Linter.Config[] = [
	{
		files: [
			"commitlint.config.ts",
			"prettier.config.js",
			"stylelint.config.js",
			"knip.config.ts",
			"lint-staged.config.js",
			"eslint.config.ts",
		],
		rules: {
			"import/no-default-export": ["off"],
		},
	},
	{
		files: ["*.js"],
		rules: {
			"@typescript-eslint/explicit-function-return-type": ["off"],
		},
	},
];

const config: Linter.Config[] = [
	filesConfig,
	ignoresConfig,
	jsConfig,
	importConfig,
	sonarConfig,
	unicornConfig,
	perfectionistConfig,
	stylisticConfig,
	typescriptConfig,
	jsdocConfig,
	explicitGenericsConfig,
	...overridesConfigs,
];

export default config;
