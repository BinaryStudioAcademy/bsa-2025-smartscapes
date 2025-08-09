import { useMapContext } from "~/libs/components/components.js";
import { type MapClient } from "~/libs/modules/map-client/map-client.module.js";

const useMapClient = (): MapClient => {
	const client = useMapContext();

	if (!client) {
		throw new Error("useMapClient must be inside a MapProvider");
	}

	return client;
};

export { useMapClient };
