const AppRoute = {
	APP: "/app",
	CATEGORIES: "/app/categories",
	CONTENT: "/app/content",
	DASHBOARD: "/app/dashboard",
	EXPLORE: "/app/explore",
	MANAGE_ROUTES: "/app/manage-routes",
	POINTS_OF_INTEREST: "/app/points-of-interest",
	POINTS_OF_INTEREST_$ID: "/app/points-of-interest/:id",
	PROFILE: "/app/profile",
	ROOT: "/",
	ROUTES: "/app/routes",
	ROUTES_$ID: "/app/routes/:id",
	SIGN_IN: "/app/sign-in",
	SIGN_UP: "/app/sign-up",
	USERS_$ID: "/app/users/:id",
} as const;

export { AppRoute };
