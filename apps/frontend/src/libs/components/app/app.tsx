import reactLogo from "~/assets/images/react.svg";
import {
	Button,
	Header,
	Link,
	Loader,
	RouteCard,
	RouterOutlet,
} from "~/libs/components/components.js";
import { AppRoute } from "~/libs/enums/enums.js";
import {
	useAppDispatch,
	useAppSelector,
	useEffect,
	useLocation,
} from "~/libs/hooks/hooks.js";
import { actions as userActions } from "~/modules/users/users.js";

import styles from "./styles.module.css";

const App = (): React.JSX.Element => {
	const { pathname } = useLocation();
	const dispatch = useAppDispatch();
	const dataStatus = useAppSelector(({ users }) => users.dataStatus);
	const users = useAppSelector(({ users }) => users.data);
	const mockUserWithoutAvatar = {
		avatarUrl: null,
		firstName: "John",
		lastName: "Smith",
	};
	const isRoot = pathname === AppRoute.ROOT;

	useEffect(() => {
		if (isRoot) {
			void dispatch(userActions.loadAll());
		}
	}, [isRoot, dispatch]);

	return (
		<div className={styles["container"]}>
			<Header user={mockUserWithoutAvatar} />
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
					<section className={styles["popular-section"]}>
						<p className={styles["title"]}>Popular Routes</p>
						<ul className={styles["cards"]}>
							<RouteCard imageUrl={null} name="Kralovska obora" />
							<RouteCard imageUrl={null} name="Kralovska obora" />
							<RouteCard imageUrl={null} name="Kralovska obora" />
						</ul>
					</section>
				</>
			)}
		</div>
	);
};

export { App };
