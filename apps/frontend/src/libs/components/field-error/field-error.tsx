import errorIcon from "~/assets/images/error.svg";

import styles from "./styles.module.css";

type Properties = {
	description: string;
};

const FieldError = ({ description }: Properties): React.JSX.Element => {
	return (
		<span className={styles["error"]}>
			<img alt="error-icon" src={errorIcon} />
			{description}
		</span>
	);
};

export { FieldError };
