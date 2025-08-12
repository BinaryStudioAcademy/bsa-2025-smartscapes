import { type Entity } from "~/libs/types/types.js";

import { type FileContentType } from "./libs/types/types.js";

class FilesEntity implements Entity {
	private contentType: FileContentType;
	private id: null | number;
	private url: string;

	private constructor({
		contentType,
		id,
		url,
	}: {
		contentType: FileContentType;
		id: null | number;
		url: string;
	}) {
		this.contentType = contentType;
		this.id = id;
		this.url = url;
	}

	public static initialize(data: {
		contentType: FileContentType;
		createdAt: string;
		id: number;
		updatedAt: string;
		url: string;
	}): FilesEntity {
		return new FilesEntity({
			contentType: data.contentType,
			id: data.id,
			url: data.url,
		});
	}

	public static initializeNew({
		contentType,
		url,
	}: {
		contentType: FileContentType;
		url: string;
	}): FilesEntity {
		return new FilesEntity({
			contentType,
			id: null,
			url,
		});
	}

	public toNewObject(): {
		contentType: FileContentType;
		url: string;
	} {
		return {
			contentType: this.contentType,
			url: this.url,
		};
	}

	public toObject(): {
		contentType: FileContentType;
		id: number;
		url: string;
	} {
		return {
			contentType: this.contentType,
			id: this.id as number,
			url: this.url,
		};
	}
}

export { FilesEntity };
