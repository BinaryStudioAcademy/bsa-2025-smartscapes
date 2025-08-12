import { Loader, RouterOutlet } from "~/libs/components/components.js";
import { AppRoute } from "~/libs/enums/enums.js";
import {
	useAppDispatch,
	useAppSelector,
	useEffect,
	useLocation,
} from "~/libs/hooks/hooks.js";
import { actions as authActions } from "~/modules/auth/auth.js";
import { actions as userActions } from "~/modules/users/users.js";

import styles from "./styles.module.css";

const App = (): React.JSX.Element => {
	const { pathname } = useLocation();
	const dispatch = useAppDispatch();

	const isRoot = pathname === AppRoute.APP;

	useEffect(() => {
		if (isRoot) {
			void dispatch(userActions.loadAll());
		}
	}, [isRoot, dispatch]);

	useEffect(() => {
		void dispatch(authActions.getAuthenticatedUser());
	}, [dispatch]);

	const isInitialized = useAppSelector(({ auth }) => auth.isInitialized);

	if (!isInitialized) {
		return (
			<div className={styles["loader-container"]}>
				<Loader />
			</div>
		);
	}

	return (
		<div className={styles["container"]}>
			<div className={styles["outlet-container"]}>
				<RouterOutlet />
			</div>
		</div>
	);
};

export { App };
