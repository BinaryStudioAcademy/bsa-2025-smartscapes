import React from "react";

import { useAppDispatch, useEffect, useState } from "~/libs/hooks/hooks.js";
import { type RouteGetByIdResponseDto } from "~/modules/routes/libs/types/types.js";

import { Loader, RouteCard } from "../components.js";
import { getCurrentUserPosition, getSortedRoutes } from "./helpers/helpers.js";
import styles from "./styles.module.css";

const ExploreRoutesBlock = (): React.JSX.Element => {
	const dispatch = useAppDispatch();
	const [routes, setRoutes] = useState<RouteGetByIdResponseDto[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<null | string>(null);

	useEffect(() => {
		const fetchData = async (): Promise<void> => {
			try {
				const userCoordinates = await getCurrentUserPosition();
				const sortedRoutes = await getSortedRoutes(dispatch, userCoordinates);
				setRoutes(sortedRoutes);
			} catch (error: unknown) {
				if (error instanceof Error) {
					setError(error.message);
				} else {
					setError("An unknown error occured.");
				}
			} finally {
				setLoading(false);
			}
		};

		void fetchData();
	}, [dispatch]);

	let content;

	if (loading) {
		content = (
			<div className={styles["loading"]}>
				<Loader />
			</div>
		);
	} else if (error) {
		content = <div className={styles["error"]}>Error: {error}</div>;
	} else {
		content =
			routes.length === 0 ? (
				<div className={styles["not-found"]}>No routes found nearby.</div>
			) : (
				<ul className={styles["list"]}>
					{routes.map((route) => (
						<RouteCard imageUrl={null} key={route.id} name={route.name} />
					))}
				</ul>
			);
	}

	return (
		<div className={styles["container"]}>
			<h3 className={styles["title"]}>Explore routes</h3>
			{content}
		</div>
	);
};

export { ExploreRoutesBlock };
