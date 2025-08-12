import { type AppEnvironment } from "~/libs/enums/enums.js";
import { type ValueOf } from "~/libs/types/types.js";

type EnvironmentSchema = {
	APP: {
		ENVIRONMENT: ValueOf<typeof AppEnvironment>;
		HOST: string;
		PORT: number;
	};
	AUTH: {
		JWS_ALGORITHM: string;
		JWT_SECRET: string;
		TOKEN_EXPIRATION: string;
	};
	AWS: {
		ACCESS_KEY_ID: string;
		MAX_FILE_SIZE_MB: number;
		REGION: string;
		S3_BUCKET_NAME: string;
		SECRET_ACCESS_KEY: string;
	};
	DB: {
		CONNECTION_STRING: string;
		DIALECT: string;
		POOL_MAX: number;
		POOL_MIN: number;
	};
	ENCRYPTION: {
		SALT_ROUNDS: number;
	};
	MAPBOX: {
		ACCESS_TOKEN: string;
		BASE_URL: string;
	};
};

export { type EnvironmentSchema };
