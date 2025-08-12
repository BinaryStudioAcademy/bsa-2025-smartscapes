import { type FileContentType } from "./file-content-type.type.js";

type FileUploadResponseDto = {
	contentType: FileContentType;
	id: number;
	url: string;
};

export { type FileUploadResponseDto };
