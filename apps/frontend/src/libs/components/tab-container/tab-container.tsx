import { combineClassNames } from "~/libs/helpers/helpers.js";
import { useMemo } from "~/libs/hooks/hooks.js";

import { type TabItem } from "./libs/types/types.js";
import styles from "./styles.module.css";

type Properties = {
	activeTabId: string;
	onTabChange: (tabId: string) => void;
	tabsData: TabItem[];
};

const TabContainer = ({
	activeTabId,
	onTabChange,
	tabsData,
}: Properties): React.JSX.Element => {
	const activeTabElement = useMemo(
		() => tabsData.find((tab) => tab.id === activeTabId)?.element,
		[activeTabId, tabsData],
	);

	const handleTabClick = (tabId: string): (() => void) => {
		return () => {
			onTabChange(tabId);
		};
	};

	return (
		<div
			className={combineClassNames(
				styles["tab-container"],
				activeTabId === tabsData[0]?.id && styles["first-tab-active"],
			)}
		>
			<nav className={styles["tab-navigation"]}>
				{tabsData.map((tab) => (
					<button
						className={combineClassNames(
							styles["tab-item"],
							activeTabId === tab.id && styles["active-tab-item"],
						)}
						key={tab.id}
						onClick={handleTabClick(tab.id)}
						type="button"
					>
						{tab.label}
					</button>
				))}
			</nav>
			<div className={styles["tab-content"]}>{activeTabElement}</div>
		</div>
	);
};

export { TabContainer };
export { type TabItem } from "./libs/types/types.js";
