import { APIPath } from "~/libs/enums/enums.js";
import {
	type APIHandlerOptions,
	type APIHandlerResponse,
	BaseController,
} from "~/libs/modules/controller/controller.js";
import { HTTPCode } from "~/libs/modules/http/http.js";
import { type Logger } from "~/libs/modules/logger/logger.js";
import {
	type UserSignInRequestDto,
	type UserSignInResponseDto,
	userSignInValidationSchema,
	type UserSignUpRequestDto,
	type UserSignUpResponseDto,
	userSignUpValidationSchema,
} from "~/modules/users/users.js";

import { type AuthService } from "./auth.service.js";
import { AuthApiPath } from "./libs/enums/enums.js";

/**
 * @swagger
 * components:
 *    schemas:
 *      UserSignUpRequestDto:
 *        type: object
 *        required:
 *          - email
 *          - firstName
 *          - lastName
 *          - password
 *        properties:
 *          email:
 *            type: string
 *            example: user@example.com
 *          firstName:
 *            type: string
 *            example: John
 *          lastName:
 *            type: string
 *            example: Doe
 *          password:
 *            type: string
 *            example: strongP@ssw0rd
 *
 *      UserAuthResponseDto:
 *        type: object
 *        $ref: '#/components/schemas/User'
 */

class AuthController extends BaseController {
	private authService: AuthService;

	public constructor(logger: Logger, authService: AuthService) {
		super(logger, APIPath.AUTH);

		this.authService = authService;

		this.addRoute({
			handler: this.signUp.bind(this),
			method: "POST",
			path: AuthApiPath.SIGN_UP,
			validation: {
				body: userSignUpValidationSchema,
			},
		});

		this.addRoute({
			handler: this.signIn.bind(this),
			method: "POST",
			path: AuthApiPath.SIGN_IN,
			validation: {
				body: userSignInValidationSchema,
			},
		});
	}

	public async signIn(
		options: APIHandlerOptions<{
			body: UserSignInRequestDto;
		}>,
	): Promise<APIHandlerResponse<UserSignInResponseDto>> {
		const { body } = options;

		const result = await this.authService.signIn(body);

		return {
			payload: { data: result },
			status: HTTPCode.OK,
		};
	}

	/**
	 * @swagger
	 * /auth/sign-up:
	 *    post:
	 *      tags:
	 *       - Auth
	 *      summary: Register a new user
	 *      requestBody:
	 *        required: true
	 *        content:
	 *          application/json:
	 *            schema:
	 *              $ref: '#/components/schemas/UserSignUpRequestDto'
	 *      responses:
	 *        201:
	 *          description: User registered
	 *          content:
	 *            application/json:
	 *              schema:
	 *                type: object
	 *                properties:
	 *                  data:
	 *                    $ref: '#/components/schemas/UserAuthResponseDto'
	 */
	public async signUp(
		options: APIHandlerOptions<{
			body: UserSignUpRequestDto;
		}>,
	): Promise<APIHandlerResponse<UserSignUpResponseDto>> {
		const { body } = options;

		const data = await this.authService.signUp(body);

		return {
			payload: { data },
			status: HTTPCode.CREATED,
		};
	}
}

export { AuthController };
