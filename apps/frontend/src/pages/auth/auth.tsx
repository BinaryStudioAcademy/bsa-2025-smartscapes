import { AppRoute } from "~/libs/enums/enums.js";
import {
	useAppDispatch,
	useAppSelector,
	useCallback,
	useLocation,
} from "~/libs/hooks/hooks.js";
import { actions as authActions } from "~/modules/auth/auth.js";
import { type UserSignUpRequestDto } from "~/modules/users/users.js";

import { SignInForm, SignUpForm } from "./libs/components/components.js";
import styles from "./styles.module.css";

const Auth = (): React.JSX.Element => {
	const dispatch = useAppDispatch();
	const { dataStatus } = useAppSelector(({ auth }) => ({
		dataStatus: auth.dataStatus,
	}));
	const { pathname } = useLocation();

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

	return (
		<main className={styles["container"]}>
			<p>State: {dataStatus}</p>
			{handleFormRender(pathname)}
		</main>
	);
};

export { Auth };
