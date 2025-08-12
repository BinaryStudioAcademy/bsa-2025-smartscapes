import { z } from "zod";

import { LocationType } from "../../../../libs/enums/enums.js";
import { PointsOfInterestValidationMessage } from "../enums/points-of-interest-validation-message.enum.js";
import {
	latitudeSchema,
	longitudeSchema,
} from "./longitude-latitude.validation-schema.js";

const locationSchema = z.object({
	coordinates: z.tuple([longitudeSchema, latitudeSchema]),
	type: z.literal(LocationType.POINT, {
		message: PointsOfInterestValidationMessage.INVALID_LOCATION_TYPE,
	}),
});

export { locationSchema };
