import {
	DeleteObjectCommand,
	PutObjectCommand,
	S3Client,
	S3ServiceException,
} from "@aws-sdk/client-s3";

import { type Config } from "~/libs/modules/config/config.js";
import { HTTPCode } from "~/libs/modules/http/http.js";
import { type Logger } from "~/libs/modules/logger/logger.js";
import { type ValueOf } from "~/libs/types/types.js";
import { type FileMimeType } from "~/modules/files/files.js";

import { AwsExceptionMessage } from "./libs/enums/enums.js";
import { AWSFileUploadError } from "./libs/exeptions/exeptions.js";

class AWSFileService {
	private bucketName: string;

	private logger: Logger;

	private s3Client: S3Client;

	public constructor(config: Config, logger: Logger) {
		this.bucketName = config.ENV.AWS.S3_BUCKET_NAME;
		this.logger = logger;

		this.s3Client = new S3Client({
			credentials: {
				accessKeyId: config.ENV.AWS.ACCESS_KEY_ID,
				secretAccessKey: config.ENV.AWS.SECRET_ACCESS_KEY,
			},
			region: config.ENV.AWS.REGION,
		});
	}

	public async deleteFile(fileUrl: string): Promise<void> {
		try {
			const url = new URL(fileUrl);

			const key = url.pathname.replace(/^\/+/, "");

			const command = new DeleteObjectCommand({
				Bucket: this.bucketName,
				Key: key,
			});

			await this.s3Client.send(command);

			this.logger.info(`File deleted from AWS S3: ${key}`);
		} catch (error) {
			if (error instanceof S3ServiceException) {
				const s3Error = error;
				const httpStatusCode =
					"httpStatusCode" in s3Error.$metadata
						? s3Error.$metadata.httpStatusCode
						: HTTPCode.BAD_REQUEST;

				throw new AWSFileUploadError({
					message: AwsExceptionMessage.FILE_UPLOADING_ERROR,
					status: httpStatusCode as ValueOf<typeof HTTPCode>,
				});
			}

			throw new AWSFileUploadError({
				message: AwsExceptionMessage.FILE_UPLOADING_ERROR,
				status: HTTPCode.BAD_REQUEST,
			});
		}
	}

	public async uploadFile(
		buffer: Buffer,
		key: string,
		contentType: FileMimeType,
	): Promise<string> {
		try {
			const command = new PutObjectCommand({
				Body: buffer,
				Bucket: this.bucketName,
				ContentType: contentType,
				Key: key,
			});

			await this.s3Client.send(command);

			const url = `https://${this.bucketName}.s3.amazonaws.com/${key}`;
			this.logger.info(`File uploaded to AWS S3: ${key}`);

			return url;
		} catch (error) {
			if (error instanceof S3ServiceException) {
				const s3Error = error;

				const httpStatusCode =
					"httpStatusCode" in s3Error.$metadata
						? s3Error.$metadata.httpStatusCode
						: HTTPCode.BAD_REQUEST;

				throw new AWSFileUploadError({
					message: AwsExceptionMessage.FILE_UPLOADING_ERROR,
					status: httpStatusCode as ValueOf<typeof HTTPCode>,
				});
			}

			throw new AWSFileUploadError({
				message: AwsExceptionMessage.FILE_UPLOADING_ERROR,
				status: HTTPCode.BAD_REQUEST,
			});
		}
	}
}

export { AWSFileService };
