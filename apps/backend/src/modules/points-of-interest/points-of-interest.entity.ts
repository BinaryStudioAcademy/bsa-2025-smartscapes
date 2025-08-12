import { type Entity, type PointGeometry } from "~/libs/types/types.js";

class PointsOfInterestEntity implements Entity {
	private id: null | number;
	private location: PointGeometry;
	private name: string;

	private constructor({
		id,
		location,
		name,
	}: {
		id: null | number;
		location: PointGeometry;
		name: string;
	}) {
		this.id = id;
		this.location = location;
		this.name = name;
	}

	public static initialize(data: {
		createdAt: string;
		id: number;
		location: PointGeometry;
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
		location: PointGeometry;
		name: string;
	}): PointsOfInterestEntity {
		return new PointsOfInterestEntity({
			id: null,
			location,
			name,
		});
	}

	public toNewObject(): {
		location: PointGeometry;
		name: string;
	} {
		return {
			location: this.location,
			name: this.name,
		};
	}

	public toObject(): {
		id: number;
		location: PointGeometry;
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
