import { useCallback } from "~/libs/hooks/hooks.js";

import {
	useCarouselMomentum,
	useCarouselReference,
	useCarouselWheelEvent,
	useMouseLeave,
} from "./libs/hooks/hooks.js";
import styles from "./style.module.css";

type Properties = {
	images: string[];
};

const Carousel = ({ images }: Properties): React.JSX.Element => {
	const carouselReference = useCarouselReference();
	const { startMomentum } = useCarouselMomentum(carouselReference);
	const { handleMouseLeave } = useMouseLeave(carouselReference, startMomentum);

	useCarouselWheelEvent(carouselReference, startMomentum);

	const handleMouseEnter = useCallback((): void => {
		if (carouselReference.element.current) {
			carouselReference.element.current.style.scrollbarColor = "unset";
		}
	}, [carouselReference.element]);

	return (
		<div className={styles["carousel-container"]}>
			<div
				className={styles["carousel"]}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
				ref={carouselReference.element}
				role="tablist"
				tabIndex={0}
			>
				{images.map((image) => (
					<div className={styles["carousel-item"]} key={image}>
						<img
							alt="carousel"
							className={styles["carousel-image"]}
							draggable={false}
							src={image}
						/>
					</div>
				))}
			</div>
		</div>
	);
};

export { Carousel };
