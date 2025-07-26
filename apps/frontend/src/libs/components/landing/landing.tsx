import { HeroSection } from "./libs/components/hero-section/hero-section.js";
import styles from "./styles.module.css";

const Landing = (): React.JSX.Element => {
	return (
		<main className={styles["landing"]}>
			<HeroSection />
		</main>
	);
};

export { Landing };
