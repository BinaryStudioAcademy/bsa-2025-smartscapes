const ProjectPrefix = {
	CHANGE_TYPES: [
		"build",
		"chore",
		"ci",
		"docs",
		"feat",
		"fix",
		"perf",
		"refactor",
		"revert",
		"style",
		"test",
	],
	ENVIRONMENT: "main",
	ISSUE_PREFIXES: ["ss", "release"],
	SCOPE: {
		APPS: ["frontend", "backend"],
		COMMON: ["root", "release"],
		PACKAGES: ["shared"],
	},
} as const;

export { ProjectPrefix };
