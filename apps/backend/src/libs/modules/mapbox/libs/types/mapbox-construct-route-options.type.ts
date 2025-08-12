import { type ValueOf } from "~/libs/types/types.js";

import { type MapboxAPIGeometric } from "../enums/mapbox-api-geometric.enum.js";

type MapboxConstructRouteOptions = {
	access_token: string;
	alternatives: "false" | "true";
	geometries: ValueOf<typeof MapboxAPIGeometric>;
	overview: "simplified";
	steps: "false" | "true";
};

export { type MapboxConstructRouteOptions };
