import { useState } from "~/libs/hooks/hooks.js";

import {
	useCarouselEvents,
	useCarouselReference,
	useCarouselStyles,
} from "./libs/hooks/hooks.js";
import styles from "./style.module.css";

type Properties = {
	images: string[];
};

const Carousel = ({ images }: Properties): React.JSX.Element => {
	const [dragging, setDragging] = useState<boolean>(false);
	const carouselReference = useCarouselReference();

	const { handleMouseDown, handleMouseMove, handleMouseUpOrLeave } =
		useCarouselEvents({
			carouselReference,
			setDragging,
		});

	const { carouselClassName } = useCarouselStyles({
		dragging,
	});

	return (
		<div className={styles["carousel-container"]}>
			<div
				className={carouselClassName}
				onMouseDown={handleMouseDown}
				onMouseLeave={handleMouseUpOrLeave}
				onMouseMove={handleMouseMove}
				onMouseUp={handleMouseUpOrLeave}
				ref={carouselReference.element}
				role="tablist"
				tabIndex={0}
			>
				{images.map((image) => (
					<div className={styles["carousel-item"]} key={image}>
						<img alt="carousel" draggable={false} src={image} />
					</div>
				))}
			</div>
		</div>
	);
};

export { Carousel };
