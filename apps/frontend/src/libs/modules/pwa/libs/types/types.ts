type PWARegistrationConfig = {
	immediate?: boolean;
	onNeedRefresh?: () => void;
	onRegistered?: (registration: ServiceWorkerRegistration) => void;
	updateIntervalMs?: number;
};

export { type PWARegistrationConfig };
export { type RegisterSWOptions } from "vite-plugin-pwa/types";
