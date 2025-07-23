import reactLogo from "~/assets/images/react.svg";
import {
	Button,
	Link,
	Loader,
	RouterOutlet,
	Sidebar,
} from "~/libs/components/components.js";
import { AppRoute } from "~/libs/enums/enums.js";
import {
	useAppDispatch,
	useAppSelector,
	useEffect,
	useLocation,
} from "~/libs/hooks/hooks.js";
import { type NavigationItem } from "~/libs/types/types.js";
import { actions as userActions } from "~/modules/users/users.js";

import styles from "./styles.module.css";

const App = (): React.JSX.Element => {
	const { pathname } = useLocation();
	const dispatch = useAppDispatch();
	const dataStatus = useAppSelector(({ users }) => users.dataStatus);
	const users = useAppSelector(({ users }) => users.data);

	const isRoot = pathname === AppRoute.ROOT;

	const navigationItems: NavigationItem[] = [
		{
			href: AppRoute.ROOT,
			icon: "dashboard",
			label: "Dashboard",
		},
		{
			href: AppRoute.SIGN_UP,
			icon: "list",
			label: "Sign Up",
		},
	];

	useEffect(() => {
		if (isRoot) {
			void dispatch(userActions.loadAll());
		}
	}, [isRoot, dispatch]);

	return (
		<div className={styles["container"]}>
			<Sidebar navigationItems={navigationItems} />
			<img alt="logo" className="App-logo" src={reactLogo} width="30" />
			<ul className="App-navigation-list">
				<li>
					<Link to={AppRoute.ROOT}>Root</Link>
				</li>
				<li>
					<Link to={AppRoute.SIGN_IN}>Sign in</Link>
				</li>
				<li>
					<Link to={AppRoute.SIGN_UP}>Sign up</Link>
				</li>
			</ul>
			<p>Current path: {pathname}</p>

			<div>
				<RouterOutlet />
			</div>
			{isRoot && (
				<>
					<p>State: {dataStatus}</p>
					<Loader />
					<h3>Users:</h3>
					<ul>
						{users.map((user) => (
							<li key={user.id}>{user.email}</li>
						))}
					</ul>
					<Button label="Button for test" type="button" />
				</>
			)}
		</div>
	);
};

export { App };
