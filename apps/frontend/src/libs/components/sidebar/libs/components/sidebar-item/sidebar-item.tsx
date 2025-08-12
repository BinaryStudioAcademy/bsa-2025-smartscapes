import { Icon, NavLink } from "~/libs/components/components.js";
import { combineClassNames } from "~/libs/helpers/helpers.js";
import { useCallback } from "~/libs/hooks/hooks.js";
import { type NavigationItem } from "~/libs/types/types.js";

import styles from "./styles.module.css";

const SidebarItem = ({
	href,
	icon,
	isLabelHidden,
	label,
}: NavigationItem): React.JSX.Element => {
	const linkClassName = useCallback(
		({ isActive }: { isActive: boolean }): string => {
			return combineClassNames(
				styles["link"],
				isActive && styles["link-active"],
			);
		},
		[],
	);

	return (
		<li className={styles["item"]}>
			<NavLink className={linkClassName} to={href}>
				<span className={styles["icon"]}>
					<Icon height={24} name={icon} width={24} />
				</span>
				<span
					className={combineClassNames(
						styles["label"],
						isLabelHidden && "visually-hidden",
					)}
				>
					{label}
				</span>
			</NavLink>
		</li>
	);
};

export { SidebarItem };
