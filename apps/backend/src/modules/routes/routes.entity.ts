import { type Entity } from "~/libs/types/types.js";

class RoutesEntity implements Entity {
	private description: string;
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
		description: string;
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
	}): RoutesEntity {
		return new RoutesEntity({
			description: data.description,
			id: data.id,
			name: data.name,
			pois: data.pois,
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
	}): RoutesEntity {
		return new RoutesEntity({
			description,
			id: null,
			name,
			pois,
		});
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
			description: this.description,
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
			description: this.description,
			id: this.id as number,
			name: this.name,
			pois: this.pois,
		};
	}
}

export { RoutesEntity };
