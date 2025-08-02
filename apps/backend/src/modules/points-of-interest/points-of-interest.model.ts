import {
	AbstractModel,
	DatabaseTableName,
} from "~/libs/modules/database/database.js";

import { type PointsOfInterestLocation } from "./libs/types/type.js";

class PointsOfInterestModel extends AbstractModel {
	public static override get tableName(): string {
		return DatabaseTableName.POINTS_OF_INTEREST;
	}

	public location!: PointsOfInterestLocation;
	public name!: string;
}

export { PointsOfInterestModel };
