import { type MultipartFile } from "@fastify/multipart";

import { type AWSService } from "~/libs/modules/aws/aws.js";
import { type Service } from "~/libs/types/types.js";

import { FilesEntity } from "./files.entity.js";
import { type FilesRepository } from "./files.repository.js";
import {
	type FileContentType,
	type FileUploadRequestDto,
	type FileUploadResponseDto,
} from "./libs/types/types.js";

class FilesService implements Service {
	private awsService: AWSService;
	private filesRepository: FilesRepository;

	public constructor(filesRepository: FilesRepository, awsService: AWSService) {
		this.filesRepository = filesRepository;
		this.awsService = awsService;
	}

	public async create(payload: {
		contentType: FileContentType;
		url: string;
	}): Promise<FileUploadResponseDto> {
		const { contentType, url } = payload;

		const item = await this.filesRepository.create(
			FilesEntity.initializeNew({
				contentType,
				url,
			}),
		);

		return item.toObject();
	}

	public async getAll(): Promise<FileUploadResponseDto[]> {
		const items = await this.filesRepository.findAll();

		return items.map((item) => item.toObject());
	}

	public async uploadFile(
		payload: FileUploadRequestDto<MultipartFile>,
	): Promise<FileUploadResponseDto> {
		const { file, folder } = payload;
		const { filename, mimetype } = file;
		const buffer = await file.toBuffer();
		const generatedFileName = this.generateFileName(folder, filename);

		const url = await this.awsService.uploadFile(
			buffer,
			generatedFileName,
			mimetype as FileContentType,
		);

		const savedFile = await this.filesRepository.create(
			FilesEntity.initializeNew({
				contentType: mimetype as FileContentType,
				url,
			}),
		);

		return savedFile.toObject();
	}

	private generateFileName = (folder: string, fileName: string): string => {
		const dotIndex = fileName.lastIndexOf(".");
		const name = fileName.slice(0, dotIndex);
		const extension = fileName.slice(dotIndex);
		const timestamp = String(Date.now());

		return `${folder}/${name}-${timestamp}${extension}`;
	};
}

export { FilesService };
