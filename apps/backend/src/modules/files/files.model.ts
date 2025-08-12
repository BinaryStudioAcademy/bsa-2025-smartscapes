import {
	AbstractModel,
	DatabaseTableName,
} from "~/libs/modules/database/database.js";

import { type FileContentType } from "./libs/types/types.js";

class FilesModel extends AbstractModel {
	public static override get tableName(): string {
		return DatabaseTableName.FILES;
	}

	public contentType!: FileContentType;
	public url!: string;
}

export { FilesModel };
