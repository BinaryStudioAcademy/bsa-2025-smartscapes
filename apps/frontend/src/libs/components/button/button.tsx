import styles from "./styles.module.css";

type Properties = {
	label: string;
	onClick?: () => void;
	to?: string;
	type?: "button" | "submit";
};

const Button = ({
	label,
	onClick,
	to,
	type = "submit",
}: Properties): React.JSX.Element => {
	if (to) {
		return (
			<a className={styles["button"]} href={to}>
				{label}
			</a>
		);
	}

	return (
		<button className={styles["button"]} onClick={onClick} type={type}>
			{label}
		</button>
	);
};

export { Button };
