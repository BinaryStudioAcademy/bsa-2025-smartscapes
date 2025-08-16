import { type Entity, type LineStringGeometry } from "~/libs/types/types.js";

class RouteEntity implements Entity {
	private description: null | string;
	private distance: number;
	private duration: number;
	private geometry: LineStringGeometry;
	private id: null | number;
	private name: string;
	private pois: {
		id: number;
		visitOrder: number;
	}[];
	private userId: number;

	private constructor({
		description,
		distance,
		duration,
		geometry,
		id,
		name,
		pois,
		userId,
	}: {
		description: null | string;
		distance: number;
		duration: number;
		geometry: LineStringGeometry;
		id: null | number;
		name: string;
		pois: {
			id: number;
			visitOrder: number;
		}[];
		userId: number;
	}) {
		this.id = id;
		this.distance = distance;
		this.duration = duration;
		this.geometry = geometry;
		this.name = name;
		this.description = description;
		this.pois = pois;
		this.userId = userId;
	}

	public static initialize(data: {
		description: string;
		distance: number;
		duration: number;
		geometry: LineStringGeometry;
		id: number;
		name: string;
		pois: {
			id: number;
			visitOrder: number;
		}[];
		userId: number;
	}): RouteEntity {
		return new RouteEntity({
			description: data.description,
			distance: data.distance,
			duration: data.duration,
			geometry: data.geometry,
			id: data.id,
			name: data.name,
			pois: data.pois,
			userId: data.userId,
		});
	}

	public static initializeList({
		distance,
		duration,
		geometry,
		id,
		name,
		pois,
		userId,
	}: {
		distance: number;
		duration: number;
		geometry: LineStringGeometry;
		id: number;
		name: string;
		pois: {
			id: number;
			visitOrder: number;
		}[];
		userId: number;
	}): RouteEntity {
		return new RouteEntity({
			description: null,
			distance,
			duration,
			geometry,
			id,
			name,
			pois,
			userId,
		});
	}

	public static initializeNew({
		description,
		distance,
		duration,
		geometry,
		name,
		pois,
		userId,
	}: {
		description: string;
		distance: number;
		duration: number;
		geometry: LineStringGeometry;
		name: string;
		pois: {
			id: number;
			visitOrder: number;
		}[];
		userId: number;
	}): RouteEntity {
		return new RouteEntity({
			description,
			distance,
			duration,
			geometry,
			id: null,
			name,
			pois,
			userId,
		});
	}

	public toListObject(): {
		distance: number;
		duration: number;
		geometry: LineStringGeometry;
		id: number;
		name: string;
		pois: {
			id: number;
			visitOrder: number;
		}[];
		userId: number;
	} {
		return {
			distance: this.distance,
			duration: this.duration,
			geometry: this.geometry,
			id: this.id as number,
			name: this.name,
			pois: this.pois,
			userId: this.userId,
		};
	}

	public toNewObject(): {
		description: string;
		distance: number;
		duration: number;
		geometry: LineStringGeometry;
		name: string;
		pois: {
			id: number;
			visitOrder: number;
		}[];
		userId: number;
	} {
		return {
			description: this.description as string,
			distance: this.distance,
			duration: this.duration,
			geometry: this.geometry,
			name: this.name,
			pois: this.pois,
			userId: this.userId,
		};
	}

	public toObject(): {
		description: string;
		distance: number;
		duration: number;
		geometry: LineStringGeometry;
		id: number;
		name: string;
		pois: {
			id: number;
			visitOrder: number;
		}[];
		userId: number;
	} {
		return {
			description: this.description as string,
			distance: this.distance,
			duration: this.duration,
			geometry: this.geometry,
			id: this.id as number,
			name: this.name,
			pois: this.pois,
			userId: this.userId,
		};
	}
}

export { RouteEntity };
