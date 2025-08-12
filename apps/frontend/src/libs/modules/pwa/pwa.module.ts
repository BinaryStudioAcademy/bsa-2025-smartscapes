import { registerSW } from "virtual:pwa-register";

import { UPDATE_INTERVAL } from "./libs/constants/constants.js";
import {
	type PWARegistrationConfig,
	type RegisterSWOptions,
} from "./libs/types/types.js";

class PWA {
	private updateInterval: number;

	public constructor() {
		this.updateInterval = UPDATE_INTERVAL;
	}

	public register(config: PWARegistrationConfig = {}): void {
		const {
			isImmediate = true,
			onRegistered,
			updateIntervalMs = this.updateInterval,
		} = config;

		registerSW({
			immediate: isImmediate,
			onRegistered: (registration): void => {
				if (!registration) {
					return;
				}

				setInterval(() => {
					void registration.update();
				}, updateIntervalMs);

				onRegistered?.(registration);
			},
		} satisfies RegisterSWOptions);
	}
}

export { PWA };
