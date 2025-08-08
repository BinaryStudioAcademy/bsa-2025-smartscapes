import { type PointGeometry } from "~/libs/types/types.js";

type GetMapboxRouteResponseDto = {
	code: string;
	routes: MapboxRoute[];
	uuid: string;
	waypoints: MapboxWaypoint[];
};

type MapboxLegs = {
	admins: {
		iso_3166_1: string;
		iso_3166_1_alpha3: string;
	}[];
	distance: number;
	duration: number;
	summary: string;
	weight: number;
};

type MapboxRoute = {
	distance: number;
	duration: number;
	geometry: {
		coordinates: PointGeometry["coordinates"][];
		type: string;
	};
	legs: MapboxLegs[];
	weight: number;
	weight_name: string;
};

type MapboxWaypoint = {
	distance: number;
	location: PointGeometry["coordinates"][];
	name: string;
};

export { type GetMapboxRouteResponseDto };
