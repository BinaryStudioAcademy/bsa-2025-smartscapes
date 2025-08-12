import { awsService } from "~/libs/modules/aws/aws.js";
import { logger } from "~/libs/modules/logger/logger.js";

import { FilesController } from "./files.controller.js";
import { FilesModel } from "./files.model.js";
import { FilesRepository } from "./files.repository.js";
import { FilesService } from "./files.service.js";

const filesRepository = new FilesRepository(FilesModel);
const filesService = new FilesService(filesRepository, awsService);
const filesController = new FilesController(logger, filesService);

export { filesController };
export { FileContent, FilesExceptionMessage } from "./libs/enums/enums.js";
export { FilesError } from "./libs/exeptions/exeptions.js";
export { type FileContentType } from "./libs/types/types.js";
