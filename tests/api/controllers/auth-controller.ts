import { type APIRequestContext, type APIResponse } from "@playwright/test";
import { AuthApiPath, type UserSignUpRequestDto } from "@smartscapes/shared";

import { APIPath } from "../../consts/api-path.js";

class AuthController {
	public constructor(private request: APIRequestContext) {}

	public async getAuthenticatedUser(accessToken: string): Promise<APIResponse> {
		return await this.request.get(`${APIPath.AUTH}${AuthApiPath.AUTH_USER}`, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});
	}

	public async login(email: string, password: string): Promise<APIResponse> {
		return await this.request.post(`${APIPath.AUTH}${AuthApiPath.SIGN_IN}`, {
			data: {
				email,
				password,
			},
		});
	}

	public async register(
		registerDto: UserSignUpRequestDto,
	): Promise<APIResponse> {
		return await this.request.post(`${APIPath.AUTH}${AuthApiPath.SIGN_UP}`, {
			data: registerDto,
		});
	}
}

export { AuthController };
