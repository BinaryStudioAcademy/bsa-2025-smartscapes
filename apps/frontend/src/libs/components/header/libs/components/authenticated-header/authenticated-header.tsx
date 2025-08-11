import { type JSX } from "react";

import { Avatar, Icon } from "~/libs/components/components.js";
import { combineClassNames } from "~/libs/helpers/helpers.js";
import {
	useAppDispatch,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "~/libs/hooks/hooks.js";
import { actions as authActions } from "~/modules/auth/auth.js";
import { type UserAuthResponseDto } from "~/modules/users/libs/types/types.js";

import { UserDropdown } from "../../../../user-dropdown/user-dropdown.js";
import styles from "./styles.module.css";

type Properties = {
	user: UserAuthResponseDto;
};

const AuthenticatedHeader = ({ user }: Properties): JSX.Element => {
	const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
	const dropdownReference = useRef<HTMLDivElement>(null);
	const dispatch = useAppDispatch();

	const handleUserClick = useCallback(() => {
		setIsDropdownOpen((previous) => !previous);
	}, []);

	const handleLogout = useCallback(() => {
		setIsDropdownOpen(false);
		void dispatch(authActions.logout());
	}, [dispatch]);

	const handleClickOutside = useCallback((event: MouseEvent) => {
		if (
			dropdownReference.current &&
			!dropdownReference.current.contains(event.target as Node)
		) {
			setIsDropdownOpen(false);
		}
	}, []);

	useEffect(() => {
		document.addEventListener("mousedown", handleClickOutside);

		return (): void => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [handleClickOutside]);

	return (
		<div className={styles["user-profile-wrapper"]} ref={dropdownReference}>
			<button className={styles["user-info"]} onClick={handleUserClick}>
				<Avatar user={user} />
				<div className={styles["name"]}>
					{user.firstName} {user.lastName}
				</div>
				<span
					className={combineClassNames(
						styles["arrow-down"],
						isDropdownOpen && styles["open"],
					)}
				>
					<Icon height={24} name="arrowDown" width={24} />
				</span>
			</button>

			<div
				className={combineClassNames(
					styles["dropdown-container"],
					!isDropdownOpen && styles["hidden"],
				)}
			>
				<UserDropdown onLogout={handleLogout} />
			</div>
		</div>
	);
};

export { AuthenticatedHeader };
