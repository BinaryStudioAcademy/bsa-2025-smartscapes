import { type APIHandlerOptions } from "~/libs/modules/controller/controller.js";

type APIPreHandler = (options: APIHandlerOptions, done: () => void) => void;

export { type APIPreHandler };
