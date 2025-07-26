import {
	Icon,
	NavLink,
} from "~/libs/components/sidebar/libs/components/sidebar-item/index.js";
import { combineClassNames } from "~/libs/helpers/combine-class-names.helper.js";
import { useCallback } from "~/libs/hooks/hooks.js";
import { type NavigationItem } from "~/libs/types/types.js";

import styles from "./styles.module.css";

const SidebarItem = ({
	href,
	icon,
	label,
}: NavigationItem): React.JSX.Element => {
	const getSidebarClassName = useCallback(
		({ isActive }: { isActive: boolean }): string =>
			combineClassNames(styles["link"], isActive && styles["active"]),
		[],
	);

	return (
		<li>
			<NavLink className={getSidebarClassName} to={href}>
				<span className={styles["icon"]}>
					<Icon height={24} name={icon} width={24} />
				</span>
				<span className={styles["label"]}>{label}</span>
			</NavLink>
		</li>
	);
};

export { SidebarItem };
