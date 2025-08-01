type PWARegistrationConfig = {
	isImmediate?: boolean;
	onRegistered?: (registration: ServiceWorkerRegistration) => void;
	updateIntervalMs?: number;
};

export { type PWARegistrationConfig };
