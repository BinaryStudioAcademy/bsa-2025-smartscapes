import { useCallback } from "~/libs/hooks/hooks.js";

import { CAROUSEL_CONFIG } from "../constants/constants.js";
import { type CarouselReference } from "../types/types.js";

type CarouselWheelEventProperties = {
	carouselReference: CarouselReference;
	startMomentum: () => void;
};

const useCarouselWheelEvent = ({
	carouselReference,
	startMomentum,
}: CarouselWheelEventProperties): ((event: WheelEvent) => void) => {
	return useCallback(
		(event: WheelEvent): void => {
			event.preventDefault();

			if (carouselReference.element.current) {
				carouselReference.velocity.current +=
					event.deltaY * CAROUSEL_CONFIG.WHEEL_MULTIPLIER;

				if (!carouselReference.momentumID.current) {
					startMomentum();
				}
			}
		},
		[startMomentum, carouselReference],
	);
};

export { useCarouselWheelEvent };
