import { Avatar, Button, Loader } from "~/libs/components/components.js";
import { DataStatus } from "~/libs/enums/enums.js";
import {
	useAppDispatch,
	useAppSelector,
	useCallback,
	useRef,
} from "~/libs/hooks/hooks.js";
import { actions as authActions } from "~/modules/auth/auth.js";
import {
	type AuthenticatedUserPatchRequestDto,
	type UserAuthResponseDto,
} from "~/modules/users/users.js";

import { ProfileForm } from "./libs/components/components.js";
import styles from "./styles.module.css";

const UserDetails = (): null | React.JSX.Element => {
	const dispatch = useAppDispatch();
	const authenticatedUser = useAppSelector(
		({ auth }) => auth.authenticatedUser,
	) as UserAuthResponseDto;

	const fileInputReference = useRef<HTMLInputElement>(null);

	const isLoading = useAppSelector(
		(state) => state.auth.authenticatedUserPatchStatus === DataStatus.PENDING,
	);

	const handleFormSubmit = useCallback(
		(payload: AuthenticatedUserPatchRequestDto): void => {
			void dispatch(authActions.patchAuthenticatedUser(payload));
		},
		[dispatch],
	);

	const handleFileUpload = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const file = event.target.files?.[0];

			if (!file) {
				return;
			}

			void dispatch(authActions.uploadAvatar(file));
		},
		[dispatch],
	);

	const handleTriggerFileUpload = useCallback(() => {
		fileInputReference.current?.click();
	}, []);

	if (isLoading) {
		return (
			<span className={styles["loader-container"]}>
				<Loader />
			</span>
		);
	}

	return (
		<div className={styles["user-details-container"]}>
			<div className={styles["user-details-avatar"]}>
				<Avatar size={128} user={authenticatedUser} variant="large" />
				<div className={styles["user-upload-buttons"]}>
					<Button
						label="Upload avatar"
						onClick={handleTriggerFileUpload}
						variant="outlined"
					/>
					<Button label="Delete avatar" variant="outlined-danger" />
					<input
						accept="image/*"
						onChange={handleFileUpload}
						ref={fileInputReference}
						style={{ display: "none" }}
						type="file"
					/>
				</div>
			</div>
			<ProfileForm onSubmit={handleFormSubmit} user={authenticatedUser} />
		</div>
	);
};

export { UserDetails };
