import { type GroupItemWithPermissionsDto } from "@smartscapes/shared";
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { type APIHandlerOptions } from "~/libs/modules/controller/controller.js";
import { HTTPCode } from "~/libs/modules/http/http.js";
import { type Logger } from "~/libs/modules/logger/logger.js";
import {
	type AuthenticatedUserPatchRequestDto,
	type AuthenticatedUserPatchResponseDto,
	type UserAuthResponseDto,
	type UserSignUpRequestDto,
	type UserSignUpResponseDto,
} from "~/modules/users/users.js";

import { AuthController } from "./auth.controller.js";
import { type AuthService } from "./auth.service.js";

describe("AuthController", () => {
	const mockToken = "mock token";

	const mockUser: UserAuthResponseDto = {
		email: "test@example.com",
		firstName: "John",
		group: {
			id: 2,
			key: "users",
			name: "Users",
			permissions: [
				{ id: 1, key: "read", name: "Read Permission" },
				{ id: 2, key: "write", name: "Write Permission" },
			],
		},
		groupId: 2,
		id: 1,
		lastName: "Doe",
	};

	const mockPatchUser: AuthenticatedUserPatchResponseDto = {
		email: "test@example.com",
		firstName: "Jane",
		group: {
			id: 2,
			key: "users",
			name: "Users",
			permissions: [
				{ id: 1, key: "read", name: "Read Permission" },
				{ id: 2, key: "write", name: "Write Permission" },
			],
		} as GroupItemWithPermissionsDto,
		groupId: 2,
		id: 1,
		lastName: "Smith",
	};

	const mockLogger: Logger = {
		debug: () => {},
		error: () => {},
		info: () => {},
		warn: () => {},
	};

	it("patch should return updated user information", async () => {
		const updatedUser = {
			...mockPatchUser,
			firstName: "Jane",
			lastName: "Smith",
		};

		const mockPatch: AuthService["patch"] = () => {
			return Promise.resolve(updatedUser);
		};

		const authService = {
			patch: mockPatch,
		} as AuthService;

		const authController = new AuthController(mockLogger, authService);

		const patchOptions = {
			body: {
				firstName: "Jane",
				lastName: "Smith",
			} as AuthenticatedUserPatchRequestDto,
			params: { id: "1" },
		} as APIHandlerOptions<{
			body: AuthenticatedUserPatchRequestDto;
			params: { id: string };
		}>;

		const result = await authController.patch(patchOptions);

		assert.deepStrictEqual(result, {
			payload: { data: updatedUser },
			status: HTTPCode.OK,
		});
	});

	it("signUp should create and return token and new user", async () => {
		const mockResponseData: UserSignUpResponseDto = {
			token: mockToken,
			user: mockUser,
		};

		const mockSignUp: AuthService["signUp"] = async () => {
			await Promise.resolve();

			return mockResponseData;
		};

		const authService = {
			signUp: mockSignUp,
		} as AuthService;

		const authController = new AuthController(mockLogger, authService);

		const signUpOptions = {
			body: {
				confirmPassword: "Password123!",
				email: mockUser.email,
				firstName: mockUser.firstName,
				lastName: mockUser.lastName,
				password: "Password123!",
			},
		} as APIHandlerOptions<{ body: UserSignUpRequestDto }>;

		const result = await authController.signUp(signUpOptions);

		assert.deepStrictEqual(result, {
			payload: {
				data: {
					token: mockToken,
					user: { ...mockUser },
				},
			},
			status: HTTPCode.CREATED,
		});
	});

	it("should reply with authenticated user", () => {
		const status = HTTPCode.OK;
		const authController = new AuthController(mockLogger, {} as AuthService);

		const mockRequest = {
			user: { ...mockUser },
		};

		const data = authController.getAuthenticatedUser(
			mockRequest as unknown as APIHandlerOptions,
		);

		assert.deepStrictEqual(data, {
			payload: { data: { ...mockUser } },
			status,
		});
	});
});
