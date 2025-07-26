import { type encryption } from "~/libs/modules/encryption/libs/encryption.js";
import { type BaseToken } from "~/libs/modules/token/token.js";
import { type UserRepository } from "~/modules/users/user.repository.js";
import {
	type UserService,
	type UserSignInRequestDto,
	type UserSignInResponseDto,
	type UserSignUpRequestDto,
	type UserSignUpResponseDto,
} from "~/modules/users/users.js";

import { AuthorizationExceptionMessage } from "./libs/enums/auth-exception-message.enum.js";
import { AuthorizationError } from "./libs/exceptions/auth.exception.js";

type Constructor = {
	encryptionService: typeof encryption;
	tokenService: BaseToken;
	userRepository: UserRepository;
	userService: UserService;
};

class AuthService {
	private encryptionService: typeof encryption;
	private tokenService: BaseToken;
	private userRepository: UserRepository;
	private userService: UserService;

	public constructor({
		encryptionService,
		tokenService,
		userRepository,
		userService,
	}: Constructor) {
		this.encryptionService = encryptionService;
		this.tokenService = tokenService;
		this.userRepository = userRepository;
		this.userService = userService;
	}

	public async signIn(
		userRequestDto: UserSignInRequestDto,
	): Promise<UserSignInResponseDto> {
		const { email, password } = userRequestDto;

		const user = await this.userRepository.findByEmail(email);

		if (!user) {
			throw new AuthorizationError({
				message: AuthorizationExceptionMessage.INVALID_CREDENTIALS,
			});
		}

		const arePasswordsMatch = await this.encryptionService.compare(
			password,
			user.getPasswordHash(),
		);

		if (!arePasswordsMatch) {
			throw new AuthorizationError({
				message: AuthorizationExceptionMessage.INVALID_CREDENTIALS,
			});
		}

		const token = await this.tokenService.create({ userId: user.getId() });

		return { token, user: user.toObject() };
	}

	public async signUp(
		userRequestDto: UserSignUpRequestDto,
	): Promise<UserSignUpResponseDto> {
		const { email, id } = await this.userService.create(userRequestDto);
		const token = await this.tokenService.create({ userId: id });

		return { token, user: { email, id } };
	}
}

export { AuthService };
