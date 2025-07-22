import { config } from "~/libs/modules/config/config.js";

import { BaseEncryption } from "./base-encription.module.js";

const encryption = new BaseEncryption(config);

export { encryption };
