import { useRef } from "~/libs/hooks/hooks.js";

import { type CarouselReference } from "../types/types.js";

const useCarouselReference = (): CarouselReference => {
	const element = useRef<HTMLDivElement>(null);
	const isDragging = useRef(false);
	const startX = useRef(0);
	const scrollStart = useRef(0);
	const velocity = useRef(0);
	const momentumID = useRef<null | number>(null);

	return {
		element,
		isDragging,
		momentumID,
		scrollStart,
		startX,
		velocity,
	};
};

export { useCarouselReference };
