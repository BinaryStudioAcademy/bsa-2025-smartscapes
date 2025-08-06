import { expect } from "@playwright/test";
import _Ajv from "ajv";

const Ajv = _Ajv as unknown as typeof _Ajv.default;
const ajv = new Ajv({ strict: false });

const expectToMatchSchema = (responseBody: unknown, schema: object): void => {
	const validate = ajv.compile(schema);
	const valid = validate(responseBody);

	expect.soft(valid, "Response should match schema").toBe(true);
};

export { expectToMatchSchema };
