import { combineClassNames, getUserInitials } from "~/libs/helpers/helpers.js";
import { type UserAuthResponseDto } from "~/modules/users/users.js";

import styles from "./styles.module.css";

const DEFAULT_AVATAR_SIZE = 32;

type Properties = {
	size?: number;
	user: UserAuthResponseDto;
	variant?: "primary" | "secondary";
};

const Avatar = ({
	size = DEFAULT_AVATAR_SIZE,
	user,
	variant = "primary",
}: Properties): React.JSX.Element => {
	const { avatarUrl, firstName, lastName } = user;
	const hasAvatar = Boolean(avatarUrl);

	return (
		<div
			className={styles["avatar"]}
			style={{ "--avatar-size": `${String(size)}px` } as React.CSSProperties}
		>
			{hasAvatar ? (
				<img
					alt="User Avatar"
					className={styles["avatar-image"]}
					src={avatarUrl as string}
				/>
			) : (
				<span
					className={combineClassNames(
						styles["fallback"],
						styles[`fallback-${variant}`],
					)}
				>
					{getUserInitials(firstName, lastName)}
				</span>
			)}
		</div>
	);
};

export { Avatar };
