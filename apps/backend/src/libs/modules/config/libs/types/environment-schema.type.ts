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
		MAPBOX_ACCESS_TOKEN: string;
		MAPBOX_URL: string;
	};
};

export { type EnvironmentSchema };
