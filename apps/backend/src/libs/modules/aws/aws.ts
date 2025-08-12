import { config } from "../config/config.js";
import { logger } from "../logger/logger.js";
import { AWSService } from "./base-aws.module.js";

const awsService = new AWSService(config, logger);

export { awsService };
export { type AWSService } from "./base-aws.module.js";
