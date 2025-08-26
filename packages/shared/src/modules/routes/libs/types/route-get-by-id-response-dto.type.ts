import { type LineStringGeometry } from "../../../../libs/types/types.js";
import { type FileUploadResponseDto } from "../../../files/libs/types/types.js";

type RouteGetByIdResponseDto = {
	createdByUserId: number;
	description: string;
	distance: number;
	duration: number;
	geometry: LineStringGeometry;
	id: number;
	images: Pick<FileUploadResponseDto, "id" | "url">[];
	name: string;
	pois: {
		id: number;
		name: string;
		visitOrder: number;
	}[];
};

export { type RouteGetByIdResponseDto };
