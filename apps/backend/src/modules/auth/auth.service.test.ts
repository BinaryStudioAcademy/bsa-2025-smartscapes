import assert from "node:assert/strict";
import { describe, it, mock } from "node:test";

import { type BaseEncryption } from "~/libs/modules/encryption/libs/base-encryption.module.js";
import { type BaseToken } from "~/libs/modules/token/token.js";
import { AuthService } from "~/modules/auth/auth.service.js";
import {
	type UserAuthResponseDto,
	type UserService,
	type UserSignInRequestDto,
	type UserSignInResponseDto,
	type UserSignUpRequestDto,
	type UserSignUpResponseDto,
} from "~/modules/users/users.js";

import { GroupEntity } from "../groups/group.entity.js";
import { GroupKey } from "../groups/libs/enums/enums.js";
import { PermissionEntity } from "../permission/permission.entity.js";
import { type UserPasswordDetails } from "../users/libs/types/user-password-details.type.js";

describe("AuthService", () => {
	const signUpRequestDto: UserSignUpRequestDto = {
		confirmPassword: "Password123!",
		email: "test@example.com",
		firstName: "John",
		lastName: "Doe",
		password: "Password123!",
	};

	const mockPermission = PermissionEntity.initialize({
		id: 1,
		key: "read",
		name: "Read",
	});

	const mockGroup = GroupEntity.initializeWithPermissions({
		id: 2,
		key: GroupKey.USERS,
		name: "Users",
		permissions: [mockPermission.toObject()],
	});

	it("signUp should create new user", async () => {
		const mockToken = "mock token";

		const mockUserServiceResponse: UserAuthResponseDto = {
			email: signUpRequestDto.email,
			firstName: signUpRequestDto.firstName,
			group: mockGroup.toObject(),
			groupId: 2,
			id: 1,
			lastName: signUpRequestDto.lastName,
		};

		const mockSignUpResponse: UserSignUpResponseDto = {
			token: mockToken,
			user: {
				...mockUserServiceResponse,
			},
		};

		const mockTokenCreate = mock.fn<BaseToken["create"]>(() =>
			Promise.resolve(mockToken),
		);
		const mockUserCreate = mock.fn<UserService["create"]>(() =>
			Promise.resolve(mockUserServiceResponse),
		);

		const mockFindByEmail = mock.fn<UserService["findByEmail"]>(() =>
			Promise.resolve(null),
		);

		const mockTokenService = {
			create: mockTokenCreate as BaseToken["create"],
		} as BaseToken;
		const mockUserService = {
			create: mockUserCreate as UserService["create"],
			findByEmail: mockFindByEmail as UserService["findByEmail"],
		} as UserService;

		const mockEncryptionService = {
			compare: mock.fn(() => Promise.resolve(true)),
			encrypt: mock.fn(() => Promise.resolve("encryptedValue")),
			hash: mock.fn(() => Promise.resolve("hashedPassword")),
		} as unknown as BaseEncryption;

		const authService = new AuthService({
			encryptionService: mockEncryptionService,
			tokenService: mockTokenService,
			userService: mockUserService,
		});

		const result = await authService.signUp(signUpRequestDto);

		const [userCreateCall] = mockUserCreate.mock.calls;
		const [userCreateArgument] = userCreateCall?.arguments ?? [];

		assert.deepStrictEqual(result, mockSignUpResponse);
		assert.deepStrictEqual(userCreateArgument, signUpRequestDto);
	});

	it("signIn should return token and user data when credentials are valid", async () => {
		const mockToken = "mock token";

		const signInRequestDto: UserSignInRequestDto = {
			email: "test@example.com",
			password: "Password123!",
		};

		const mockPasswordDetails: UserPasswordDetails = {
			email: signInRequestDto.email,
			firstName: "John",
			group: mockGroup.toObject(),
			groupId: mockGroup.toObject().id,
			id: 1,
			lastName: "Doe",
			passwordHash: "hashedPassword",
			passwordSalt: "someSalt",
		};

		const expectedSignInResponse: UserSignInResponseDto = {
			token: mockToken,
			user: {
				email: signInRequestDto.email,
				firstName: mockPasswordDetails.firstName,
				group: mockGroup.toObject(),
				groupId: 2,
				id: mockPasswordDetails.id,
				lastName: mockPasswordDetails.lastName,
			},
		};

		const mockTokenCreate = mock.fn<BaseToken["create"]>(() =>
			Promise.resolve(mockToken),
		);

		const mockFindPasswordDetails = mock.fn<UserService["findPasswordDetails"]>(
			(email) => {
				if (email === signInRequestDto.email) {
					return Promise.resolve(mockPasswordDetails);
				}

				return Promise.resolve(null);
			},
		);

		const mockTokenService = {
			create: mockTokenCreate as BaseToken["create"],
		} as BaseToken;

		const mockUserService = {
			findPasswordDetails:
				mockFindPasswordDetails as UserService["findPasswordDetails"],
		} as UserService;

		const mockEncryptionService = {
			compare: mock.fn((password, hash) => {
				if (
					password === signInRequestDto.password &&
					hash === mockPasswordDetails.passwordHash
				) {
					return Promise.resolve(true);
				}

				return Promise.resolve(false);
			}),
		} as unknown as BaseEncryption;

		const authService = new AuthService({
			encryptionService: mockEncryptionService,
			tokenService: mockTokenService,
			userService: mockUserService,
		});

		const result = await authService.signIn(signInRequestDto);
		assert.deepStrictEqual(result, expectedSignInResponse);
	});
});
