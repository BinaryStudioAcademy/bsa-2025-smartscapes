import { type JSX } from "react";

import appLogo from "~/assets/images/logo.svg";
import { AppRoute } from "~/libs/enums/enums.js";
import { type ValueOf } from "~/libs/types/types.js";
import { type UserAuthResponseDto } from "~/modules/users/libs/types/types.js";

import { Button, Link } from "../components.js";
import { AuthenticatedHeader } from "./libs/components/authenticated-header/authenticated-header.js";
import styles from "./styles.module.css";

type Properties = {
	actions: {
		label: string;
		to: ValueOf<typeof AppRoute>;
	}[];
	user: null | UserAuthResponseDto;
};

const Header = ({ actions, user }: Properties): JSX.Element => {
	const renderHeaderContent = (): JSX.Element => {
		if (user) {
			return <AuthenticatedHeader user={user} />;
		}

		return (
			<div className={styles["buttons"]}>
				{actions.map(({ label, to }) => (
					<Button key={to} label={label} to={to} type="button" />
				))}
			</div>
		);
	};

	return (
		<header className={styles["header"]}>
			<Link to={AppRoute.ROOT}>
				<img
					alt="SmartScapes Logo"
					className={styles["header-logo"]}
					height={24}
					src={appLogo}
					width={136}
				/>
			</Link>
			{renderHeaderContent()}
		</header>
	);
};

export { Header };
