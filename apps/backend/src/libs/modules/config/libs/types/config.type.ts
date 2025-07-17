import { type Config as LibraryConfig } from "@smart-scapes/shared";

import { type EnvironmentSchema } from "./types.js";

type Config = LibraryConfig<EnvironmentSchema>;

export { type Config };
