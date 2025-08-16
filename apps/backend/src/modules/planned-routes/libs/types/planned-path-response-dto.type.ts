import { type LineStringGeometry } from "~/libs/types/types.js";

type PlannedPathResponseDto = {
	distance: number;
	duration: number;
	geometry: LineStringGeometry;
	id: number;
};

export { type PlannedPathResponseDto };
