const getCurrentUserPosition = (): Promise<[number, number]> => {
	return new Promise((resolve, reject) => {
		// eslint-disable-next-line sonarjs/no-intrusive-permissions
		navigator.geolocation.getCurrentPosition(
			(position) => {
				resolve([position.coords.latitude, position.coords.longitude]);
			},
			(error) => {
				reject(new Error(`Failed to get position: ${error.message}`));
			},
		);
	});
};

export { getCurrentUserPosition };
