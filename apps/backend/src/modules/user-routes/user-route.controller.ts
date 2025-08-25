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
	type UserRouteCreateRequestDto,
	type UserRoutePatchRequestDto,
	type UserRouteResponseDto,
} from "./libs/types/type.js";
import {
	userRouteCreateValidationSchema,
	userRoutePatchValidationSchema,
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
 *     UserRouteCreateRequestDto:
 *       type: object
 *       required:
 *         - routeId
 *       properties:
 *         routeId:
 *           type: integer
 *           example: 7
 *           description: ID of the route to track
 *
 *     UserRoutePatchRequestDto:
 *       type: object
 *       required:
 *         - routeId
 *         - actualGeometry
 *       properties:
 *         routeId:
 *           type: integer
 *           example: 7
 *           description: ID of the route being finished
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
			path: UserRouteApiPath.ROOT,
			validation: {
				body: userRouteCreateValidationSchema,
			},
		});

		this.addRoute({
			handler: this.finish.bind(this),
			method: "PATCH",
			path: UserRouteApiPath.FINISH,
			validation: {
				body: userRoutePatchValidationSchema,
			},
		});

		this.addRoute({
			handler: this.start.bind(this),
			method: "PATCH",
			path: UserRouteApiPath.START,
			validation: {
				body: userRouteCreateValidationSchema,
			},
		});

		this.addRoute({
			handler: this.getAllByUserId.bind(this),
			method: "GET",
			path: UserRouteApiPath.ROOT,
		});
	}

	/**
	 * @swagger
	 * /user-routes:
	 *   post:
	 *     security:
	 *       - bearerAuth: []
	 *     tags:
	 *       - User Routes
	 *     summary: Create a new user route
	 *     description: Create a new user route for tracking user's journey through a specific route. User ID is derived from JWT token.
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             $ref: '#/components/schemas/UserRouteCreateRequestDto'
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
	 *   get:
	 *     security:
	 *       - bearerAuth: []
	 *     tags:
	 *       - User Routes
	 *     summary: Get all user routes
	 *     description: Get all user routes for the authenticated user including their status, timestamps, and geometry information. User ID is derived from JWT token.
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
	public async create(
		options: APIHandlerOptions<{
			body: UserRouteCreateRequestDto;
		}>,
	): Promise<APIHandlerResponse<UserRouteResponseDto>> {
		const { body, user } = options;
		const { routeId } = body;
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
	 * /user-routes/finish:
	 *   patch:
	 *     security:
	 *       - bearerAuth: []
	 *     tags:
	 *       - User Routes
	 *     summary: Finish a user route
	 *     description: Finish a user route by providing the actual geometry traveled and updating status to completed. User ID is derived from JWT token.
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             $ref: '#/components/schemas/UserRoutePatchRequestDto'
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
			body: UserRoutePatchRequestDto;
		}>,
	): Promise<APIHandlerResponse<UserRouteResponseDto>> {
		const { body, user } = options;
		const { actualGeometry, routeId } = body;
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

	public async getAllByUserId(
		options: APIHandlerOptions,
	): Promise<APIHandlerResponse<UserRouteResponseDto[]>> {
		const { user } = options;
		const { id: userId } = user as UserAuthResponseDto;

		const userRoutes = await this.userRouteService.getAllByUserId(userId);

		return {
			payload: { data: userRoutes },
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
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             $ref: '#/components/schemas/UserRouteCreateRequestDto'
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
			body: UserRouteCreateRequestDto;
		}>,
	): Promise<APIHandlerResponse<UserRouteResponseDto>> {
		const { body, user } = options;
		const { id: userId } = user as UserAuthResponseDto;
		const { routeId } = body;

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
