import { Button, Input, Link } from "~/libs/components/components.js";
import { AppRoute } from "~/libs/enums/enums.js";
import { useAppForm, useCallback } from "~/libs/hooks/hooks.js";
import {
	userSignUpFormValidationSchema,
	type UserSignUpRequestDto,
} from "~/modules/users/users.js";
import { type UserSignUpFormValues } from "~/pages/auth/libs/types/user-sign-up-form-values.types.js";

import { DEFAULT_SIGN_UP_PAYLOAD } from "./libs/constants/constants.js";
import styles from "./styles.module.css";

type Properties = {
	onSubmit: (payload: UserSignUpRequestDto) => void;
};

const SignUpForm = ({ onSubmit }: Properties): React.JSX.Element => {
	const { control, errors, handleSubmit } = useAppForm<UserSignUpFormValues>({
		defaultValues: DEFAULT_SIGN_UP_PAYLOAD,
		mode: "onChange",
		validationSchema: userSignUpFormValidationSchema,
	});

	const handleFormSubmit = useCallback(
		(event_: React.BaseSyntheticEvent): void => {
			void handleSubmit((formData: UserSignUpFormValues) => {
				const payload: UserSignUpRequestDto = {
					email: formData.email,
					firstName: formData.firstName,
					lastName: formData.lastName,
					password: formData.password,
				};
				onSubmit(payload);
			})(event_);
		},
		[handleSubmit, onSubmit],
	);

	return (
		<div className={styles["container"]}>
			<h1 className={styles["form-title"]}>Sign Up</h1>
			<form className={styles["form"]} onSubmit={handleFormSubmit}>
				<Input
					autocomplete="given-name"
					control={control}
					errors={errors}
					label="First Name"
					name="firstName"
					type="text"
				/>

				<Input
					autocomplete="family-name"
					control={control}
					errors={errors}
					label="Last Name"
					name="lastName"
					type="text"
				/>

				<Input
					autocomplete="email"
					control={control}
					errors={errors}
					label="Email"
					name="email"
					type="email"
				/>

				<Input
					autocomplete="new-password"
					control={control}
					errors={errors}
					label="Password"
					name="password"
					type="password"
				/>

				<Input
					autocomplete="new-password"
					control={control}
					errors={errors}
					label="Confirm password"
					name="confirmPassword"
					type="text"
				/>

				<Button label="Sign up" type="submit" />
			</form>

			<div>
				<p className={styles["login-link-text"]}>
					Already have an account?
					<Link to={AppRoute.SIGN_IN}>Log in</Link>
				</p>
			</div>
		</div>
	);
};

export { SignUpForm };
