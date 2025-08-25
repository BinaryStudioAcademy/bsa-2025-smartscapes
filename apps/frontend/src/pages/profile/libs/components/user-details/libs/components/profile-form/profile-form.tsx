import { Button, Checkbox, Input } from "~/libs/components/components.js";
import { useAppForm } from "~/libs/hooks/hooks.js";
import {
	type AuthenticatedUserPatchRequestDto,
	authenticatedUserPatchValidationSchema,
	type UserAuthResponseDto,
} from "~/modules/users/users.js";

import styles from "./styles.module.css";

type FormValues = AuthenticatedUserPatchRequestDto & { email: string };

type Properties = {
	onSubmit: (data: AuthenticatedUserPatchRequestDto) => void;
	user: UserAuthResponseDto;
};

const ProfileForm = ({ onSubmit, user }: Properties): React.JSX.Element => {
	const { email, firstName, isVisibleProfile, lastName } = user;

	const { control, errors, handleSubmit } = useAppForm<FormValues>({
		defaultValues: {
			email,
			firstName,
			isVisibleProfile,
			lastName,
		},
		mode: "onChange",
		validationSchema: authenticatedUserPatchValidationSchema,
	});

	return (
		<form className={styles["form"]} onSubmit={handleSubmit(onSubmit)}>
			<Input
				control={control}
				errors={errors}
				label="First Name"
				name="firstName"
				type="text"
			/>
			<Input
				control={control}
				errors={errors}
				label="Last Name"
				name="lastName"
				type="text"
			/>
			<Input
				control={control}
				errors={errors}
				isReadonly
				label="Email"
				name="email"
				type="text"
			/>
			<Checkbox
				control={control}
				errors={errors}
				label="Make profile visible"
				name="isVisibleProfile"
			/>
			<Button label="Update profile" />
		</form>
	);
};

export { ProfileForm };
