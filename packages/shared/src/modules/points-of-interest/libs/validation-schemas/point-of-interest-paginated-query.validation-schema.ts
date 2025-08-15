import { z } from "zod";

const pointsOfInterestPaginatedQuery = z.object({
	limit: z.string().trim().optional(),
	page: z.string().trim().optional(),
	search: z.string().trim().optional(),
});

export { pointsOfInterestPaginatedQuery };
