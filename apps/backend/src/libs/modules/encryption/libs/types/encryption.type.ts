import { type EncyptedDataResponse } from "./encryption-data-response.type.js";

type Encryption = {
	compare(data: string, hash: string): Promise<boolean>;
	encrypt(data: string): Promise<EncyptedDataResponse>;
};

export { type Encryption };
