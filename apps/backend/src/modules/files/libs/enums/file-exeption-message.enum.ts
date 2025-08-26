import { config } from "~/libs/modules/config/config.js";

const MAX_FILE_SIZE = String(config.ENV.AWS.MAX_FILE_SIZE_MB);

const FileExceptionMessage = {
	INVALID_ID: "File with stated ID does not exist.",
	INVALID_TYPE: "Invalid file type. Only JPEG, JPG, and PNG files are allowed.",
	REQUIRED: "File is required.",
	SIZE_EXCEEDS_LIMIT: `File size exceeds the maximum limit of ${MAX_FILE_SIZE} Mb.`,
} as const;

export { FileExceptionMessage };
