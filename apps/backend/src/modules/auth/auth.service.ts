import { type encryption } from "~/libs/modules/encryption/libs/encryption.js";
import { type BaseToken } from "~/libs/modules/token/token.js";
import {
	type UserService,
	type UserSignInRequestDto,
	type UserSignInResponseDto,
	type UserSignUpRequestDto,
	type UserSignUpResponseDto,
} from "~/modules/users/users.js";

import { type GroupRepository } from "../groups/group.repository.js";
import { AuthorizationExceptionMessage } from "./libs/enums/enums.js";
import { AuthorizationError } from "./libs/exceptions/auth.exception.js";

type Constructor = {
	encryptionService: typeof encryption;
	groupRepository: GroupRepository;
	tokenService: BaseToken;
	userService: UserService;
};

class AuthService {
	private encryptionService: typeof encryption;
	private groupRepository: GroupRepository;
	private tokenService: BaseToken;
	private userService: UserService;

	public constructor({
		encryptionService,
		groupRepository,
		tokenService,
		userService,
	}: Constructor) {
		this.encryptionService = encryptionService;
		this.tokenService = tokenService;
		this.userService = userService;
		this.groupRepository = groupRepository;
	}

	public async signIn(
		userRequestDto: UserSignInRequestDto,
	): Promise<UserSignInResponseDto> {
		const { email, password } = userRequestDto;

		const user = await this.userService.findPasswordDetails(email);

		if (!user) {
			throw new AuthorizationError({
				message: AuthorizationExceptionMessage.INVALID_CREDENTIALS,
			});
		}

		const arePasswordsMatch = await this.encryptionService.compare(
			password,
			user.passwordHash,
		);

		if (!arePasswordsMatch) {
			throw new AuthorizationError({
				message: AuthorizationExceptionMessage.INVALID_CREDENTIALS,
			});
		}

		const group = await this.groupRepository.findById(user.groupId);

		if (!group) {
			throw new AuthorizationError({
				message: AuthorizationExceptionMessage.INVALID_CREDENTIALS,
			});
		}

		const groupObject = group.toObject();

		if (!groupObject.id) {
			throw new AuthorizationError({
				message: AuthorizationExceptionMessage.INVALID_CREDENTIALS,
			});
		}

		const token = await this.tokenService.create({ userId: user.id });

		return {
			group: {
				id: groupObject.id,
				key: groupObject.key,
			},
			token,
			user: {
				email,
				id: user.id,
			},
		};
	}

	public async signUp(
		userRequestDto: UserSignUpRequestDto,
	): Promise<UserSignUpResponseDto> {
		const user = await this.userService.create(userRequestDto);
		const token = await this.tokenService.create({ userId: user.id });

		return { token, user };
	}
}

export { AuthService };
