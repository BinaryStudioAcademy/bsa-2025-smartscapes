import { useCallback } from "react";

import { CAROUSEL_CONFIG } from "../constants/constants.js";
import {
	getCarouselParameters,
	snapToNearestItem,
} from "../helpers/helpers.js";
import { type CarouselReference } from "../types/types.js";

type CarouselMomentumProperties = {
	carouselReference: CarouselReference;
	handleBoundaryCollision: () => void;
};

const useCarouselMomentum = ({
	carouselReference,
	handleBoundaryCollision,
}: CarouselMomentumProperties): {
	startMomentum: () => void;
} => {
	const animateMomentum = useCallback((): void => {
		const { element, isAtLeftEdge, isAtRightEdge } = getCarouselParameters(
			carouselReference.element,
		);

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

			handleBoundaryCollision();

			snapToNearestItem(carouselReference, CAROUSEL_CONFIG.SNAP_DELAY);

			return;
		}

		element.scrollLeft -=
			carouselReference.velocity.current * CAROUSEL_CONFIG.SCROLL_SPEED;

		if (isAtLeftEdge || isAtRightEdge) {
			handleBoundaryCollision();
			carouselReference.velocity.current = 0;
			carouselReference.momentumID.current = null;

			return;
		}

		carouselReference.momentumID.current =
			requestAnimationFrame(animateMomentum);
	}, [handleBoundaryCollision, carouselReference]);

	const startMomentum = useCallback((): void => {
		if (carouselReference.momentumID.current) {
			cancelAnimationFrame(carouselReference.momentumID.current);
		}

		carouselReference.isAnimating.current = false;

		carouselReference.momentumID.current =
			requestAnimationFrame(animateMomentum);
	}, [animateMomentum, carouselReference]);

	return {
		startMomentum,
	};
};

export { useCarouselMomentum };
