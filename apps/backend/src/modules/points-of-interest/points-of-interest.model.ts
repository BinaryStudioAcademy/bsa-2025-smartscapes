import {
	AbstractModel,
	DatabaseTableName,
} from "~/libs/modules/database/database.js";

class PointsOfInterestModel extends AbstractModel {
	public static override get tableName(): string {
		return DatabaseTableName.POINTS_OF_INTEREST;
	}

	public name!: string;
}

export { PointsOfInterestModel };
