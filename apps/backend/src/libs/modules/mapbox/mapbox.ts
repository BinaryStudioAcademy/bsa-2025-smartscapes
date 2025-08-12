import { config } from "../config/config.js";
import { http } from "../http/http.js";
import { MapboxDirectionsApi } from "./mapbox-directions-api.module.js";

const mapboxDirectionsApi = new MapboxDirectionsApi({ config, http });

export { mapboxDirectionsApi };
export { MapboxAPIGeometric, MapboxAPIProfile } from "./libs/enums/enums.js";
export { type MapboxDirectionsApi } from "./mapbox-directions-api.module.js";
