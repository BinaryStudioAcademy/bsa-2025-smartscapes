import { type LineStringGeometry } from "~/libs/types/types.js";

type MapboxConstructRouteResponseDto = {
	internalId: string;
	route: {
		distance: number;
		duration: number;
		geometry: LineStringGeometry;
	};
};

export { type MapboxConstructRouteResponseDto };
