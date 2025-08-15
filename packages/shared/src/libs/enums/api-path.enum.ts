const APIPath = {
	AUTH: "/auth",
	FILES: "/files",
	NOTIFICATIONS: "/notifications",
	POINTS_OF_INTEREST: "/points-of-interest",
	REVIEWS: "/reviews",
	ROUTE_CATEGORIES: "/route-categories",
	ROUTES: "/routes",
	ROUTES_$ID: "/routes/:id",
	USERS: "/users",
} as const;

export { APIPath };
