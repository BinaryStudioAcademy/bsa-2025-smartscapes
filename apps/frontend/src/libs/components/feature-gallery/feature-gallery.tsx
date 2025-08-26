import { Fragment } from "react";

import { type Slide } from "~/libs/types/types.js";

import { Icon } from "../components.js";
import styles from "./styles.module.css";

type Properties = {
	slides: Slide[];
};

const FeatureGallery = ({ slides }: Properties): React.JSX.Element => {
	if (slides.length === 0) {
		return <></>;
	}

	const [firstSlide, ...otherSlides] = slides;

	const renderSlide = (slide: Slide): React.ReactElement => {
		return (
			<div className={styles["slide-wrapper"]}>
				{slide.content}
				{slide.onDelete && (
					<button
						className={styles["delete-icon-wrapper"]}
						onClick={slide.onDelete}
					>
						<Icon height={18} name="trash" width={16} />
					</button>
				)}
			</div>
		);
	};

	return (
		<section className={styles["container"]}>
			<div className={styles["left"]}>
				{firstSlide && renderSlide(firstSlide)}
			</div>
			<div className={styles["right"]}>
				{otherSlides.map((slide, index) => (
					<Fragment key={index}>{renderSlide(slide)}</Fragment>
				))}
			</div>
		</section>
	);
};

export { FeatureGallery };
