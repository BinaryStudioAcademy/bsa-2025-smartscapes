import { Model } from "objection";

import { DatabaseTableName } from "~/libs/modules/database/database.js";
import { type LineStringGeometry } from "~/libs/types/types.js";

class PlannedPathModel extends Model {
	public static override get tableName(): string {
		return DatabaseTableName.PLANNED_PATHS;
	}

	public distance!: number;
	public duration!: number;
	public geometry!: LineStringGeometry;
	public id!: number;
}

export { PlannedPathModel };
