import { Button, Input, Link } from "~/libs/components/components.js";
import { AppRoute } from "~/libs/enums/enums.js";
import { useAppForm } from "~/libs/hooks/hooks.js";
import {
	type UserSignInRequestDto,
	userSignInValidationSchema,
} from "~/modules/users/users.js";

import { DEFAULT_SIGN_IN_PAYLOAD } from "./libs/constants/constants.js";
import styles from "./styles.module.css";

type Properties = {
	onSubmit: (payload: UserSignInRequestDto) => void;
};

const SignInForm = ({ onSubmit }: Properties): React.JSX.Element => {
	const { control, errors, handleSubmit } = useAppForm<UserSignInRequestDto>({
		defaultValues: DEFAULT_SIGN_IN_PAYLOAD,
		validationSchema: userSignInValidationSchema,
	});

	return (
		<div className={styles["container"]}>
			<h1 className={styles["form-title"]}>Log In</h1>
			<form className={styles["form"]} onSubmit={handleSubmit(onSubmit)}>
				<Input
					autocomplete="email"
					control={control}
					errors={errors}
					label="Email"
					name="email"
					type="email"
				/>
				<Input
					autocomplete="current-password"
					control={control}
					errors={errors}
					label="Password"
					name="password"
					type="password"
				/>
				<Button label="Log In" type="submit" />
			</form>

			<div className={styles["sign-up-link-container"]}>
				<p className={styles["sign-up-link-text"]}>
					Do not have an account? <Link to={AppRoute.SIGN_UP}>Sign up</Link>
				</p>
			</div>
		</div>
	);
};

export { SignInForm };
