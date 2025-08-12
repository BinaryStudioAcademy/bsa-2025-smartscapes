import styles from "./styles.module.css";

const HeroSection = (): React.JSX.Element => {
	return (
		<section className={styles["section"]}>
			<div>
				<h1 className={styles["section-title"]}>
					Discover Your Next Adventure
				</h1>

				<p className={styles["section-description"]}>
					Find the best trails for hiking, biking, and exploring the outdoors
					wherever you are.
				</p>
			</div>

			<div className={styles["section-cover"]} />
		</section>
	);
};

export { HeroSection };
