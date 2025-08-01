const UsersApiPath = {
	FOLLOW: "/:userId/followers",
	ROOT: "/",
	UNFOLLOW: "/:userId/followers/:id",
} as const;

export { UsersApiPath };
