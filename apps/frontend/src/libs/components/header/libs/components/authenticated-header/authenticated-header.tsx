import { type JSX } from "react";

import { Avatar, Dropdown, Icon } from "~/libs/components/components.js";
import { AppRoute } from "~/libs/enums/enums.js";
import { combineClassNames } from "~/libs/helpers/helpers.js";
import {
	useAppDispatch,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "~/libs/hooks/hooks.js";
import { type DropdownItem } from "~/libs/types/types.js";
import { actions as authActions } from "~/modules/auth/auth.js";
import { type UserAuthResponseDto } from "~/modules/users/libs/types/types.js";

import { NotificationsPopover } from "./libs/components/components.js";
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

	const items: DropdownItem[] = useMemo(() => {
		return [
			{
				icon: "user",
				label: "Profile",
				to: AppRoute.PROFILE,
			},
			{
				icon: "logout",
				label: "Log out",
				onClick: handleLogout,
			},
		];
	}, [handleLogout]);

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
			<NotificationsPopover />

			<button className={styles["user-info"]} onClick={handleUserClick}>
				<Avatar user={user} />
				<span className={styles["name"]}>
					{user.firstName} {user.lastName}
				</span>
				<span className={styles["arrow-down"]}>
					<Icon height={16} name="arrowDown" width={16} />
				</span>
			</button>

			<div
				className={combineClassNames(
					styles["dropdown-container"],
					isDropdownOpen && styles["dropdown-container-open"],
				)}
			>
				<Dropdown items={items} />
			</div>
		</div>
	);
};

export { AuthenticatedHeader };
