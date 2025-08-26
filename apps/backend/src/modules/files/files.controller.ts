import { type MultipartFile } from "@fastify/multipart";

import { APIPath } from "~/libs/enums/enums.js";
import {
	type APIHandlerOptions,
	type APIHandlerResponse,
	BaseController,
} from "~/libs/modules/controller/controller.js";
import { HTTPCode } from "~/libs/modules/http/http.js";
import { type Logger } from "~/libs/modules/logger/logger.js";
import { type ValueOf } from "~/libs/types/types.js";
import { type FileService } from "~/modules/files/files.service.js";

import { type FileFolderName, FilesApiPath } from "./libs/enums/enums.js";
import { type FileUploadResponseDto } from "./libs/types/types.js";
import { fileUploadFolderValidationSchema } from "./libs/validation-schemas/validation-schemas.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     FileUploadRequestDto:
 *       type: object
 *       required:
 *         - file
 *         - folder
 *       properties:
 *         file:
 *           type: string
 *           format: binary
 *           description: File to upload
 *         folder:
 *           $ref: '#/components/schemas/FileFolderName'
 *
 *     FileUploadResponseDto:
 *       type: object
 *       required:
 *         - id
 *         - url
 *         - contentType
 *       properties:
 *         id:
 *           type: integer
 *           description: File ID
 *         url:
 *           type: string
 *           format: uri
 *           description: File URL
 *         contentType:
 *           $ref: '#/components/schemas/FileMimeType'
 *
 *     FileMimeType:
 *       type: string
 *       enum: [image/jpeg, image/jpg, image/png]
 *       description: Supported file content types
 *
 *     FileFolderName:
 *       type: string
 *       enum: [avatars, pois, reviews, routes]
 *       description: Available folder names for file upload
 */

class FilesController extends BaseController {
	private fileService: FileService;

	public constructor(logger: Logger, fileService: FileService) {
		super(logger, APIPath.FILES);
		this.fileService = fileService;

		this.addRoute({
			handler: this.uploadFile.bind(this),
			method: "POST",
			path: FilesApiPath.UPLOAD,
			validation: {
				params: fileUploadFolderValidationSchema,
			},
		});

		this.addRoute({
			handler: this.getAll.bind(this),
			method: "GET",
			path: FilesApiPath.ROOT,
		});

		this.addRoute({
			handler: this.delete.bind(this),
			method: "DELETE",
			path: FilesApiPath.$ID,
		});
	}

	/**
	 * @swagger
	 * /files/{id}:
	 *   delete:
	 *     security:
	 *       - bearerAuth: []
	 *     tags: [Files]
	 *     summary: Delete a file
	 *     parameters:
	 *       - in: path
	 *         name: id
	 *         required: true
	 *         schema:
	 *           type: string
	 *     responses:
	 *       200:
	 *         description: File deleted successfully
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 data:
	 *                   type: boolean
	 */

	public async delete(
		options: APIHandlerOptions<{
			params: { id: number };
		}>,
	): Promise<APIHandlerResponse<boolean>> {
		const id = Number(options.params.id);

		const isDeleted = await this.fileService.delete(id);

		return {
			payload: { data: isDeleted },
			status: HTTPCode.OK,
		};
	}

	/**
	 * @swagger
	 * /files:
	 *   get:
	 *     summary: Get all files
	 *     description: Retrieve a list of all uploaded files (limited to 10)
	 *     tags: [Files]
	 *     security:
	 *       - bearerAuth: []
	 *     responses:
	 *       200:
	 *         description: List of files retrieved successfully
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 data:
	 *                   type: array
	 *                   items:
	 *                     $ref: '#/components/schemas/FileUploadResponseDto'
	 */
	public async getAll(): Promise<APIHandlerResponse<FileUploadResponseDto[]>> {
		const result = await this.fileService.getAll();

		return {
			payload: { data: result },
			status: HTTPCode.OK,
		};
	}

	/**
	 * @swagger
	 * /files/upload/{folder}/{entityId}:
	 *   post:
	 *     summary: Upload a file
	 *     description: Upload a file to the specified folder
	 *     tags: [Files]
	 *     security:
	 *       - bearerAuth: []
	 *     parameters:
	 *       - in: path
	 *         name: folder
	 *         required: true
	 *         schema:
	 *           $ref: '#/components/schemas/FileFolderName'
	 *         description: Folder name where to upload the file
	 *       - in: path
	 *         name: entityId
	 *         required: true
	 *         schema:
	 *           type: number
	 *         description: Id of an entity type
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         multipart/form-data:
	 *           schema:
	 *             type: object
	 *             required:
	 *               - file
	 *             properties:
	 *               file:
	 *                 type: string
	 *                 format: binary
	 *                 description: File to upload (image/jpeg or image/png)
	 *     responses:
	 *       201:
	 *         description: File uploaded successfully
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 data:
	 *                   $ref: '#/components/schemas/FileUploadResponseDto'
	 */
	public async uploadFile(
		options: APIHandlerOptions<{
			body: { file: MultipartFile };
			params: { entityId: number; folder: ValueOf<typeof FileFolderName> };
		}>,
	): Promise<APIHandlerResponse<FileUploadResponseDto>> {
		const { entityId, folder } = options.params;
		const { file } = options.body;

		const result = await this.fileService.uploadFile({
			entityId,
			file,
			folder,
		});

		return {
			payload: { data: result },
			status: HTTPCode.CREATED,
		};
	}
}

export { FilesController };
