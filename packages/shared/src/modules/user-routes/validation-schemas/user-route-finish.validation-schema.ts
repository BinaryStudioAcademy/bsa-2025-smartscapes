import { z } from "zod";

import {
	CoordinatesValidationMessage,
	CoordinatesValidationRule,
	LocationType,
} from "../../../libs/enums/enums.js";
import { UserRouteValidationMessage } from "../libs/enums/enums.js";

const userRouteFinish = z.strictObject({
	actualGeometry: z.object({
		coordinates: z
			.array(
				z.tuple([
					z
						.number()
						.min(
							CoordinatesValidationRule.LONGITUDE_MIN,
							CoordinatesValidationMessage.LONGITUDE_MIN,
						)
						.max(
							CoordinatesValidationRule.LONGITUDE_MAX,
							CoordinatesValidationMessage.LONGITUDE_MAX,
						),
					z
						.number()
						.min(
							CoordinatesValidationRule.LATITUDE_MIN,
							CoordinatesValidationMessage.LATITUDE_MIN,
						)
						.max(
							CoordinatesValidationRule.LATITUDE_MAX,
							CoordinatesValidationMessage.LATITUDE_MAX,
						),
				]),
			)
			.min(CoordinatesValidationRule.MIN_COORDINATES_COUNT, {
				message: CoordinatesValidationMessage.INVALID_COORDINATES,
			}),
		type: z.literal(LocationType.LINE_STRING, {
			message: UserRouteValidationMessage.INVALID_LOCATION_TYPE,
		}),
	}),
});

export { userRouteFinish };
