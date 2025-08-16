import { type useAppDispatch } from "~/libs/hooks/hooks.js";
import { type RouteGetByIdResponseDto } from "~/modules/routes/libs/types/types.js";

import { getDistance, getPOICoordinates, getRoutes } from "./helpers.js";

const getSortedRoutes = async (
	dispatch: ReturnType<typeof useAppDispatch>,
	userCoordinates: [number, number],
): Promise<RouteGetByIdResponseDto[]> => {
	const allRoutes = await getRoutes(dispatch);
	const routesWithDistances = await Promise.all(
		allRoutes.map(async (route) => {
			const startingPoi = route.pois.find((poi) => poi.visitOrder === 0);

			if (!startingPoi) {
				return { ...route, distanceToUser: Infinity };
			}

			const pointCoordinates = await getPOICoordinates(
				dispatch,
				startingPoi.id,
			);
			const distance = getDistance(userCoordinates, pointCoordinates);

			return { ...route, distanceToUser: distance };
		}),
	);

	return routesWithDistances.sort(
		(a, b) => a.distanceToUser - b.distanceToUser,
	);
};

export { getSortedRoutes };
