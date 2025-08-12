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
import { type FilesService } from "~/modules/files/files.service.js";

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
 *           $ref: '#/components/schemas/FileContentType'
 *
 *     FileContentType:
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
	private filesService: FilesService;

	public constructor(logger: Logger, filesService: FilesService) {
		super(logger, APIPath.FILES);
		this.filesService = filesService;

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
	}

	/**
	 * @swagger
	 * /api/v1/files:
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
		const result = await this.filesService.getAll();

		return {
			payload: { data: result },
			status: HTTPCode.OK,
		};
	}

	/**
	 * @swagger
	 * /api/v1/files/upload/{folder}:
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
			body: MultipartFile;
			params: { folder: ValueOf<typeof FileFolderName> };
		}>,
	): Promise<APIHandlerResponse<FileUploadResponseDto>> {
		const { folder } = options.params;

		const file = options.body;

		const result = await this.filesService.uploadFile({
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
