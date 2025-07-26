import logo from "~/assets/images/logo.svg";
import { AppRoute, DataStatus } from "~/libs/enums/enums.js";
import {
	useAppDispatch,
	useAppSelector,
	useCallback,
	useEffect,
	useLocation,
	useNavigate,
} from "~/libs/hooks/hooks.js";
import { actions as authActions } from "~/modules/auth/auth.js";
import { type UserSignUpRequestDto } from "~/modules/users/users.js";

import { SignInForm, SignUpForm } from "./libs/components/components.js";
import styles from "./styles.module.css";

const Auth = (): React.JSX.Element => {
	const dispatch = useAppDispatch();
	const dataStatus = useAppSelector(({ auth }) => auth.dataStatus);
	const { pathname } = useLocation();
	const navigate = useNavigate();

	const handleSignInSubmit = useCallback((): void => {
		// TODO: handle sign in
	}, []);

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

	useEffect(() => {
		const redirect = async (): Promise<void> => {
			if (dataStatus === DataStatus.FULFILLED) {
				await navigate(AppRoute.ROOT);
			}
		};

		void redirect();
	}, [dataStatus, navigate]);

	return (
		<main className={styles["container"]}>
			<div className={styles["left-panel"]}>
				<div className={styles["logo"]}>
					<img alt="SmartScapes" height="24" src={logo} width="136" />
				</div>

				{handleFormRender(pathname)}
			</div>

			<div className={styles["right-panel"]} />
		</main>
	);
};

export { Auth };
