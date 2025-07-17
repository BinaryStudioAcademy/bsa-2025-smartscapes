import { type KnipConfig } from "knip";

const config: KnipConfig = {
	workspaces: {
		".": {
			entry: ["./dangerfile.ts"],
			ignore: ["apps/build/**"],
		},
		"apps/backend": {
			entry: ["src/db/migrations/*.ts", "knexfile.ts"],
			ignoreDependencies: ["pg"],
		},
		"apps/frontend": {
			entry: ["src/index.tsx"],
		},
		"packages/shared": {
			entry: ["build/index.js"],
			ignore: ["src/**/**"],
			includeEntryExports: true,
		},
	},
};

export default config;
