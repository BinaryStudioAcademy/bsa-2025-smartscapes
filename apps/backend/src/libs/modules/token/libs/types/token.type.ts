import { type TokenPayload } from "./token-payload.type.js";

type Token = {
	create(payload: TokenPayload["payload"]): Promise<string>;
	verify<Payload extends TokenPayload = TokenPayload>(
		jwt: string,
	): Promise<Payload>;
};

export { type Token };
