/* eslint-disable import/no-default-export */
import { defineConfig } from "@playwright/test";

export default defineConfig({
	reporter: [["html", { open: "never", outputFolder: "test-report" }]],
	testDir: "./tests/tests",
	use: {
		baseURL: "https://smart-scapes.com/api/v1/",
		extraHTTPHeaders: {
			"Content-Type": "application/json",
		},
		ignoreHTTPSErrors: true,
		trace: "retain-on-failure",
	},
});
