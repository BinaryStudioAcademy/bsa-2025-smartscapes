import { type Logger as LibraryLogger, pino } from "pino";
import pretty from "pino-pretty";

import { type Logger } from "./libs/types/types.js";

class BaseLogger implements Logger {
	private instance: LibraryLogger;

	public constructor() {
		this.instance = pino(pretty());
	}

	public debug(
		message: string,
		parameters: Record<string, unknown> = {},
	): ReturnType<Logger["debug"]> {
		this.instance.debug(parameters, message);
	}

	public error(
		message: string,
		parameters: Record<string, unknown> = {},
	): ReturnType<Logger["error"]> {
		this.instance.error(parameters, message);
	}

	public info(
		message: string,
		parameters: Record<string, unknown> = {},
	): ReturnType<Logger["info"]> {
		this.instance.info(parameters, message);
	}

	public warn(
		message: string,
		parameters: Record<string, unknown> = {},
	): ReturnType<Logger["warn"]> {
		this.instance.warn(parameters, message);
	}
}

export { BaseLogger };
