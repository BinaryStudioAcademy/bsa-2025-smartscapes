import { type PointsOfInterestPaginatedSummary } from "./points-of-interest-paginated-summary-dto.type.js";
import { type PointsOfInterestPaginationMeta } from "./points-of-interest-pagination-meta-dto.type.js";

type PointsOfInterestPaginatedResponseDto = {
	data: PointsOfInterestPaginatedSummary[];
	meta: PointsOfInterestPaginationMeta;
};

export { type PointsOfInterestPaginatedResponseDto };
