import { useRef } from "~/libs/hooks/hooks.js";

import { type CarouselReference } from "../types/types.js";

const useCarouselReference = (): CarouselReference => {
	const element = useRef<HTMLDivElement>(null);
	const velocity = useRef(0);
	const momentumID = useRef<null | number>(null);

	return {
		element,
		momentumID,
		velocity,
	};
};

export { useCarouselReference };
