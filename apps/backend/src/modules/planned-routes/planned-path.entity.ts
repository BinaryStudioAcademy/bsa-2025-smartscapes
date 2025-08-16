import { type Entity, type LineStringGeometry } from "~/libs/types/types.js";

class PlannedPathEntity implements Entity {
	private distance: number;
	private duration: number;
	private geometry: LineStringGeometry;
	private id: null | number;

	private constructor({
		distance,
		duration,
		geometry,
		id,
	}: {
		distance: number;
		duration: number;
		geometry: LineStringGeometry;
		id: null | number;
	}) {
		this.id = id;
		this.distance = distance;
		this.duration = duration;
		this.geometry = geometry;
	}

	public static initialize(data: {
		distance: number;
		duration: number;
		geometry: LineStringGeometry;
		id: number;
	}): PlannedPathEntity {
		return new PlannedPathEntity({
			distance: data.distance,
			duration: data.duration,
			geometry: data.geometry,
			id: data.id,
		});
	}

	public static initializeNew({
		distance,
		duration,
		geometry,
	}: {
		distance: number;
		duration: number;
		geometry: LineStringGeometry;
	}): PlannedPathEntity {
		return new PlannedPathEntity({
			distance,
			duration,
			geometry,
			id: null,
		});
	}

	public toNewObject(): {
		distance: number;
		duration: number;
		geometry: LineStringGeometry;
	} {
		return {
			distance: this.distance,
			duration: this.duration,
			geometry: this.geometry,
		};
	}

	public toObject(): {
		distance: number;
		duration: number;
		geometry: LineStringGeometry;
		id: number;
	} {
		return {
			distance: this.distance,
			duration: this.duration,
			geometry: this.geometry,
			id: this.id as number,
		};
	}
}

export { PlannedPathEntity };
