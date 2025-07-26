import styles from "./styles.module.css";

type Properties = {
	imageUrl: null | string;
	name: string;
};

const RouteCard = ({ imageUrl, name }: Properties): React.JSX.Element => {
	return (
		<li className={styles["route-card"]}>
			{imageUrl ? (
				<img alt={name} className={styles["image"]} src={imageUrl} />
			) : (
				<div className={styles["image-placeholder"]} />
			)}
			<div className={styles["data"]}>
				<p className={styles["label"]}>{name}</p>
			</div>
		</li>
	);
};

export { RouteCard };
