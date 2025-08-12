import fastifyMultipart, { type MultipartFile } from "@fastify/multipart";
import { type FastifyInstance, type FastifyRequest } from "fastify";
import fastifyPlugin from "fastify-plugin";

import { BYTES_IN_MB } from "~/libs/constants/constants.js";
import { HTTPCode } from "~/libs/modules/http/http.js";
import {
	FileContent,
	FilesError,
	FilesExceptionMessage,
} from "~/modules/files/files.js";

type PluginOptions = {
	MAX_FILE_SIZE_MB: number;
};

const multipart = async (
	app: FastifyInstance,
	{ MAX_FILE_SIZE_MB }: PluginOptions,
): Promise<void> => {
	const MAX_FILE_SIZE_BYTES = BYTES_IN_MB * MAX_FILE_SIZE_MB;

	await app.register(fastifyMultipart, {
		limits: {
			files: 1,
			fileSize: MAX_FILE_SIZE_BYTES,
		},
		throwFileSizeLimit: true,
	});

	const requestHandler = async (
		request: FastifyRequest<{ Body: MultipartFile }>,
	): Promise<void> => {
		if (request.isMultipart()) {
			const file = await request.file();

			if (!file) {
				throw new FilesError({
					message: FilesExceptionMessage.FILE_REQUIRED,
					status: HTTPCode.BAD_REQUEST,
				});
			}

			const ALLOWED_FILE_TYPES = Object.values(
				FileContent,
			) as readonly string[];
			const IS_INVALID_TYPE = !ALLOWED_FILE_TYPES.includes(file.mimetype);

			if (IS_INVALID_TYPE) {
				throw new FilesError({
					message: FilesExceptionMessage.INVALID_FILE_TYPE,
					status: HTTPCode.UNPROCESSED_ENTITY,
				});
			}

			request.body = file;
		}
	};

	app.addHook("preHandler", requestHandler);
};

const multipartPlugin = fastifyPlugin(multipart);

export { multipartPlugin };
