import { type APIErrorType } from "../enums/enums.js";
import { type APIValidationErrorDetail } from "./api-validation-error-detail.type.js";
import { type ValueOf } from "./value-of.type.js";

type APIBaseErrorResponse<
	ErrorType extends ValueOf<typeof APIErrorType> = ValueOf<typeof APIErrorType>,
	Details extends undefined | unknown[] = undefined,
> = {
	error: (Details extends undefined ? object : { details: Details }) & {
		message: string;
		type: ErrorType;
	};
};

type APICommonErrorResponse = APIBaseErrorResponse<typeof APIErrorType.COMMON>;

type APIErrorResponse = APICommonErrorResponse | APIValidationErrorResponse;

type APIValidationErrorResponse = APIBaseErrorResponse<
	typeof APIErrorType.VALIDATION,
	APIValidationErrorDetail[]
>;

export { type APIErrorResponse };
