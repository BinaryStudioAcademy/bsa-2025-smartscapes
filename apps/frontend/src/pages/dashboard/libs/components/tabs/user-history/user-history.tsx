import { Loader } from "~/libs/components/components.js";
import { DataStatus, UserRouteStatus } from "~/libs/enums/enums.js";
import {
	useAppDispatch,
	useAppSelector,
	useEffect,
} from "~/libs/hooks/hooks.js";
import { actions as userRoutesActions } from "~/modules/user-routes/user-routes.js";

import { DashboardRouteCard } from "../../card/dashboard-route-card.js";
import styles from "./styles.module.css";

const UserHistory = (): null | React.JSX.Element => {
	const dispatch = useAppDispatch();
	const authenticatedUser = useAppSelector(
		({ auth }) => auth.authenticatedUser,
	);

	useEffect(() => {
		if (authenticatedUser) {
			void dispatch(
				userRoutesActions.getAllByUserId({
					status: UserRouteStatus.COMPLETED,
				}),
			);
		}
	}, [authenticatedUser, dispatch]);

	const finishedUserRoutes = useAppSelector(
		(state) => state.userRoutes.userRoutes,
	);

	const dataStatus = useAppSelector((state) => state.userRoutes.dataStatus);

	if (dataStatus === DataStatus.PENDING || dataStatus === DataStatus.IDLE) {
		return (
			<div className={styles["loader-container"]}>
				<Loader />
			</div>
		);
	}

	if (finishedUserRoutes.length === 0) {
		return (
			<div className={styles["empty-placeholder"]}>
				Complete your first route to see it here.
			</div>
		);
	}

	const cards = finishedUserRoutes.map((route) => {
		return <DashboardRouteCard key={route.id} route={route} />;
	});

	return <div className={styles["cards-wrapper"]}>{cards}</div>;
};

export { UserHistory };
