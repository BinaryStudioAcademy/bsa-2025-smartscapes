import convict, { type Config as LibraryConfig } from "convict";
import { config } from "dotenv";

import { AppEnvironment } from "~/libs/enums/enums.js";
import { type Logger } from "~/libs/modules/logger/logger.js";

import { type Config, type EnvironmentSchema } from "./libs/types/types.js";

class BaseConfig implements Config {
	public ENV: EnvironmentSchema;

	private logger: Logger;

	private get envSchema(): LibraryConfig<EnvironmentSchema> {
		return convict<EnvironmentSchema>({
			APP: {
				ENVIRONMENT: {
					default: null,
					doc: "Application environment",
					env: "NODE_ENV",
					format: Object.values(AppEnvironment),
				},
				HOST: {
					default: null,
					doc: "Host for server app",
					env: "HOST",
					format: String,
				},
				PORT: {
					default: null,
					doc: "Port for incoming connections",
					env: "PORT",
					format: Number,
				},
			},
			AUTH: {
				JWS_ALGORITHM: {
					default: null,
					doc: "JWS algorithm key",
					env: "JWS_ALGORITHM",
					format: String,
				},
				JWT_SECRET: {
					default: null,
					doc: "Secret string for token generation",
					env: "JWT_SECRET",
					format: String,
				},
				TOKEN_EXPIRATION: {
					default: null,
					doc: "Token expiration time",
					env: "TOKEN_EXPIRATION",
					format: String,
				},
			},
			AWS: {
				ACCESS_KEY_ID: {
					default: null,
					doc: "AWS Access Key ID",
					env: "AWS_ACCESS_KEY_ID",
					format: String,
				},
				MAX_FILE_SIZE_MB: {
					default: 10,
					doc: "Max file size in MB",
					env: "AWS_MAX_FILE_SIZE_MB",
					format: Number,
				},
				REGION: {
					default: null,
					doc: "AWS Region",
					env: "AWS_REGION",
					format: String,
				},
				S3_BUCKET_NAME: {
					default: null,
					doc: "S3 Bucket Name",
					env: "AWS_S3_BUCKET_NAME",
					format: String,
				},
				SECRET_ACCESS_KEY: {
					default: null,
					doc: "AWS Secret Access Key",
					env: "AWS_SECRET_ACCESS_KEY",
					format: String,
				},
			},
			DB: {
				CONNECTION_STRING: {
					default: null,
					doc: "Database connection string",
					env: "DB_CONNECTION_STRING",
					format: String,
				},
				DIALECT: {
					default: null,
					doc: "Database dialect",
					env: "DB_DIALECT",
					format: String,
				},
				POOL_MAX: {
					default: null,
					doc: "Database pool max count",
					env: "DB_POOL_MAX",
					format: Number,
				},
				POOL_MIN: {
					default: null,
					doc: "Database pool min count",
					env: "DB_POOL_MIN",
					format: Number,
				},
			},
			ENCRYPTION: {
				SALT_ROUNDS: {
					default: null,
					doc: "Encryption salt rounds",
					env: "SALT_ROUNDS",
					format: Number,
				},
			},
			MAPBOX: {
				ACCESS_TOKEN: {
					default: null,
					doc: "Mapbox api access token",
					env: "MAPBOX_ACCESS_TOKEN",
					format: String,
				},
				BASE_URL: {
					default: null,
					doc: "Mapbox URL",
					env: "MAPBOX_BASE_URL",
					format: String,
				},
			},
		});
	}

	public constructor(logger: Logger) {
		this.logger = logger;

		config();

		this.envSchema.load({});

		this.ENV = this.envSchema.getProperties();

		if (this.ENV.APP.ENVIRONMENT !== AppEnvironment.TEST) {
			this.envSchema.validate({
				allowed: "strict",
				output: (message) => {
					this.logger.info(message);
				},
			});
		}

		this.logger.info(".env file is found and successfully parsed.");
	}
}

export { BaseConfig };
