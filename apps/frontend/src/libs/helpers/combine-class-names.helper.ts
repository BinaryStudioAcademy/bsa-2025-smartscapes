import { type ClassValue, clsx } from "clsx";

const combineClassNames = (...inputs: ClassValue[]): string => {
	return clsx(...inputs);
};

export { combineClassNames };
