import { type Entity } from "~/libs/types/types.js";

class RouteEntity implements Entity {
	private description: null | string;
	private id: null | number;
	private name: string;
	private pois: {
		id: number;
		visitOrder: number;
	}[];

	private constructor({
		description,
		id,
		name,
		pois,
	}: {
		description: null | string;
		id: null | number;
		name: string;
		pois: {
			id: number;
			visitOrder: number;
		}[];
	}) {
		this.id = id;
		this.name = name;
		this.description = description;
		this.pois = pois;
	}

	public static initialize(data: {
		description: string;
		id: number;
		name: string;
		pois: {
			id: number;
			visitOrder: number;
		}[];
	}): RouteEntity {
		return new RouteEntity({
			description: data.description,
			id: data.id,
			name: data.name,
			pois: data.pois,
		});
	}

	public static initializeList({
		id,
		name,
		pois,
	}: {
		id: number;
		name: string;
		pois: {
			id: number;
			visitOrder: number;
		}[];
	}): RouteEntity {
		return new RouteEntity({
			description: null,
			id,
			name,
			pois,
		});
	}

	public static initializeNew({
		description,
		name,
		pois,
	}: {
		description: string;
		name: string;
		pois: {
			id: number;
			visitOrder: number;
		}[];
	}): RouteEntity {
		return new RouteEntity({
			description,
			id: null,
			name,
			pois,
		});
	}

	public toListObject(): {
		id: number;
		name: string;
		pois: {
			id: number;
			visitOrder: number;
		}[];
	} {
		return {
			id: this.id as number,
			name: this.name,
			pois: this.pois,
		};
	}

	public toNewObject(): {
		description: string;
		name: string;
		pois: {
			id: number;
			visitOrder: number;
		}[];
	} {
		return {
			description: this.description as string,
			name: this.name,
			pois: this.pois,
		};
	}

	public toObject(): {
		description: string;
		id: number;
		name: string;
		pois: {
			id: number;
			visitOrder: number;
		}[];
	} {
		return {
			description: this.description as string,
			id: this.id as number,
			name: this.name,
			pois: this.pois,
		};
	}
}

export { RouteEntity };
