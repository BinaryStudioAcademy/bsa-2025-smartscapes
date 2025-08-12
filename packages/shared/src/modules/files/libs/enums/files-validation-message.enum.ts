import { FileFolderName } from "./file-folder-name.enum.js";

const FilesValidationMessage = {
	INVALID_FOLDER_NAME: `Invalid folder name. Allowed values: ${Object.values(
		FileFolderName,
	).join(", ")}`,
} as const;

export { FilesValidationMessage };
