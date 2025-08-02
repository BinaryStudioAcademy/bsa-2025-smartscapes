import { useCallback } from "~/libs/hooks/hooks.js";

import { CAROUSEL_CONFIG } from "../constants/constants.js";
import { getCarouselParameters } from "../helpers/helpers.js";
import { type CarouselReference } from "../types/types.js";

type CarouselMomentumProperties = {
	carouselReference: CarouselReference;
};

const useCarouselMomentum = ({
	carouselReference,
}: CarouselMomentumProperties): {
	startMomentum: () => void;
} => {
	const animateMomentum = useCallback((): void => {
		const { element } = getCarouselParameters(carouselReference.element);

		if (!element) {
			return;
		}

		carouselReference.velocity.current *= CAROUSEL_CONFIG.FRICTION;

		const isVelocityLessThanMinVelocity =
			Math.abs(carouselReference.velocity.current) <
			CAROUSEL_CONFIG.MIN_VELOCITY;

		if (isVelocityLessThanMinVelocity) {
			carouselReference.velocity.current = 0;
			carouselReference.momentumID.current = null;

			return;
		}

		element.scrollLeft -=
			carouselReference.velocity.current * CAROUSEL_CONFIG.SCROLL_SPEED;

		carouselReference.momentumID.current =
			requestAnimationFrame(animateMomentum);
	}, [carouselReference]);

	const startMomentum = useCallback((): void => {
		if (carouselReference.momentumID.current) {
			cancelAnimationFrame(carouselReference.momentumID.current);
		}

		carouselReference.momentumID.current =
			requestAnimationFrame(animateMomentum);
	}, [animateMomentum, carouselReference]);

	return {
		startMomentum,
	};
};

export { useCarouselMomentum };
