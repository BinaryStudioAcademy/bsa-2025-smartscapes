import reactPlugin from "@vitejs/plugin-react";
import browserslist from "browserslist";
import { browserslistToTargets, Features } from "lightningcss";
import { fileURLToPath } from "node:url";
import { type ConfigEnv, defineConfig, loadEnv } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import svgr from "vite-plugin-svgr";

const BYTES_IN_KB = 1024;
const BYTES_IN_MB = BYTES_IN_KB * BYTES_IN_KB;
const MAX_FILE_CACHE_SIZE_MB = 3.5;

const config = ({ mode }: ConfigEnv): ReturnType<typeof defineConfig> => {
	const {
		VITE_APP_API_ORIGIN_URL,
		VITE_APP_DEVELOPMENT_PORT,
		VITE_APP_PROXY_SERVER_URL,
	} = loadEnv(mode, process.cwd());

	return defineConfig({
		build: {
			cssMinify: "lightningcss",
			outDir: "build",
			rollupOptions: {
				output: {
					manualChunks: {
						mapbox: ["mapbox-gl"],
					},
				},
			},
		},
		css: {
			lightningcss: {
				drafts: {
					customMedia: true,
				},
				include: Features.MediaQueries,
				targets: browserslistToTargets(
					browserslist(["last 2 version", "not dead"]),
				),
			},
			transformer: "lightningcss",
		},
		plugins: [
			reactPlugin(),
			svgr(),
			VitePWA({
				devOptions: {
					enabled: true,
					type: "module",
				},
				includeManifestIcons: false,
				manifest: {
					background_color: "#ffffff",
					description:
						"Interactive mapping platform for exploring large, complex areas",
					icons: [
						{
							sizes: "192x192",
							src: "/assets/images/pwa-192x192.png",
							type: "image/png",
						},
						{
							sizes: "512x512",
							src: "/assets/images/pwa-512x512.png",
							type: "image/png",
						},
						{
							purpose: "any",
							sizes: "512x512",
							src: "/assets/images/pwa-512x512.png",
							type: "image/png",
						},
						{
							purpose: "maskable",
							sizes: "512x512",
							src: "/assets/images/pwa-512x512.png",
							type: "image/png",
						},
					],
					name: "SmartScapes",
					scope: "/",
					short_name: "SmartScapes",
					start_url: "/",
					theme_color: "#ffffff",
				},
				registerType: "autoUpdate",
				workbox: {
					globIgnores: ["**/node_modules/**/*", "sw.js", "workbox-*.js"],
					globPatterns: ["**/*.{js,css,html,ico,png,svg,jpg,woff2}"],
					maximumFileSizeToCacheInBytes: MAX_FILE_CACHE_SIZE_MB * BYTES_IN_MB,
				},
			}),
		],
		resolve: {
			alias: [
				{
					find: "~",
					replacement: fileURLToPath(new URL("src", import.meta.url)),
				},
			],
		},
		server: {
			port: Number(VITE_APP_DEVELOPMENT_PORT),
			proxy: {
				[VITE_APP_API_ORIGIN_URL as string]: {
					changeOrigin: true,
					target: VITE_APP_PROXY_SERVER_URL,
				},
			},
		},
	});
};

export default config;
