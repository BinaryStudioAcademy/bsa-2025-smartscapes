import { APIPath } from "~/libs/enums/enums.js";
import {
	type APIHandlerOptions,
	type APIHandlerResponse,
	BaseController,
} from "~/libs/modules/controller/controller.js";
import { HTTPCode } from "~/libs/modules/http/http.js";
import { type Logger } from "~/libs/modules/logger/logger.js";
import { type UserService } from "~/modules/users/user.service.js";

import { UsersApiPath } from "./libs/enums/enums.js";
import { type UserGetByIdItemResponseDto } from "./libs/types/types.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         email:
 *           type: string
 *           example: user@example.com
 *         lastName:
 *          type: string
 *          example: Doe
 *         firstName:
 *          type: string
 *          example: John
 */

class UserController extends BaseController {
	private userService: UserService;

	public constructor(logger: Logger, userService: UserService) {
		super(logger, APIPath.USERS);
		this.userService = userService;

		this.addRoute({
			handler: this.findAll.bind(this),
			method: "GET",
			path: UsersApiPath.ROOT,
		});

		this.addRoute({
			handler: this.follow.bind(this),
			method: "POST",
			path: UsersApiPath.FOLLOW,
		});

		this.addRoute({
			handler: this.unfollow.bind(this),
			method: "DELETE",
			path: UsersApiPath.UNFOLLOW,
		});
	}

	/**
	 * @swagger
	 * /users:
	 *   get:
	 *     security:
	 *      - bearerAuth: []
	 *     tags:
	 *       - Users
	 *     summary: Retrieve all users
	 *     responses:
	 *       200:
	 *         description: A list of users
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 data:
	 *                   type: array
	 *                   items:
	 *                     $ref: '#/components/schemas/User'
	 */
	public async findAll(): Promise<
		APIHandlerResponse<UserGetByIdItemResponseDto[]>
	> {
		const { items } = await this.userService.findAll();

		return {
			payload: { data: items },
			status: HTTPCode.OK,
		};
	}

	/**
	 * @swagger
	 * /users/{userId}/follow:
	 *   post:
	 *     tags:
	 *       - Users
	 *     summary: Follow a user
	 *     parameters:
	 *       - in: path
	 *         name: userId
	 *         required: true
	 *         schema:
	 *           type: integer
	 *         description: ID of the user who is following
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             properties:
	 *               followingId:
	 *                 type: integer
	 *                 description: ID of the user to follow
	 *                 example: 2
	 *     responses:
	 *       200:
	 *         description: Successfully followed the user
	 *       401:
	 *         description: Unauthorized – userId does not match authorized user
	 */

	public async follow(
		request: APIHandlerOptions<
			{
				body: { followingId: string };
				params: { userId: string };
			} & { user: UserGetByIdItemResponseDto }
		>,
	): Promise<APIHandlerResponse> {
		const followingId = Number(request.body.followingId);
		const followerId = Number(request.params.userId);
		const userId = Number(request.user?.id);

		if (userId !== followerId) {
			return {
				payload: null,
				status: HTTPCode.UNAUTHORIZED,
			};
		}

		await this.userService.follow(followerId, followingId);

		return {
			payload: null,
			status: HTTPCode.OK,
		};
	}

	/**
	 * @swagger
	 * /users/{userId}/unfollow/{id}:
	 *   delete:
	 *     tags:
	 *       - Users
	 *     summary: Unfollow a user
	 *     parameters:
	 *       - in: path
	 *         name: userId
	 *         required: true
	 *         schema:
	 *           type: integer
	 *         description: ID of the user who wants to unfollow
	 *       - in: path
	 *         name: id
	 *         required: true
	 *         schema:
	 *           type: integer
	 *         description: ID of the user to be unfollowed
	 *     responses:
	 *       200:
	 *         description: Successfully unfollowed the user
	 *       401:
	 *         description: Unauthorized – userId does not match authorized user
	 */

	public async unfollow(
		request: APIHandlerOptions<
			{ params: { id: string; userId: string } } & {
				user: UserGetByIdItemResponseDto;
			}
		>,
	): Promise<APIHandlerResponse> {
		const followingId = Number(request.params.id);
		const followerId = Number(request.params.userId);
		const userId = Number(request.user?.id);

		if (userId !== followerId) {
			return {
				payload: null,
				status: HTTPCode.UNAUTHORIZED,
			};
		}

		await this.userService.unfollow(followerId, followingId);

		return {
			payload: null,
			status: HTTPCode.OK,
		};
	}
}

export { UserController };
