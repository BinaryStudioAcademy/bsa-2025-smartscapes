import { Navigate } from "react-router";

import logo from "~/assets/images/logo.svg";
import { Link } from "~/libs/components/components.js";
import { AppRoute } from "~/libs/enums/enums.js";
import {
	useAppDispatch,
	useAppSelector,
	useCallback,
	useLocation,
} from "~/libs/hooks/hooks.js";
import { actions as authActions } from "~/modules/auth/auth.js";
import {
	type UserSignInRequestDto,
	type UserSignUpRequestDto,
} from "~/modules/users/users.js";

import { SignInForm, SignUpForm } from "./libs/components/components.js";
import styles from "./styles.module.css";

const Auth = (): React.JSX.Element => {
	const dispatch = useAppDispatch();
	const { pathname } = useLocation();

	const authenticatedUser = useAppSelector(
		({ auth }) => auth.authenticatedUser,
	);
	const hasUser = Boolean(authenticatedUser);

	const handleSignInSubmit = useCallback(
		(payload: UserSignInRequestDto): void => {
			void dispatch(authActions.signIn(payload));
		},
		[dispatch],
	);

	const handleSignUpSubmit = useCallback(
		(payload: UserSignUpRequestDto): void => {
			void dispatch(authActions.signUp(payload));
		},
		[dispatch],
	);

	const handleFormRender = useCallback(
		(route: string): null | React.JSX.Element => {
			switch (route) {
				case AppRoute.SIGN_IN: {
					return <SignInForm onSubmit={handleSignInSubmit} />;
				}

				case AppRoute.SIGN_UP: {
					return <SignUpForm onSubmit={handleSignUpSubmit} />;
				}
			}

			return null;
		},
		[handleSignInSubmit, handleSignUpSubmit],
	);

	if (hasUser) {
		return <Navigate to={AppRoute.APP} />;
	}

	return (
		<main className={styles["container"]}>
			<div className={styles["left-panel"]}>
				<div className={styles["logo"]}>
					<Link to={AppRoute.ROOT}>
						<img
							alt="SmartScapes"
							className={styles["auth-logo"]}
							height="24"
							src={logo}
							width="136"
						/>
					</Link>
				</div>

				{handleFormRender(pathname)}
			</div>

			<div className={styles["right-panel"]} />
		</main>
	);
};

export { Auth };
