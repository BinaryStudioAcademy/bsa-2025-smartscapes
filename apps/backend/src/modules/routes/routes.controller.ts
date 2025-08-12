import { APIPath, HTTPCode } from "~/libs/enums/enums.js";
import { setRateLimit } from "~/libs/hooks/hooks.js";
import {
	type APIHandlerOptions,
	type APIHandlerResponse,
	BaseController,
} from "~/libs/modules/controller/controller.js";
import { type Logger } from "~/libs/modules/logger/logger.js";

import { RouteApiPath } from "./libs/enums/enums.js";
import {
	type RoutesRequestConstructDto,
	type RoutesRequestCreateDto,
	type RoutesRequestPatchDto,
	type RoutesResponseConstructDto,
	type RoutesResponseDto,
} from "./libs/types/types.js";
import {
	routesConstructValidationSchema,
	routesCreateValidationSchema,
	routesUpdateValidationSchema,
} from "./libs/validation-schemas/validation-schemas.js";
import { type RoutesService } from "./routes.service.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     Coordinate:
 *       type: array
 *       items:
 *         type: number
 *       minItems: 2
 *       maxItems: 2
 *       example: [30.5, 50.4]
 *
 *     GetMapboxRouteResponseDto:
 *       type: object
 *       properties:
 *         routes:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/MapboxRoute'
 *         internalId:
 *           type: string
 *
 *     MapboxRoute:
 *       type: object
 *       properties:
 *         distance:
 *           type: number
 *         duration:
 *           type: number
 *         geometry:
 *           type: object
 *           properties:
 *             coordinates:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Coordinate'
 *             type:
 *               type: string
 *     Route:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *         name:
 *           type: string
 *           example: Landscape alley
 *         description:
 *           type: string
 *           example: An alley with blooming flowers
 *         pois:
 *           type: object
 *           example: [{id: 1, visitOrder: 0}, {id: 2, visitOrder: 1}]
 *
 */

class RoutesController extends BaseController {
	private routesService: RoutesService;

	public constructor(logger: Logger, routesService: RoutesService) {
		super(logger, APIPath.ROUTES);

		this.routesService = routesService;

		const constructRequestsPerMinute = 5;
		this.addRoute({
			handler: this.constructRoute.bind(this),
			method: "POST",
			path: RouteApiPath.CONSTRUCT,
			preHandlers: [setRateLimit(constructRequestsPerMinute)],
			validation: {
				body: routesConstructValidationSchema,
			},
		});

		this.addRoute({
			handler: this.create.bind(this),
			method: "POST",
			path: "/",
			validation: { body: routesCreateValidationSchema },
		});

		this.addRoute({
			handler: this.delete.bind(this),
			method: "DELETE",
			path: "/:id",
		});

		this.addRoute({
			handler: this.find.bind(this),
			method: "GET",
			path: "/:id",
		});

		this.addRoute({
			handler: this.findAll.bind(this),
			method: "GET",
			path: "/",
		});

		this.addRoute({
			handler: this.patch.bind(this),
			method: "PATCH",
			path: "/:id",
			validation: { body: routesUpdateValidationSchema },
		});
	}

	/**
	 * @swagger
	 * /routes/construct:
	 *   post:
	 *     security:
	 *       - bearerAuth: []
	 *     tags:
	 *       - Routes
	 *     summary: Construct Mapbox route
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             required:
	 *               - pointsOfInterest
	 *             properties:
	 *               pointsOfInterest:
	 *                 type: array
	 *                 items:
	 *                   type: integer
	 *                 example: [1, 2]
	 *     responses:
	 *       200:
	 *         description: Mapbox service response
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 data:
	 *                   $ref: '#/components/schemas/GetMapboxRouteResponseDto'
	 */

	public async constructRoute({
		body: { pointsOfInterest },
	}: APIHandlerOptions<{ body: RoutesRequestConstructDto }>): Promise<
		APIHandlerResponse<RoutesResponseConstructDto>
	> {
		const data = await this.routesService.construct(pointsOfInterest);

		return {
			payload: { data },
			status: HTTPCode.OK,
		};
	}

	/**
	 * @swagger
	 * /routes:
	 *   post:
	 *     security:
	 *       - bearerAuth: []
	 *     tags:
	 *       - Routes
	 *     summary: Create a new route
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             required:
	 *               - name
	 *               - description
	 *               - pois
	 *             properties:
	 *               name:
	 *                 type: string
	 *                 example: Landscape alley
	 *               description:
	 *                 type: string
	 *                 example: An alley with blooming flowers
	 *               pois:
	 *                 type: array
	 *                 items:
	 *                   type: number
	 *                 example: [1, 2]
	 *     responses:
	 *       200:
	 *         description: The created route
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/Route'
	 */

	public async create(
		options: APIHandlerOptions<{
			body: RoutesRequestCreateDto;
		}>,
	): Promise<APIHandlerResponse<RoutesResponseDto>> {
		const { description, name, pois } = options.body;

		const route = await this.routesService.create({ description, name, pois });

		return {
			payload: { data: route },
			status: HTTPCode.OK,
		};
	}

	/**
	 * @swagger
	 * /routes/{id}:
	 *   delete:
	 *     security:
	 *      - bearerAuth: []
	 *     tags:
	 *       - Routes
	 *     summary: Delete a route
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
	 */

	public async delete(
		options: APIHandlerOptions<{ params: { id: string } }>,
	): Promise<APIHandlerResponse<boolean>> {
		const id = Number(options.params.id);
		const isDeleted = await this.routesService.delete(id);

		return {
			payload: { data: isDeleted },
			status: HTTPCode.OK,
		};
	}

	/**
	 * @swagger
	 * /routes/{id}:
	 *   get:
	 *     security:
	 *      - bearerAuth: []
	 *     tags:
	 *       - Routes
	 *     summary: Get a route
	 *     parameters:
	 *       - in: path
	 *         name: id
	 *         required: true
	 *         schema:
	 *           type: string
	 *     responses:
	 *       200:
	 *         description: Route was found successfully
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 data:
	 *                   type: object
	 *                   $ref: '#/components/schemas/Route'
	 */

	public async find(
		options: APIHandlerOptions<{ params: { id: string } }>,
	): Promise<APIHandlerResponse<RoutesResponseDto>> {
		const id = Number(options.params.id);

		const route = await this.routesService.findById(id);

		return {
			payload: { data: route },
			status: HTTPCode.OK,
		};
	}

	/**
	 * @swagger
	 * /routes:
	 *   get:
	 *     security:
	 *      - bearerAuth:  []
	 *     tags:
	 *       - Routes
	 *     summary: Retrieve all routes
	 *     responses:
	 *       200:
	 *         description: A list of routes
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 data:
	 *                   type: array
	 *                   items:
	 *                     $ref: '#/components/schemas/Route'
	 * */

	public async findAll(): Promise<APIHandlerResponse<RoutesResponseDto[]>> {
		const { items } = await this.routesService.findAll();

		return {
			payload: { data: items },
			status: HTTPCode.OK,
		};
	}

	/**
	 * @swagger
	 * /routes/{id}:
	 *   patch:
	 *     security:
	 *      - bearerAuth: []
	 *     tags:
	 *       - Routes
	 *     summary: Update a route
	 *     parameters:
	 *       - in: path
	 *         name: id
	 *         required: true
	 *         schema:
	 *           type: string
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             required:
	 *               - name
	 *               - description
	 *             properties:
	 *               name:
	 *                 type: string
	 *                 example: Scenic walk
	 *               description:
	 *                 type: string
	 *                 example: A calm stroll in countryside
	 *     responses:
	 *       200:
	 *         description: Route updated successfully
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 data:
	 *                   $ref: '#/components/schemas/Route'
	 */

	public async patch(
		options: APIHandlerOptions<{
			body: RoutesRequestPatchDto;
			params: { id: string };
		}>,
	): Promise<APIHandlerResponse<RoutesResponseDto>> {
		const id = Number(options.params.id);
		const { description, name } = options.body;

		const route = await this.routesService.patch(id, {
			description,
			name,
		});

		return {
			payload: { data: route },
			status: HTTPCode.OK,
		};
	}
}
export { RoutesController };
