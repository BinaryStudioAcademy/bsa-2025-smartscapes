import {
	AbstractModel,
	DatabaseTableName,
} from "~/libs/modules/database/database.js";
import { type PointGeometry } from "~/libs/types/types.js";

class PointsOfInterestModel extends AbstractModel {
	public static override get tableName(): string {
		return DatabaseTableName.POINTS_OF_INTEREST;
	}

	public location!: PointGeometry;
	public name!: string;
}

export { PointsOfInterestModel };
