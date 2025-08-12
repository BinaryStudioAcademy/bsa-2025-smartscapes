import { z } from "zod";

import { FileFolderName, FilesValidationMessage } from "../enums/enums.js";

const fileUploadFolder = z.strictObject({
	folder: z.enum(Object.values(FileFolderName), {
		message: FilesValidationMessage.INVALID_FOLDER_NAME,
	}),
});

export { fileUploadFolder };
