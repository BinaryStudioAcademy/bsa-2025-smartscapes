import { APIPath } from "~/libs/enums/enums.js";
import { BaseController } from "~/libs/modules/controller/base-controller.module.js";
import {
	type APIHandlerOptions,
	type APIHandlerResponse,
} from "~/libs/modules/controller/libs/types/types.js";
import { HTTPCode } from "~/libs/modules/http/http.js";
import { type Logger } from "~/libs/modules/logger/libs/types/logger.type.js";
import {
	UserFollowsApiPath,
	UserFollowsExceptionMessage,
} from "~/modules/user-follows/libs/enums/enums.js";
import { UserFollowsError } from "~/modules/user-follows/libs/exceptions/user-follows.exception.js";
import { type UserFollowsService } from "~/modules/user-follows/user-follows.service.js";

import {
	type UserAuthResponseDto,
	type UserFollowsParametersDto,
	type UserFollowsRequestDto,
	type UserUnfollowsParametersDto,
} from "./libs/types/types.js";

class UserFollowsController extends BaseController {
	private userFollowsService: UserFollowsService;

	public constructor(logger: Logger, userFollowsService: UserFollowsService) {
		super(logger, APIPath.USERS);
		this.userFollowsService = userFollowsService;

		this.addRoute({
			handler: this.follow.bind(this),
			method: "POST",
			path: UserFollowsApiPath.$USER_ID_FOLLOWERS,
		});

		this.addRoute({
			handler: this.unfollow.bind(this),
			method: "DELETE",
			path: UserFollowsApiPath.$USER_ID_FOLLOWERS_$ID,
		});
	}

	/**
	 * @swagger
	 * /users/{userId}/followers:
	 *   post:
	 *     tags:
	 *       - Users
	 *     summary: Follow another user
	 *     security:
	 *       - bearerAuth: []
	 *     parameters:
	 *       - in: path
	 *         name: userId
	 *         required: true
	 *         schema:
	 *           type: integer
	 *         description: ID of the authenticated user
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
	 *         description: User followed successfully
	 *       401:
	 *         description: Unauthorized – ID does not match authenticated user
	 */

	public async follow(
		options: APIHandlerOptions<{
			body: UserFollowsRequestDto;
			params: UserFollowsParametersDto;
		}>,
	): Promise<APIHandlerResponse> {
		const { body, params, user } = options;

		const followingId = Number(body.followingId);
		const followerId = Number(params.userId);
		const userId = (user as UserAuthResponseDto).id;

		if (userId !== followerId) {
			throw new UserFollowsError({
				message: UserFollowsExceptionMessage.UNAUTHORIZED_USER,
				status: HTTPCode.UNAUTHORIZED,
			});
		}

		await this.userFollowsService.follow(followerId, followingId);

		return {
			payload: null,
			status: HTTPCode.OK,
		};
	}

	/**
	 * @swagger
	 * /users/{userId}/followers/{id}:
	 *   delete:
	 *     tags:
	 *       - Users
	 *     summary: Unfollow a user
	 *     security:
	 *       - bearerAuth: []
	 *     parameters:
	 *       - in: path
	 *         name: userId
	 *         required: true
	 *         schema:
	 *           type: integer
	 *         description: ID of the authenticated user
	 *       - in: path
	 *         name: id
	 *         required: true
	 *         schema:
	 *           type: integer
	 *         description: ID of the user to unfollow
	 *     responses:
	 *       200:
	 *         description: User unfollowed successfully
	 *       401:
	 *         description: Unauthorized – ID does not match authenticated user
	 */

	public async unfollow(
		options: APIHandlerOptions<{
			params: UserUnfollowsParametersDto;
		}>,
	): Promise<APIHandlerResponse> {
		const { params, user } = options;

		const followingId = Number(params.id);
		const followerId = Number(params.userId);
		const userId = (user as UserAuthResponseDto).id;

		if (userId !== followerId) {
			throw new UserFollowsError({
				message: UserFollowsExceptionMessage.UNAUTHORIZED_USER,
				status: HTTPCode.UNAUTHORIZED,
			});
		}

		await this.userFollowsService.unfollow(followerId, followingId);

		return {
			payload: null,
			status: HTTPCode.OK,
		};
	}
}

export { UserFollowsController };
