const AuthApiPath = {
	AUTHENTICATED_USER: "/authenticated-user",
	AUTHENTICATED_USER_$ID: "/authenticated-user/:id",
	SIGN_IN: "/sign-in",
	SIGN_UP: "/sign-up",
} as const;

export { AuthApiPath };
