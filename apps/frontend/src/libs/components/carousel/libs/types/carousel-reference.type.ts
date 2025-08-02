type CarouselReference = {
	element: React.RefObject<HTMLDivElement | null>;
	isDragging: React.RefObject<boolean>;
	momentumID: React.RefObject<null | number>;
	scrollStart: React.RefObject<number>;
	startX: React.RefObject<number>;
	velocity: React.RefObject<number>;
};

export { type CarouselReference };
