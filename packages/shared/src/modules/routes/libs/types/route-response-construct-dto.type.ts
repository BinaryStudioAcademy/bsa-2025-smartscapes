import { type LineStringGeometry } from "../../../../libs/types/types.js";

type RouteConstructResponseDto = {
	internalId: string;
	route: {
		distance: number;
		duration: number;
		geometry: LineStringGeometry;
	};
};

export { type RouteConstructResponseDto };
