import { config } from "~/libs/modules/config/config.js";
import { http } from "~/libs/modules/http/http.js";
import { storage } from "~/libs/modules/storage/storage.js";

import { PointOfInterestApi } from "./points-of-interest-api.js";

const pointOfInterestApi = new PointOfInterestApi({
	baseUrl: config.ENV.API.ORIGIN_URL,
	http,
	storage,
});

export { pointOfInterestApi };
export {
	type PointsOfInterestPaginatedResponseDto,
	type PointsOfInterestPaginatedSummary,
	type PointsOfInterestPaginationMeta,
	type PointsOfInterestRequestDto,
	type PointsOfInterestResponseDto,
} from "./libs/types/types.js";
export { pointOfInterestCreateValidationSchema } from "./libs/validation-schemas/validation-schemas.js";
export { actions, reducer } from "./slices/points-of-interest.js";
