import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

import { type Config } from "~/libs/modules/config/config.js";
import { type Logger } from "~/libs/modules/logger/logger.js";

class AWSService {
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

	public async uploadFile(
		buffer: Buffer,
		key: string,
		contentType: string,
	): Promise<string> {
		const command = new PutObjectCommand({
			Body: buffer,
			Bucket: this.bucketName,
			ContentType: contentType,
			Key: key,
		});

		await this.s3Client.send(command);

		const url = `https://${this.bucketName}.s3.amazonaws.com/${key}`;
		this.logger.info(`File uploaded to S3: ${key}`);

		return url;
	}
}

export { AWSService };
