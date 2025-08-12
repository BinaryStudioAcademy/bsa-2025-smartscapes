import { MapContext } from "~/libs/components/components.js";
import { useContext } from "~/libs/hooks/hooks.js";
import { type MapClient } from "~/libs/modules/map-client/map-client.js";

const useMapClient = (): MapClient => {
	const client = useContext(MapContext);

	if (!client) {
		throw new Error("useMapClient must be used within a MapProvider");
	}

	return client;
};

export { useMapClient };
