import styles from "./styles.module.css";

const HeroSection = (): React.JSX.Element => {
	return (
		<section className={styles["hero-section"]}>
			<div>
				<h1 className={styles["hero-section-title"]}>
					Discover Your Next Adventure
				</h1>

				<p className={styles["hero-section-description"]}>
					Find the best trails for hiking, biking, and exploring the outdoors
					wherever you are.
				</p>
			</div>

			<div className={styles["hero-section-cover"]}>
				<img
					alt="Landing - forest view"
					src="/assets/images/landing-cover.jpg"
				/>
			</div>
		</section>
	);
};

export { HeroSection };
