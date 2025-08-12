import { type Linter } from "eslint";

import baseConfig from "../../eslint.config.js";

const ignoresConfig = {
	ignores: ["build"],
} satisfies Linter.Config;

const config = [...baseConfig, ignoresConfig] satisfies Linter.Config[];

export default config;
