import { type MultipartFile } from "@fastify/multipart";

import { ContentType } from "~/libs/enums/enums.js";
import { type AWSFileService } from "~/libs/modules/aws/aws.js";
import { HTTPCode } from "~/libs/modules/http/http.js";
import { type Service, type ValueOf } from "~/libs/types/types.js";

import { FileEntity } from "./files.entity.js";
import { type FileRepository } from "./files.repository.js";
import {
	FileExceptionMessage,
	type FileFolderName,
} from "./libs/enums/enums.js";
import { FilesError } from "./libs/exeptions/exeptions.js";
import {
	type FileMimeType,
	type FileUploadResponseDto,
} from "./libs/types/types.js";

class FileService implements Service {
	private awsFileService: AWSFileService;

	private fileRepository: FileRepository;

	public constructor(
		fileRepository: FileRepository,
		awsFileService: AWSFileService,
	) {
		this.fileRepository = fileRepository;
		this.awsFileService = awsFileService;
	}

	public async create(payload: {
		contentType: FileMimeType;
		entityId: number;
		folder: ValueOf<typeof FileFolderName>;
		url: string;
	}): Promise<FileUploadResponseDto> {
		const { contentType, entityId, folder, url } = payload;

		const item = await this.fileRepository.create(
			FileEntity.initializeNew({
				contentType,
				entityId,
				folder,
				url,
			}),
		);

		return item.toObject();
	}

	public async delete(id: number): Promise<boolean> {
		const isDeleted = this.fileRepository.delete(id);

		return await isDeleted;
	}

	public async deleteFile(payload: { id: number }): Promise<boolean> {
		const { id } = payload;

		const file = await this.fileRepository.findById(id);

		if (!file) {
			throw new FilesError({
				message: FileExceptionMessage.INVALID_ID,
				status: HTTPCode.UNPROCESSED_ENTITY,
			});
		}

		await this.awsFileService.deleteFile(file.toObject().url);

		const isDeleted = this.delete(id);

		return await isDeleted;
	}

	public async getAll(): Promise<FileUploadResponseDto[]> {
		const items = await this.fileRepository.findAll();

		return items.map((item) => item.toObject());
	}

	public async uploadFile(payload: {
		entityId: number;
		file: MultipartFile;
		folder: ValueOf<typeof FileFolderName>;
	}): Promise<FileUploadResponseDto> {
		const { entityId, file, folder } = payload;

		const { filename, mimetype } = file;

		this.validateMimeType(mimetype as FileMimeType);
		this.validateFileSize(file);

		const buffer = await file.toBuffer();
		const generatedFileName = this.generateFileName(folder, filename);

		const url = await this.awsFileService.uploadFile(
			buffer,
			generatedFileName,
			mimetype as FileMimeType,
		);

		const savedFile = await this.fileRepository.create(
			FileEntity.initializeNew({
				contentType: mimetype as FileMimeType,
				entityId,
				folder,
				url,
			}),
		);

		return savedFile.toObject();
	}

	private generateFileName = (
		folder: ValueOf<typeof FileFolderName>,
		fileName: string,
	): string => {
		const dotIndex = fileName.lastIndexOf(".");
		const name = fileName.slice(0, dotIndex);
		const extension = fileName.slice(dotIndex);
		const timestamp = String(Date.now());

		return `${folder}/${name}-${timestamp}${extension}`;
	};

	private validateFileSize = (file: MultipartFile): void => {
		const isFileSizeExceedsLimit = file.file.truncated;

		if (isFileSizeExceedsLimit) {
			throw new FilesError({
				message: FileExceptionMessage.SIZE_EXCEEDS_LIMIT,
				status: HTTPCode.UNPROCESSED_ENTITY,
			});
		}
	};

	private validateMimeType = (mimeType: FileMimeType): boolean => {
		const ALLOWED_FILE_TYPES = [
			ContentType.JPEG,
			ContentType.JPG,
			ContentType.PNG,
		];
		const isInvalidType = !ALLOWED_FILE_TYPES.includes(mimeType);

		if (isInvalidType) {
			throw new FilesError({
				message: FileExceptionMessage.INVALID_TYPE,
				status: HTTPCode.UNPROCESSED_ENTITY,
			});
		}

		return true;
	};
}

export { FileService };
