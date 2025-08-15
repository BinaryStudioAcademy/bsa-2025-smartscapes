import { type PointsOfInterestRequestDto } from "~/modules/points-of-interest/points-of-interest.js";

type CreatePOIFormValues = Partial<PointsOfInterestRequestDto>;

const DEFAULT_CREATE_POI_PAYLOAD: CreatePOIFormValues = {
	description: null,
	name: "",
};

export { DEFAULT_CREATE_POI_PAYLOAD };
