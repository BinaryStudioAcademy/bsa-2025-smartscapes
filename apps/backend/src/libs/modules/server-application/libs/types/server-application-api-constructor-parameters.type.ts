import { type Config } from "~/libs/modules/config/config.js";

import { type WhiteRoute } from "./types.js";

type ServerApplicationApiConstructorParameters = {
	config: Config;
	version: string;
	whiteRoutes?: WhiteRoute[];
};

export { type ServerApplicationApiConstructorParameters as ServerApplicationApiConstructorParams };
