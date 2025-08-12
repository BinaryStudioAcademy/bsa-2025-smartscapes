import { logger } from "~/libs/modules/logger/logger.js";

import { groupService } from "../groups/group.js";
import { UserController } from "./user.controller.js";
import { UserModel } from "./user.model.js";
import { UserRepository } from "./user.repository.js";
import { UserService } from "./user.service.js";

const userRepository = new UserRepository(UserModel);
const userService = new UserService(userRepository, groupService);
const userController = new UserController(logger, userService);

export { userController, userService };
export {
	type AuthenticatedUserPatchRequestDto,
	type AuthenticatedUserPatchResponseDto,
	type UserAuthResponseDto,
	type UserSignInRequestDto,
	type UserSignInResponseDto,
	type UserSignUpRequestDto,
	type UserSignUpResponseDto,
} from "./libs/types/types.js";
export {
	authenticatedUserPatchValidationSchema,
	userSignInValidationSchema,
	userSignUpValidationSchema,
} from "./libs/validation-schemas/validation-schemas.js";
export { type UserService } from "./user.service.js";
