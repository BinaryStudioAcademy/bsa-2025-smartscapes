import { type FastifyHelmetOptions } from "@fastify/helmet";

const HELMET_CONFIG: FastifyHelmetOptions = {
	contentSecurityPolicy: {
		directives: {
			childSrc: ["'self'", "blob:"],
			connectSrc: [
				"'self'",
				"https://api.mapbox.com",
				"https://events.mapbox.com",
				"https://*.tiles.mapbox.com",
			],
			defaultSrc: ["'self'"],
			imgSrc: ["'self'", "data:", "blob:"],
			workerSrc: ["'self'", "blob:"],
		},
	},
};

export { HELMET_CONFIG };
