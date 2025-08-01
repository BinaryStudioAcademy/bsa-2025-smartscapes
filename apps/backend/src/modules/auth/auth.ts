import { encryption } from "~/libs/modules/encryption/libs/encryption.js";
import { logger } from "~/libs/modules/logger/logger.js";
import { tokenService } from "~/libs/modules/token/token.js";
import { userService } from "~/modules/users/users.js";

import { groupRepository } from "../groups/groups.js";
import { AuthController } from "./auth.controller.js";
import { AuthService } from "./auth.service.js";

const authService = new AuthService({
	encryptionService: encryption,
	groupRepository,
	tokenService,
	userService,
});

const authController = new AuthController(logger, authService);

export { authController };
