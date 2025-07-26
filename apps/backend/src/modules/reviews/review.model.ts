import {
	AbstractModel,
	DatabaseTableName,
} from "~/libs/modules/database/database.js";

class ReviewModel extends AbstractModel {
	public static override get tableName(): string {
		return DatabaseTableName.REVIEWS;
	}

	public content!: string;
	public likesCount!: number;
	public poiId!: null | number;
	public routeId!: null | number;
	public userId!: number;
}

export { ReviewModel };
