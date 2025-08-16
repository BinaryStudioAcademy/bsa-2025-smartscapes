import { type LineStringGeometry } from "../../../../libs/types/types.js";

type RouteGetAllItemResponseDto = {
	distance: number;
	duration: number;
	geometry: LineStringGeometry;
	id: number;
	name: string;
	pois: {
		id: number;
		visitOrder: number;
	}[];
	userId: number;
};

export { type RouteGetAllItemResponseDto };
