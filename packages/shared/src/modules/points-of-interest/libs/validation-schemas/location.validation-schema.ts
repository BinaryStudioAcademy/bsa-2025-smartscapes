import { z } from "zod";

import { PointsOfInterestValidationMessage } from "../enums/enums.js";
import {
	latitudeSchema,
	longitudeSchema,
} from "./longitude-latitude.validation-schema.js";

const locationSchema = z.object({
	coordinates: z.tuple([longitudeSchema, latitudeSchema]),
	type: z.literal("Point", {
		message: PointsOfInterestValidationMessage.INVALID_LOCATION_TYPE,
	}),
});

export { locationSchema };
