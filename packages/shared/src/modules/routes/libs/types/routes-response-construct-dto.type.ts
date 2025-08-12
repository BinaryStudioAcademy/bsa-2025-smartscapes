import { type LineStringGeometry } from "../../../../libs/types/types.js";

type RoutesResponseConstructDto = {
	internalId: string;
	route: {
		distance: number;
		duration: number;
		geometry: LineStringGeometry;
	};
};

export { type RoutesResponseConstructDto };
