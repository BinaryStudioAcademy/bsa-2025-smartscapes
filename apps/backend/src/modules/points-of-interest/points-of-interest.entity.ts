import { type Entity } from "~/libs/types/types.js";

import { type PointsOfInterestLocation } from "./libs/types/type.js";

class PointsOfInterestEntity implements Entity {
	private id: null | number;
	private location: PointsOfInterestLocation;
	private name: string;

	private constructor({
		id,
		location,
		name,
	}: {
		id: null | number;
		location: PointsOfInterestLocation;
		name: string;
	}) {
		this.id = id;
		this.location = location;
		this.name = name;
	}

	public static initialize(data: {
		createdAt: string;
		id: number;
		location: PointsOfInterestLocation;
		name: string;
		updatedAt: string;
	}): PointsOfInterestEntity {
		return new PointsOfInterestEntity({
			id: data.id,
			location: data.location,
			name: data.name,
		});
	}

	public static initializeNew({
		location,
		name,
	}: {
		location: PointsOfInterestLocation;
		name: string;
	}): PointsOfInterestEntity {
		return new PointsOfInterestEntity({
			id: null,
			location,
			name,
		});
	}

	public toNewObject(): {
		location: PointsOfInterestLocation;
		name: string;
	} {
		return {
			location: this.location,
			name: this.name,
		};
	}

	public toObject(): {
		id: number;
		location: PointsOfInterestLocation;
		name: string;
	} {
		return {
			id: this.id as number,
			location: this.location,
			name: this.name,
		};
	}
}

export { PointsOfInterestEntity };
