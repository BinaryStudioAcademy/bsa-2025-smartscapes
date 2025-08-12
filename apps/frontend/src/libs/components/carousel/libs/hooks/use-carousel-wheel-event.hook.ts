import { EventListenerType } from "~/libs/enums/enums.js";
import { useCallback, useEffect } from "~/libs/hooks/hooks.js";

import { CAROUSEL_CONFIG } from "../constants/constants.js";
import { type CarouselReference } from "../types/types.js";

const useCarouselWheelEvent = (
	carouselReference: CarouselReference,
	startMomentum: () => void,
): void => {
	const handleWheelEvent = useCallback(
		(event: WheelEvent): void => {
			event.preventDefault();

			if (carouselReference.element.current) {
				carouselReference.velocity.current -=
					event.deltaY * CAROUSEL_CONFIG.WHEEL_MULTIPLIER;

				if (!carouselReference.momentumID.current) {
					startMomentum();
				}
			}
		},
		[startMomentum, carouselReference],
	);

	useEffect(() => {
		const element = carouselReference.element.current;

		if (element) {
			element.addEventListener(EventListenerType.WHEEL, handleWheelEvent, {
				passive: false,
			});

			return (): void => {
				element.removeEventListener(EventListenerType.WHEEL, handleWheelEvent);
			};
		}
	}, [handleWheelEvent, carouselReference.element]);
};

export { useCarouselWheelEvent };
