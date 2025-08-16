type RouteCreateRequestDto = {
	description: string;
	name: string;
	plannedPathId: number;
	poiIds: number[];
	userId: number;
};

export { type RouteCreateRequestDto };
