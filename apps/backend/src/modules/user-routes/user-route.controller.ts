import { APIPath } from "~/libs/enums/enums.js";
import { BaseController } from "~/libs/modules/controller/base-controller.module.js";
import {
	type APIHandlerOptions,
	type APIHandlerResponse,
} from "~/libs/modules/controller/libs/types/types.js";
import { HTTPCode } from "~/libs/modules/http/http.js";
import { type Logger } from "~/libs/modules/logger/libs/types/logger.type.js";
import { type UserAuthResponseDto } from "~/modules/users/users.js";

import { UserRouteApiPath } from "./libs/enums/enum.js";
import {
	type UserRouteDeleteParameters,
	type UserRouteFinishRequestDto,
	type UserRouteGetAllQueryRequestDto,
	type UserRouteQueryRequestDto,
	type UserRouteResponseDto,
} from "./libs/types/types.js";
import {
	userRouteDeleteValidationSchema,
	userRouteFinishValidationSchema,
	userRouteGetAllValidationSchema,
	userRouteQueryValidationSchema,
} from "./libs/validation-schemas/validation-schemas.js";
import { type UserRouteService } from "./user-route.service.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     UserRouteGeometry:
 *       type: object
 *       required:
 *         - coordinates
 *         - type
 *       properties:
 *         coordinates:
 *           type: array
 *           items:
 *             type: array
 *             items:
 *               type: number
 *             minItems: 2
 *             maxItems: 2
 *           minItems: 2
 *           example: [[30.528909, 50.455232], [30.528209, 50.415232]]
 *         type:
 *           type: string
 *           enum: ["LineString"]
 *           example: "LineString"
 *
 *     UserRouteFinishRequestDto:
 *       type: object
 *       required:
 *         - actualGeometry
 *       properties:
 *         actualGeometry:
 *           $ref: '#/components/schemas/UserRouteGeometry'
 *
 *     UserRouteResponseDto:
 *       type: object
 *       required:
 *         - id
 *         - routeId
 *         - userId
 *         - status
 *         - startedAt
 *         - completedAt
 *         - actualGeometry
 *         - plannedGeometry
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         routeId:
 *           type: integer
 *           example: 7
 *         userId:
 *           type: integer
 *           example: 1
 *         status:
 *           type: string
 *           enum: ["not_started", "active", "completed", "cancelled", "expired"]
 *           example: "not_started"
 *         startedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: null
 *         completedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: null
 *         actualGeometry:
 *           $ref: '#/components/schemas/UserRouteGeometry'
 *         plannedGeometry:
 *           $ref: '#/components/schemas/UserRouteGeometry'
 */

class UserRouteController extends BaseController {
	private userRouteService: UserRouteService;

	public constructor(logger: Logger, userRouteService: UserRouteService) {
		super(logger, APIPath.USER_ROUTES);
		this.userRouteService = userRouteService;

		this.addRoute({
			handler: this.create.bind(this),
			method: "POST",
			path: UserRouteApiPath.CREATE,
			validation: {
				query: userRouteQueryValidationSchema,
			},
		});

		this.addRoute({
			handler: this.finish.bind(this),
			method: "PATCH",
			path: UserRouteApiPath.FINISH,
			validation: {
				body: userRouteFinishValidationSchema,
				query: userRouteQueryValidationSchema,
			},
		});

		this.addRoute({
			handler: this.start.bind(this),
			method: "PATCH",
			path: UserRouteApiPath.START,
			validation: {
				query: userRouteQueryValidationSchema,
			},
		});

		this.addRoute({
			handler: this.getAll.bind(this),
			method: "GET",
			path: UserRouteApiPath.ROOT,
			validation: {
				query: userRouteGetAllValidationSchema,
			},
		});

		this.addRoute({
			handler: this.delete.bind(this),
			method: "DELETE",
			path: UserRouteApiPath.$ID,
			validation: {
				params: userRouteDeleteValidationSchema,
			},
		});

		this.addRoute({
			handler: this.getByRouteId.bind(this),
			method: "GET",
			path: UserRouteApiPath.GET,
			validation: {
				query: userRouteQueryValidationSchema,
			},
		});

		this.addRoute({
			handler: this.getPopular.bind(this),
			method: "GET",
			path: UserRouteApiPath.POPULAR,
		});
	}

	/**
	 * @swagger
	 * /user-routes/create:
	 *   post:
	 *     security:
	 *       - bearerAuth: []
	 *     tags:
	 *       - User Routes
	 *     summary: Create a new user route
	 *     description: Create a new user route for tracking user's journey through a specific route. User ID is derived from JWT token.
	 *     parameters:
	 *       - in: query
	 *         name: routeId
	 *         required: true
	 *         schema:
	 *           type: integer
	 *         description: ID of the route to track
	 *         example: 7
	 *     responses:
	 *       201:
	 *         description: User route created successfully
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 payload:
	 *                   type: object
	 *                   properties:
	 *                     data:
	 *                       $ref: '#/components/schemas/UserRouteResponseDto'
	 *             example:
	 *               payload:
	 *                 data:
	 *                   id: 1
	 *                   routeId: 7
	 *                   userId: 1
	 *                   status: "not_started"
	 *                   startedAt: null
	 *                   completedAt: null
	 *                   actualGeometry:
	 *                     type: "LineString"
	 *                     coordinates: [[30.528909, 50.455232], [30.528209, 50.415232]]
	 *                   plannedGeometry:
	 *                     type: "LineString"
	 *                     coordinates: [[30.528909, 50.455232], [30.528209, 50.415232]]
	 */
	public async create(
		options: APIHandlerOptions<{
			query: UserRouteQueryRequestDto;
		}>,
	): Promise<APIHandlerResponse<UserRouteResponseDto>> {
		const { query, user } = options;
		const { routeId } = query;
		const { id: userId } = user as UserAuthResponseDto;

		const createdRoute = await this.userRouteService.create({
			routeId,
			userId,
		});

		return {
			payload: { data: createdRoute },
			status: HTTPCode.CREATED,
		};
	}

	/**
	 * @swagger
	 * /user-routes/{id}:
	 *   delete:
	 *     security:
	 *       - bearerAuth: []
	 *     tags:
	 *       - User route
	 *     summary: Delete saved user route
	 *     description: Deletes a route that was previously saved by the user.
	 *     parameters:
	 *       - in: path
	 *         name: id
	 *         required: true
	 *         schema:
	 *           type: string
	 *     responses:
	 *       200:
	 *         description: Route deleted successfully
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 data:
	 *                   type: boolean
	 *                   example: true
	 *       401:
	 *         description: Unauthorized - Authentication required
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 error:
	 *                   type: object
	 *                   properties:
	 *                     message:
	 *                       type: string
	 *                       example: Unauthorized access
	 */

	public async delete({
		params,
		user,
	}: APIHandlerOptions<{ params: UserRouteDeleteParameters }>): Promise<
		APIHandlerResponse<boolean>
	> {
		const routeId = Number(params.id);

		const isDeleted = await this.userRouteService.deleteSavedRoute(
			routeId,
			user?.id as number,
		);

		return {
			payload: { data: isDeleted },
			status: HTTPCode.OK,
		};
	}

	/**
	 * @swagger
	 * /user-routes/finish:
	 *   patch:
	 *     security:
	 *       - bearerAuth: []
	 *     tags:
	 *       - User Routes
	 *     summary: Finish a user route
	 *     description: Finish a user route by providing the actual geometry traveled and updating status to completed. User ID is derived from JWT token.
	 *     parameters:
	 *       - in: query
	 *         name: routeId
	 *         required: true
	 *         schema:
	 *           type: integer
	 *         description: ID of the route being finished
	 *         example: 7
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             $ref: '#/components/schemas/UserRouteFinishRequestDto'
	 *     responses:
	 *       200:
	 *         description: User route finished successfully
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 payload:
	 *                   type: object
	 *                   properties:
	 *                     data:
	 *                       $ref: '#/components/schemas/UserRouteResponseDto'
	 *             example:
	 *               payload:
	 *                 data:
	 *                   id: 1
	 *                   routeId: 7
	 *                   userId: 1
	 *                   status: "completed"
	 *                   startedAt: "2025-08-21T16:37:51.437Z"
	 *                   completedAt: "2025-08-21T16:38:11.183Z"
	 *                   actualGeometry:
	 *                     type: "LineString"
	 *                     coordinates: [[30.528909, 50.455232], [30.528209, 50.415232]]
	 *                   plannedGeometry:
	 *                     type: "LineString"
	 *                     coordinates: [[30.528909, 50.455232], [30.528209, 50.415232]]
	 */
	public async finish(
		options: APIHandlerOptions<{
			body: UserRouteFinishRequestDto;
			query: UserRouteQueryRequestDto;
		}>,
	): Promise<APIHandlerResponse<UserRouteResponseDto>> {
		const { body, query, user } = options;
		const { actualGeometry } = body;
		const { routeId } = query;
		const { id: userId } = user as UserAuthResponseDto;

		const updatedRoute = await this.userRouteService.finish({
			actualGeometry,
			routeId,
			userId,
		});

		return {
			payload: { data: updatedRoute },
			status: HTTPCode.OK,
		};
	}

	/**
	 * @swagger
	 * /user-routes:
	 *   get:
	 *     security:
	 *       - bearerAuth: []
	 *     tags:
	 *       - User Routes
	 *     summary: Get all user routes
	 *     description: Get all user routes for the authenticated user including their status, timestamps, and geometry information. User ID is derived from JWT token.
	 *     parameters:
	 *       - in: query
	 *         name: status
	 *         schema:
	 *           type: string
	 *           enum: ["active", "completed", "cancelled", "expired", "not_started"]
	 *           example: "active"
	 *       - in: query
	 *         name: id
	 *         required: true
	 *         schema:
	 *           type: integer
	 *         description: ID of user to retrieve routes for
	 *         example: 1
	 *     responses:
	 *       200:
	 *         description: User routes retrieved successfully
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 payload:
	 *                   type: object
	 *                   properties:
	 *                     data:
	 *                       type: array
	 *                       items:
	 *                         $ref: '#/components/schemas/UserRouteResponseDto'
	 *             example:
	 *               payload:
	 *                 data:
	 *                   - id: 1
	 *                     routeId: 7
	 *                     userId: 1
	 *                     status: "not_started"
	 *                     startedAt: null
	 *                     completedAt: null
	 *                     actualGeometry:
	 *                       type: "LineString"
	 *                       coordinates: [[30.528909, 50.455232], [30.528209, 50.415232]]
	 *                     plannedGeometry:
	 *                       type: "LineString"
	 *                       coordinates: [[30.528909, 50.455232], [30.528209, 50.415232]]
	 *                   - id: 2
	 *                     routeId: 8
	 *                     userId: 1
	 *                     status: "active"
	 *                     startedAt: "2025-08-21T16:37:51.437Z"
	 *                     completedAt: null
	 *                     actualGeometry:
	 *                       type: "LineString"
	 *                       coordinates: [[30.528909, 50.455232], [30.528209, 50.415232]]
	 *                     plannedGeometry:
	 *                       type: "LineString"
	 *                       coordinates: [[30.528909, 50.455232], [30.528209, 50.415232]]
	 *                   - id: 3
	 *                     routeId: 9
	 *                     userId: 1
	 *                     status: "completed"
	 *                     startedAt: "2025-08-21T16:37:51.437Z"
	 *                     completedAt: "2025-08-21T16:38:11.183Z"
	 *                     actualGeometry:
	 *                       type: "LineString"
	 *                       coordinates: [[30.528909, 50.455232], [30.528209, 50.415232]]
	 *                     plannedGeometry:
	 *                       type: "LineString"
	 *                       coordinates: [[30.528909, 50.455232], [30.528209, 50.415232]]
	 */
	public async getAll(
		options: APIHandlerOptions<{
			query: UserRouteGetAllQueryRequestDto;
			user: UserAuthResponseDto;
		}>,
	): Promise<APIHandlerResponse<UserRouteResponseDto[]>> {
		const { query, user } = options;
		const { id: userId } = user as UserAuthResponseDto;

		const userRoutes = await this.userRouteService.getAll({
			...query,
			userId,
		});

		return {
			payload: { data: userRoutes },
			status: HTTPCode.OK,
		};
	}

	/**
	 * @swagger
	 * /user-routes/get:
	 *   get:
	 *     security:
	 *       - bearerAuth: []
	 *     tags:
	 *       - User Routes
	 *     summary: Get user route by route ID
	 *     description: Get a specific user route by route ID for the authenticated user. User ID is derived from JWT token.
	 *     parameters:
	 *       - in: query
	 *         name: routeId
	 *         required: true
	 *         schema:
	 *           type: integer
	 *         description: ID of the route to retrieve
	 *         example: 7
	 *     responses:
	 *       200:
	 *         description: User route retrieved successfully
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 payload:
	 *                   type: object
	 *                   properties:
	 *                     data:
	 *                       $ref: '#/components/schemas/UserRouteResponseDto'
	 *             example:
	 *               payload:
	 *                 data:
	 *                   id: 1
	 *                   routeId: 7
	 *                   userId: 1
	 *                   status: "active"
	 *                   startedAt: "2025-08-21T16:37:51.437Z"
	 *                   completedAt: null
	 *                   actualGeometry:
	 *                     type: "LineString"
	 *                     coordinates: [[30.528909, 50.455232], [30.528209, 50.415232]]
	 *                   plannedGeometry:
	 *                     type: "LineString"
	 *                     coordinates: [[30.528909, 50.455232], [30.528209, 50.415232]]
	 */
	public async getByRouteId(
		options: APIHandlerOptions<{
			query: UserRouteQueryRequestDto;
		}>,
	): Promise<APIHandlerResponse<UserRouteResponseDto>> {
		const { query, user } = options;
		const { routeId } = query;
		const { id: userId } = user as UserAuthResponseDto;

		const userRoute = await this.userRouteService.getOne({
			routeId,
			userId,
		});

		return {
			payload: { data: userRoute },
			status: HTTPCode.OK,
		};
	}

	/**
	 * @swagger
	 * /user-routes/popular:
	 *   get:
	 *     security:
	 *       - bearerAuth: []
	 *     tags:
	 *       - User Routes
	 *     summary: Get all popular routes
	 *     description: Get top 10 completed routes by absolute amount.
	 *     responses:
	 *       200:
	 *         description: User routes retrieved successfully
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *             example:
	 *               payload:
	 *                 data:
	 *                   - id: 1
	 *                     routeId: 7
	 *                     plannedGeometry:
	 *                       type: "LineString"
	 *                       coordinates: [[30.528909, 50.455232], [30.528209, 50.415232]]
	 *                   - id: 2
	 *                     routeId: 8
	 *                     plannedGeometry:
	 *                       type: "LineString"
	 *                       coordinates: [[30.528909, 50.455232], [30.528209, 50.415232]]
	 *                   - id: 3
	 *                     routeId: 9
	 *                     plannedGeometry:
	 *                       type: "LineString"
	 *                       coordinates: [[30.528909, 50.455232], [30.528209, 50.415232]]
	 */

	public async getPopular(): Promise<
		APIHandlerResponse<UserRouteResponseDto[]>
	> {
		const popular = await this.userRouteService.getPopularRoutes();

		return {
			payload: { data: popular },
			status: HTTPCode.OK,
		};
	}

	/**
	 * @swagger
	 * /user-routes/start:
	 *   patch:
	 *     security:
	 *       - bearerAuth: []
	 *     tags:
	 *       - User Routes
	 *     summary: Start a user route
	 *     description: Start a user route by changing status from not_started to active and setting started_at timestamp. User ID is derived from JWT token.
	 *     parameters:
	 *       - in: query
	 *         name: routeId
	 *         required: true
	 *         schema:
	 *           type: integer
	 *         description: ID of the route to start
	 *         example: 7
	 *     responses:
	 *       200:
	 *         description: User route started successfully
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 payload:
	 *                   type: object
	 *                   properties:
	 *                     data:
	 *                       $ref: '#/components/schemas/UserRouteResponseDto'
	 *             example:
	 *               payload:
	 *                 data:
	 *                   id: 1
	 *                   routeId: 7
	 *                   userId: 1
	 *                   status: "active"
	 *                   startedAt: "2025-08-21T16:37:51.437Z"
	 *                   completedAt: null
	 *                   actualGeometry:
	 *                     type: "LineString"
	 *                     coordinates: [[30.528909, 50.455232], [30.528209, 50.415232]]
	 *                   plannedGeometry:
	 *                     type: "LineString"
	 *                     coordinates: [[30.528909, 50.455232], [30.528209, 50.415232]]
	 */

	public async start(
		options: APIHandlerOptions<{
			query: UserRouteQueryRequestDto;
		}>,
	): Promise<APIHandlerResponse<UserRouteResponseDto>> {
		const { query, user } = options;
		const { routeId } = query;
		const { id: userId } = user as UserAuthResponseDto;

		const updatedRoute = await this.userRouteService.start({
			routeId,
			userId,
		});

		return {
			payload: { data: updatedRoute },
			status: HTTPCode.OK,
		};
	}
}

export { UserRouteController };
