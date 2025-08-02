import { useEffect } from "~/libs/hooks/hooks.js";

import { type CarouselReference } from "../types/types.js";
import {
	useCarouselMomentum,
	useCarouselMouseEvents,
	useCarouselWheelEvent,
} from "./hooks.js";

type CarouselEvents = {
	handleMouseDown: (event: React.MouseEvent) => void;
	handleMouseMove: (event: React.MouseEvent) => void;
	handleMouseUpOrLeave: () => void;
	handleWheelEvent: (event: WheelEvent) => void;
};

type CarouselEventsProperties = {
	carouselReference: CarouselReference;
	setDragging: (dragging: boolean) => void;
};

const useCarouselEvents = ({
	carouselReference,
	setDragging,
}: CarouselEventsProperties): CarouselEvents => {
	const { startMomentum } = useCarouselMomentum({
		carouselReference,
	});

	const mouseHandlers = useCarouselMouseEvents({
		carouselReference,
		setDragging,
		startMomentum,
	});

	const handleWheelEvent = useCarouselWheelEvent({
		carouselReference,
		startMomentum,
	});

	useEffect(() => {
		const element = carouselReference.element.current;

		if (element) {
			element.addEventListener("wheel", handleWheelEvent, { passive: false });

			return (): void => {
				element.removeEventListener("wheel", handleWheelEvent);
			};
		}
	}, [handleWheelEvent, carouselReference.element]);

	return {
		...mouseHandlers,
		handleWheelEvent,
	};
};

export { useCarouselEvents };
