import { type Repository } from "~/libs/types/types.js";

import { FileEntity } from "./files.entity.js";
import { type FileModel } from "./files.model.js";

const FILES_LIMIT = 10;

class FileRepository implements Repository {
	private fileModel: typeof FileModel;

	public constructor(fileModel: typeof FileModel) {
		this.fileModel = fileModel;
	}

	public async create(entity: FileEntity): Promise<FileEntity> {
		const { contentType, entityId, folder, url } = entity.toNewObject();

		const file = await this.fileModel
			.query()
			.insert({
				contentType,
				entityId,
				folder,
				url,
			})
			.returning(["id", "contentType", "url", "createdAt", "updatedAt"])
			.execute();

		return FileEntity.initialize(file);
	}

	public async delete(id: number): Promise<boolean> {
		const isDeleted = await this.fileModel.query().deleteById(id);

		return Boolean(isDeleted);
	}

	public async findAll(): Promise<FileEntity[]> {
		const files = await this.fileModel.query().select("*").limit(FILES_LIMIT);

		return files.map((file) => FileEntity.initialize(file));
	}

	public async findById(id: number): Promise<FileEntity | null> {
		const file = await this.fileModel
			.query()
			.select(
				"files.id",
				"files.url",
				"files.folder",
				"files.entityId",
				"files.contentType",
			)
			.where("id", id)
			.first();

		return file ? FileEntity.initialize(file) : null;
	}
}

export { FileRepository };
