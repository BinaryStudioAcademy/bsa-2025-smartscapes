import { type encryption } from "~/libs/modules/encryption/libs/encryption.js";
import { type BaseToken } from "~/libs/modules/token/token.js";
import {
	type AuthenticatedUserPatchRequestDto,
	type AuthenticatedUserPatchResponseDto,
	type UserService,
	type UserSignInRequestDto,
	type UserSignInResponseDto,
	type UserSignUpRequestDto,
	type UserSignUpResponseDto,
} from "~/modules/users/users.js";

import { AuthExceptionMessage } from "./libs/enums/enums.js";
import { AuthError } from "./libs/exceptions/auth.exception.js";

type Constructor = {
	encryptionService: typeof encryption;
	tokenService: BaseToken;
	userService: UserService;
};

class AuthService {
	private encryptionService: typeof encryption;
	private tokenService: BaseToken;
	private userService: UserService;

	public constructor({
		encryptionService,
		tokenService,
		userService,
	}: Constructor) {
		this.encryptionService = encryptionService;
		this.tokenService = tokenService;
		this.userService = userService;
	}

	public async patch(
		id: number,
		userRequestDto: AuthenticatedUserPatchRequestDto,
	): Promise<AuthenticatedUserPatchResponseDto> {
		const user = await this.userService.patch(id, userRequestDto);

		return user;
	}

	public async signIn(
		userRequestDto: UserSignInRequestDto,
	): Promise<UserSignInResponseDto> {
		const { email, password } = userRequestDto;

		const user = await this.userService.findPasswordDetails(email);

		if (!user) {
			throw new AuthError({
				message: AuthExceptionMessage.UNAUTHORIZED_REQUEST,
			});
		}

		const arePasswordsMatch = await this.encryptionService.compare(
			password,
			user.passwordHash,
		);

		if (!arePasswordsMatch) {
			throw new AuthError({
				message: AuthExceptionMessage.INVALID_CREDENTIALS,
			});
		}

		const token = await this.tokenService.create({ userId: user.id });

		return {
			token,
			user: {
				email,
				firstName: user.firstName,
				id: user.id,
				lastName: user.lastName,
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
