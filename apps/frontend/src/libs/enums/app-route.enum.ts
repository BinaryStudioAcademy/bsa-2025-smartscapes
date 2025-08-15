const AppRoute = {
	ADMINISTRATIVE_DASHBOARD: "/app/administrative-dashboard",
	APP: "/app",
	CATEGORIES: "/app/categories",
	CONTENT: "/app/content",
	EXPLORE: "/app/explore",
	PROFILE: "/app/profile",
	ROOT: "/",
	ROUTES: "/app/routes",
	ROUTES_$ID: "/app/routes/:id",
	SIGN_IN: "/app/sign-in",
	SIGN_UP: "/app/sign-up",
} as const;

export { AppRoute };
