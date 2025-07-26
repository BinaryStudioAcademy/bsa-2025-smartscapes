import smartScapesLogo from "~/assets/images/logo.svg";
import { NavLink } from "~/libs/components/components.js";
import { AppRoute } from "~/libs/enums/enums.js";
import { type NavigationItem } from "~/libs/types/types.js";

import { SidebarItem } from "./libs/components/components.js";
import styles from "./styles.module.css";

type Properties = {
	navigationItems: NavigationItem[];
};

const Sidebar = ({ navigationItems }: Properties): React.JSX.Element => {
	return (
		<div className={styles["sidebar"]}>
			<NavLink className={styles["logo-link"] as string} to={AppRoute.ROOT}>
				<img alt="SmartScapes" height="24" src={smartScapesLogo} width="136" />
			</NavLink>
			<ul className={styles["navigation-list"]}>
				{navigationItems.map((item) => (
					<SidebarItem
						href={item.href}
						icon={item.icon}
						key={item.icon}
						label={item.label}
					/>
				))}
			</ul>
		</div>
	);
};

export { Sidebar };
