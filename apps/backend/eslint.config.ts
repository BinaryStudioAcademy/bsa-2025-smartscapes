import { type Linter } from "eslint";

import baseConfig from "../../eslint.config.js";

const ignoresConfig = {
	ignores: ["build"],
} satisfies Linter.Config;

const overridesConfigs = [
	{
		files: ["knexfile.ts"],
		rules: {
			"import/no-default-export": ["off"],
		},
	},
	{
		files: ["src/db/migrations/**/*.ts"],
		rules: {
			"unicorn/filename-case": [
				"error",
				{
					case: "snakeCase",
				},
			],
		},
	},
	{
		files: ["src/libs/modules/controller/base-controller.module.ts"],
		rules: {
			"@typescript-eslint/no-magic-numbers": ["off"],
		},
	},
] satisfies Linter.Config[];

const config = [
	...baseConfig,
	ignoresConfig,
	...overridesConfigs,
] satisfies Linter.Config[];

export default config;
