import { combineClassNames } from "~/libs/helpers/helpers.js";

import styles from "../../style.module.css";

type CarouselStylesProperties = {
	dragging: boolean;
};

const useCarouselStyles = ({
	dragging,
}: CarouselStylesProperties): {
	carouselClassName: string;
} => {
	const carouselClassName = combineClassNames(
		styles["carousel"],
		dragging && styles["dragging"],
	);

	return {
		carouselClassName,
	};
};

export { useCarouselStyles };
