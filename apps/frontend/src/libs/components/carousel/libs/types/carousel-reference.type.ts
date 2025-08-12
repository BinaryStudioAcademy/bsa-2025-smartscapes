type CarouselReference = {
	element: React.RefObject<HTMLDivElement | null>;
	momentumID: React.RefObject<null | number>;
	velocity: React.RefObject<number>;
};

export { type CarouselReference };
