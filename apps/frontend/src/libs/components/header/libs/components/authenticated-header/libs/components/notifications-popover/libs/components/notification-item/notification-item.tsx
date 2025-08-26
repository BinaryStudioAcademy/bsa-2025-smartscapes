import { Link } from "~/libs/components/components.js";
import { AppRoute } from "~/libs/enums/enums.js";
import { configureString, getRelativeTime } from "~/libs/helpers/helpers.js";

import styles from "./styles.module.css";

type Properties = {
	content: string;
	createdAt: string;
	entityId: number;
};

const NotificationItem = ({
	content,
	createdAt,
	entityId,
}: Properties): React.JSX.Element => {
	const userProfileLink = configureString(AppRoute.PUBLIC_PROFILE_$ID, {
		id: entityId.toString(),
	});
	const createdDate = new Date(createdAt);

	return (
		<li className={styles["notification"]}>
			<Link className={styles["link"]} to={userProfileLink}>
				<div className={styles["time"]}>{getRelativeTime(createdDate)}</div>
				<div className={styles["content"]}>{content}</div>
			</Link>
		</li>
	);
};

export { NotificationItem };
