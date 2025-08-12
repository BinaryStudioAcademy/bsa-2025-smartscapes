import { encryption } from "~/libs/modules/encryption/libs/encryption.js";
import { HTTPCode } from "~/libs/modules/http/http.js";
import {
	type CollectionResult,
	type Service,
	type UserAuthResponseDto,
} from "~/libs/types/types.js";
import { UserExceptionMessage } from "~/modules/users/libs/enums/enums.js";
import { UserEntity } from "~/modules/users/user.entity.js";
import { type UserRepository } from "~/modules/users/user.repository.js";

import { type GroupService } from "../groups/group.service.js";
import { GroupKey } from "../groups/libs/enums/enums.js";
import { UserError } from "./libs/exceptions/exceptions.js";
import {
	type AuthenticatedUserPatchRequestDto,
	type AuthenticatedUserPatchResponseDto,
	type UserGetByIdItemResponseDto,
	type UserPasswordDetails,
	type UserSignUpRequestDto,
} from "./libs/types/types.js";

class UserService implements Service {
	private groupService: GroupService;
	private userRepository: UserRepository;

	public constructor(
		userRepository: UserRepository,
		groupService: GroupService,
	) {
		this.userRepository = userRepository;
		this.groupService = groupService;
	}

	public async create(
		payload: UserSignUpRequestDto,
	): Promise<UserAuthResponseDto> {
		const existingUser = await this.findByEmail(payload.email);

		if (existingUser) {
			throw new UserError({
				message: UserExceptionMessage.USER_ALLREADY_EXISTS,
				status: HTTPCode.CONFLICT,
			});
		}

		const { encryptedData, salt } = await encryption.encrypt(payload.password);

		const group = await this.groupService.findByKey(GroupKey.USERS);

		const user = await this.userRepository.create(
			UserEntity.initializeNew({
				email: payload.email,
				firstName: payload.firstName,
				groupId: group.id,
				lastName: payload.lastName,
				passwordHash: encryptedData,
				passwordSalt: salt,
			}),
		);

		return user.toObject() as UserAuthResponseDto;
	}

	public async findAll(): Promise<
		CollectionResult<UserGetByIdItemResponseDto>
	> {
		const items = await this.userRepository.findAll();

		return {
			items: items.map((item) => item.toObject()),
		};
	}

	public async findByEmail(
		email: string,
	): Promise<null | UserGetByIdItemResponseDto> {
		const user = await this.userRepository.findByEmail(email);

		return user ? user.toObject() : null;
	}

	public async findById(id: number): Promise<null | UserAuthResponseDto> {
		const user = await this.userRepository.findById(id);

		return user ? user.toObject() : null;
	}

	public async findPasswordDetails(
		email: string,
	): Promise<null | UserPasswordDetails> {
		return await this.userRepository.findPasswordDetails(email);
	}

	public async patch(
		id: number,
		payload: AuthenticatedUserPatchRequestDto,
	): Promise<AuthenticatedUserPatchResponseDto> {
		const item = await this.userRepository.patch(id, payload);

		if (!item) {
			throw new UserError({
				message: UserExceptionMessage.USER_NOT_FOUND,
				status: HTTPCode.NOT_FOUND,
			});
		}

		return item.toObject();
	}
}

export { UserService };
