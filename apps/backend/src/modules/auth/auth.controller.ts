import { APIPath } from "~/libs/enums/enums.js";
import {
	type APIHandlerOptions,
	type APIHandlerResponse,
	BaseController,
} from "~/libs/modules/controller/controller.js";
import { HTTPCode } from "~/libs/modules/http/http.js";
import { type Logger } from "~/libs/modules/logger/logger.js";
import { type UserAuthResponseDto } from "~/libs/types/types.js";
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
import { AuthError } from "./libs/exceptions/auth.exception.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     UserSignInRequestDto:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           minLength: 6
 *           maxLength: 64
 *           format: email
 *           example: user@example.com
 *         password:
 *           type: string
 *           minLength: 6
 *           maxLength: 64
 *           example: strongP@ssw0rd
 *
 *     UserSignUpRequestDto:
 *       type: object
 *       required:
 *         - email
 *         - firstName
 *         - lastName
 *         - password
 *         - confirmPassword
 *       properties:
 *         email:
 *           type: string
 *           minLength: 6
 *           maxLength: 64
 *           format: email
 *           example: user@example.com
 *         firstName:
 *           type: string
 *           minLength: 2
 *           maxLength: 64
 *           pattern: '^[a-zA-Z\\s]+$'
 *           example: John
 *         lastName:
 *           type: string
 *           minLength: 2
 *           maxLength: 64
 *           pattern: '^[a-zA-Z\\s]+$'
 *           example: Doe
 *         password:
 *           type: string
 *           minLength: 6
 *           maxLength: 64
 *           example: strongP@ssw0rd
 *         confirmPassword:
 *           type: string
 *           minLength: 6
 *           maxLength: 64
 *           example: strongP@ssw0rd
 *
 *     UserAuthResponseDto:
 *       type: object
 *       required:
 *         - id
 *         - email
 *         - firstName
 *         - lastName
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         email:
 *           type: string
 *           format: email
 *           example: user@example.com
 *         firstName:
 *           type: string
 *           example: John
 *         lastName:
 *           type: string
 *           example: Doe
 *
 *     UserSignInResponseDto:
 *       type: object
 *       required:
 *         - token
 *         - user
 *       properties:
 *         token:
 *           type: string
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         user:
 *           type: object
 *           required:
 *             - id
 *             - email
 *           properties:
 *             email:
 *               type: string
 *               format: email
 *               example: user@example.com
 *             id:
 *               type: integer
 *               example: 1
 *
 *     UserSignUpResponseDto:
 *       type: object
 *       required:
 *         - token
 *         - user
 *       properties:
 *         token:
 *           type: string
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         user:
 *           $ref: '#/components/schemas/UserAuthResponseDto'
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
			handler: this.getAuthenticatedUser.bind(this),
			method: "GET",
			path: AuthApiPath.AUTH_USER,
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

	/**
	 * @swagger
	 * /auth/authenticated-user:
	 *   get:
	 *     security:
	 *       - bearerAuth: []
	 *     tags:
	 *       - Auth
	 *     summary: Get authorized user
	 *     responses:
	 *       200:
	 *         description: User authorized
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 data:
	 *                   $ref: '#/components/schemas/UserAuthResponseDto'
	 */
	public getAuthenticatedUser({
		user,
	}: APIHandlerOptions): APIHandlerResponse<UserAuthResponseDto> {
		if (!user) {
			throw new AuthError();
		}

		return {
			payload: { data: user },
			status: HTTPCode.OK,
		};
	}

	/**
	 * @swagger
	 * /auth/sign-in:
	 *   post:
	 *     tags:
	 *       - Auth
	 *     summary: Sign in a user
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             $ref: '#/components/schemas/UserSignInRequestDto'
	 *     responses:
	 *       200:
	 *         description: Successful sign-in
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 data:
	 *                   $ref: '#/components/schemas/UserSignInResponseDto'
	 */

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
	 *   post:
	 *     tags:
	 *       - Auth
	 *     summary: Register a new user
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             $ref: '#/components/schemas/UserSignUpRequestDto'
	 *     responses:
	 *       201:
	 *         description: User registered
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 data:
	 *                   $ref: '#/components/schemas/UserSignUpResponseDto'
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
