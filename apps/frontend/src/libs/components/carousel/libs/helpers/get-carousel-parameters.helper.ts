import { type CarouselParameters } from "../types/types.js";

const INITIAL_CAROUSEL_PARAMETERS: CarouselParameters = {
	clientWidth: 0,
	element: null,
	maxScroll: 0,
	offsetLeft: 0,
	scrollLeft: 0,
	scrollWidth: 0,
};

const getCarouselParameters = (
	reference: React.RefObject<HTMLDivElement | null>,
): CarouselParameters => {
	if (!reference.current) {
		return INITIAL_CAROUSEL_PARAMETERS;
	}

	const element = reference.current;

	const maxScroll = element.scrollWidth - element.clientWidth;

	const { clientWidth, offsetLeft, scrollLeft, scrollWidth } =
		reference.current;

	return {
		clientWidth,
		element,
		maxScroll,
		offsetLeft,
		scrollLeft,
		scrollWidth,
	};
};

export { getCarouselParameters };
