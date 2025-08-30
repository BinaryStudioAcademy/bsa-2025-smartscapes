import { config } from "~/libs/modules/config/config.js";
import { type Coordinates } from "~/libs/types/types.js";

const DEFAULT_WIDTH = 400;
const DEFAULT_HEIGHT = 300;

type StaticMapOptions = {
	height?: number;
	markers?: { coordinates: Coordinates }[];
	width?: number;
};

const generateStaticMapUrl = ({
	height = DEFAULT_HEIGHT,
	markers = [],
	width = DEFAULT_WIDTH,
}: StaticMapOptions): string => {
	const accessToken = config.ENV.MAPBOX.ACCESS_TOKEN;
	const style = "mapbox/streets-v12";
	const markerColor = "1a5d5d";

	const overlays: string[] = [];

	if (markers.length > 0) {
		for (const { coordinates } of markers) {
			const [lng, lat] = coordinates;
			overlays.push(`pin-s+${markerColor}(${String(lng)},${String(lat)})`);
		}
	}

	const centerPart = "auto";

	const baseUrl = `https://api.mapbox.com/styles/v1/${style}/static`;
	const overlayPart = overlays.length > 0 ? overlays.join(",") : "";
	const sizePart = `${String(width)}x${String(height)}`;

	const url = overlayPart
		? `${baseUrl}/${overlayPart}/${centerPart}/${sizePart}`
		: `${baseUrl}/${centerPart}/${sizePart}`;

	const queryParameters = new URLSearchParams({
		access_token: accessToken,
		attribution: "false",
		logo: "false",
		padding: "50",
	});

	return `${url}?${queryParameters.toString()}`;
};

export { generateStaticMapUrl };
