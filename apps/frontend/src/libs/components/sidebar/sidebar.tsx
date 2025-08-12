import smartScapesLogo from "~/assets/images/logo.svg";
import { Link } from "~/libs/components/components.js";
import { AppRoute, KeyboardKey } from "~/libs/enums/enums.js";
import { combineClassNames } from "~/libs/helpers/helpers.js";
import { useCallback, useEffect, useState } from "~/libs/hooks/hooks.js";
import { type NavigationItemsGroup } from "~/libs/types/types.js";

import { SidebarItem } from "./libs/components/components.js";
import styles from "./styles.module.css";

type Properties = {
	navigationItemsGroups: NavigationItemsGroup[];
};

const Sidebar = ({ navigationItemsGroups }: Properties): React.JSX.Element => {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const handleClick = useCallback((): void => {
		setIsOpen((previous) => !previous);
	}, [setIsOpen]);

	const handleKeyDown = useCallback(
		(event: KeyboardEvent | React.KeyboardEvent) => {
			if (event.key === KeyboardKey.ESCAPE) {
				setIsOpen(false);
			}
		},
		[setIsOpen],
	);

	useEffect(() => {
		document.addEventListener("keydown", handleKeyDown);

		return (): void => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [setIsOpen, handleKeyDown]);

	return (
		<div className={styles["container"]}>
			<div className={styles["drawer"]} data-open={isOpen}>
				<div className={styles["header"]}>
					<button
						className={styles["close-button"]}
						data-open={isOpen}
						onClick={handleClick}
						type="button"
					>
						<span className={styles["burger-icon"]} />
					</button>

					<div className={isOpen ? "" : "visually-hidden"}>
						<Link to={AppRoute.ROOT}>
							<img
								alt="SmartScapes"
								className={styles["logo-image"]}
								height="24"
								src={smartScapesLogo}
								width="136"
							/>
						</Link>
					</div>
				</div>
				<div className={styles["sidebar"]}>
					{navigationItemsGroups.map(({ hasLabel, items, name }) => (
						<div
							className={combineClassNames(
								styles["group"],
								hasLabel && styles["shifted"],
							)}
							key={name}
						>
							{hasLabel && (
								<div
									className={combineClassNames(
										styles["title"],
										!isOpen && "visually-hidden",
									)}
								>
									<span className={styles["title-text"]}>{name}</span>
								</div>
							)}
							<ul className={styles["navigation-list"]}>
								{items.map((item) => (
									<SidebarItem
										href={item.href}
										icon={item.icon}
										isLabelHidden={!isOpen}
										key={item.icon}
										label={item.label}
									/>
								))}
							</ul>
						</div>
					))}
				</div>
			</div>
			{isOpen && (
				<div
					aria-hidden="true"
					className={styles["backdrop"]}
					onClick={handleClick}
				/>
			)}
		</div>
	);
};

export { Sidebar };
