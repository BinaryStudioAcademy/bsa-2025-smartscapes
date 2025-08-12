const UserFollowsApiPath = {
	$USER_ID_FOLLOWERS: "/:userId/followers",
	$USER_ID_FOLLOWERS_$ID: "/:userId/followers/:id",
} as const;

export { UserFollowsApiPath };
