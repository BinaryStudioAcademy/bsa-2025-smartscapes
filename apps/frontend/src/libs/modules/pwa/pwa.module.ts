// eslint-disable-next-line import/no-unresolved
import { registerSW } from "virtual:pwa-register";

import { PWAConfig } from "./libs/enums/enums.js";
import {
	type PWARegistrationConfig,
	type RegisterSWOptions,
} from "./libs/types/types.js";

class PWAModule {
	private updateInterval: number;

	public constructor() {
		this.updateInterval = PWAConfig.UPDATE_INTERVAL_MS;
	}

	public register(config: PWARegistrationConfig = {}): void {
		const {
			immediate = true,
			onNeedRefresh,
			onRegistered,
			updateIntervalMs = this.updateInterval,
		} = config;

		registerSW({
			immediate,
			onNeedRefresh: (): void => {
				if (import.meta.env.DEV) {
					globalThis.location.reload();
				}

				onNeedRefresh?.();
			},
			onRegistered: (registration): void => {
				if (registration) {
					setInterval(() => {
						void registration.update();
					}, updateIntervalMs);
				}

				if (registration) {
					onRegistered?.(registration);
				}
			},
		} satisfies RegisterSWOptions);
	}

	public setUpdateInterval(intervalMs: number): void {
		this.updateInterval = intervalMs;
	}
}

export { PWAModule };
