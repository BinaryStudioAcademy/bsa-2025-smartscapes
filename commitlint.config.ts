import { RuleConfigSeverity, type UserConfig } from "@commitlint/types";

import { ProjectPrefix } from "./project.config.js";

const config: UserConfig = {
	extends: ["@commitlint/config-conventional"],
	parserPreset: {
		parserOpts: {
			issuePrefixes: ProjectPrefix.ISSUE_PREFIXES.map((prefix) => `${prefix}-`),
		},
	},
	rules: {
		"references-empty": [RuleConfigSeverity.Error, "never"],
		"scope-empty": [RuleConfigSeverity.Error, `never`],
		"scope-enum": [
			RuleConfigSeverity.Error,
			"always",
			[
				...ProjectPrefix.SCOPE.COMMON,
				...ProjectPrefix.SCOPE.APPS,
				...ProjectPrefix.SCOPE.PACKAGES,
			],
		],
	},
};

export default config;
