import { type Entity } from "~/libs/types/types.js";

class PointsOfInterestEntity implements Entity {
	private id: null | number;
	private name: string;

	private constructor({ id, name }: { id: null | number; name: string }) {
		this.id = id;
		this.name = name;
	}

	public static initialize(data: {
		createdAt: string;
		id: number;
		name: string;
		updatedAt: string;
	}): PointsOfInterestEntity {
		return new PointsOfInterestEntity({
			id: data.id,
			name: data.name,
		});
	}

	public static initializeNew({
		name,
	}: {
		name: string;
	}): PointsOfInterestEntity {
		return new PointsOfInterestEntity({
			id: null,
			name,
		});
	}

	public toNewObject(): {
		name: string;
	} {
		return {
			name: this.name,
		};
	}

	public toObject(): {
		id: number;
		name: string;
	} {
		return {
			id: this.id as number,
			name: this.name,
		};
	}
}

export { PointsOfInterestEntity };
