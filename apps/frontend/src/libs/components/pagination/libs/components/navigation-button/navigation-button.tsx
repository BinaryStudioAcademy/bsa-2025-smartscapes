import styles from "./styles.module.css";

type Properties = {
	isDisabled?: boolean;
	label: string;
	onClick: () => void;
};

const NavigationButton = ({
	isDisabled = false,
	label,
	onClick,
}: Properties): React.JSX.Element => {
	return (
		<button
			className={styles["pagination-button"]}
			disabled={isDisabled}
			onClick={onClick}
		>
			{label}
		</button>
	);
};

export { NavigationButton };
