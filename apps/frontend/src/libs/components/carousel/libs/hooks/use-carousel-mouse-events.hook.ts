import { useCallback } from "~/libs/hooks/hooks.js";

import { CAROUSEL_CONFIG } from "../constants/constants.js";
import { getCarouselParameters } from "../helpers/helpers.js";
import { type CarouselReference } from "../types/types.js";

type CarouselMouseEvents = {
	handleMouseDown: (event: React.MouseEvent) => void;
	handleMouseMove: (event: React.MouseEvent) => void;
	handleMouseUpOrLeave: () => void;
};

type CarouselMouseEventsProperties = {
	carouselReference: CarouselReference;
	setDragging: (dragging: boolean) => void;
	startMomentum: () => void;
};

const useCarouselMouseEvents = ({
	carouselReference,
	setDragging,
	startMomentum,
}: CarouselMouseEventsProperties): CarouselMouseEvents => {
	const removeFocus = useCallback((): void => {
		const element = carouselReference.element.current;

		if (element) {
			element.blur();
		}
	}, [carouselReference.element]);

	const handleMouseDown = useCallback(
		(event: React.MouseEvent): void => {
			const { offsetLeft, scrollLeft } = getCarouselParameters(
				carouselReference.element,
			);

			carouselReference.isDragging.current = true;
			carouselReference.startX.current = event.pageX - offsetLeft;
			carouselReference.scrollStart.current = scrollLeft;
			setDragging(true);

			if (carouselReference.momentumID.current) {
				cancelAnimationFrame(carouselReference.momentumID.current);
				carouselReference.momentumID.current = null;
			}
		},
		[carouselReference, setDragging],
	);

	const handleMouseUpOrLeave = useCallback((): void => {
		carouselReference.isDragging.current = false;
		setDragging(false);

		removeFocus();

		if (Math.abs(carouselReference.velocity.current) > 0) {
			startMomentum();
		}
	}, [startMomentum, setDragging, carouselReference, removeFocus]);

	const handleMouseMove = useCallback(
		(event: React.MouseEvent): void => {
			const { element, offsetLeft } = getCarouselParameters(
				carouselReference.element,
			);

			if (!carouselReference.isDragging.current || !element) {
				return;
			}

			event.preventDefault();

			const x = event.pageX - offsetLeft;
			const walk = x - carouselReference.startX.current;
			const newScrollLeft = carouselReference.scrollStart.current - walk;

			element.scrollLeft = newScrollLeft;
			carouselReference.velocity.current =
				walk * CAROUSEL_CONFIG.DRAG_MULTIPLIER;
		},
		[carouselReference],
	);

	return {
		handleMouseDown,
		handleMouseMove,
		handleMouseUpOrLeave,
	};
};

export { useCarouselMouseEvents };
