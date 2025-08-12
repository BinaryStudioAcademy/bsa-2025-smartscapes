import { type LineStringGeometry } from "~/libs/types/types.js";

type MapboxConstructRouteApiResponseDto = {
	routes: [Route];
	uuid: string;
};

type Route = {
	distance: number;
	duration: number;
	geometry: LineStringGeometry;
};

export { type MapboxConstructRouteApiResponseDto };
