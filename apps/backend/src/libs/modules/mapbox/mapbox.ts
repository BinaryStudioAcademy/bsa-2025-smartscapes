import { config } from "../config/config.js";
import { http } from "../http/http.js";
import { MapboxDirectionsApi } from "./mapbox-directions-api.js";

const mapboxDirectionsApi = new MapboxDirectionsApi({ config, http });

export { mapboxDirectionsApi };
export {
	MapboxAPIGeometricsType,
	MapboxAPIProfile,
} from "./libs/enums/enums.js";
export { type GetMapboxRouteResponseDto } from "./libs/types/types.js";
export { type MapboxDirectionsApi } from "./mapbox-directions-api.js";
