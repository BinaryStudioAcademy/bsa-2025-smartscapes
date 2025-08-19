import { Avatar, Loader } from "~/libs/components/components.js";
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
import { UploadButton } from "./libs/components/upload-button/upload-button.js";
import styles from "./styles.module.css";

const UserDetails = (): null | React.JSX.Element => {
	const dispatch = useAppDispatch();
	const { authenticatedUser } = useAppSelector((state) => state.auth) as {
		authenticatedUser: UserAuthResponseDto;
	};
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

	const handleButtonClick = useCallback(() => {
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
				<Avatar size={100} user={authenticatedUser} />
				<UploadButton
					color="green"
					label="Upload avatar"
					onClick={handleButtonClick}
				/>
				<UploadButton color="red" label="Delete avatar" />
				<input
					accept="image/*"
					onChange={handleFileUpload}
					ref={fileInputReference}
					style={{ display: "none" }}
					type="file"
				/>
			</div>
			<ProfileForm onSubmit={handleFormSubmit} user={authenticatedUser} />
		</div>
	);
};

export { UserDetails };
