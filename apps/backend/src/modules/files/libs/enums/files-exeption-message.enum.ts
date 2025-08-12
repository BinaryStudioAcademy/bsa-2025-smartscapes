const FilesExceptionMessage = {
	FILE_REQUIRED: "File is required.",
	FILE_SIZE_EXCEEDS_LIMIT: "File size exceeds the maximum limitMB.",
	INVALID_FILE_TYPE:
		"Invalid file type. Only JPEG, JPG, and PNG files are allowed.",
} as const;

export { FilesExceptionMessage };
