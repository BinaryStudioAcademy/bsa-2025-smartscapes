import { type MultipartFile } from "@fastify/multipart";

import { APIPath, HTTPCode, PermissionKey } from "~/libs/enums/enums.js";
import { checkHasPermission, setRateLimit } from "~/libs/hooks/hooks.js";
import {
	type APIHandlerOptions,
	type APIHandlerResponse,
	BaseController,
} from "~/libs/modules/controller/controller.js";
import { type Logger } from "~/libs/modules/logger/logger.js";

import { type PlannedPathResponseDto } from "../planned-paths/planned-paths.js";
import { RoutesApiPath } from "./libs/enums/enums.js";
import {
	type RouteConstructRequestDto,
	type RouteCreateRequestDto,
	type RouteFindAllOptions,
	type RouteGetAllItemResponseDto,
	type RouteGetByIdResponseDto,
	type RoutePatchRequestDto,
	type RouteUploadImageResponseDto,
} from "./libs/types/types.js";
import {
	routesConstructValidationSchema,
	routesCreateValidationSchema,
	routesSearchQueryValidationSchema,
	routesUpdateValidationSchema,
} from "./libs/validation-schemas/validation-schemas.js";
import { type RouteService } from "./route.service.js";

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
 *     GeometryLineString:
 *       type: object
 *       properties:
 *         coordinates:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Coordinate'
 *         type:
 *           type: string
 *           example: LineString
 *
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
 *         distance:
 *           type: number
 *           example: 36310.805
 *         duration:
 *           type: number
 *           example: 25940.671
 *         geometry:
 *           $ref: '#/components/schemas/GeometryLineString'
 *         pois:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: number
 *               visitOrder:
 *                 type: number
 *           example: [{id: 1, visitOrder: 0}, {id: 2, visitOrder: 1}]
 *         createdByUserId:
 *           type: number
 *
 *     RouteListItem:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           example: 1
 *         name:
 *           type: string
 *           example: "Landscape alley"
 *         distance:
 *           type: number
 *           example: 36310.805
 *
 *         duration:
 *           type: number
 *           example: 25940.671
 *         geometry:
 *           $ref: '#/components/schemas/GeometryLineString'
 *         pois:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: number
 *               visitOrder:
 *                 type: number
 *         createdByUserId:
 *           type: number
 *
 *     PlannedPath:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *         distance:
 *           type: number
 *           example: 36310.805
 *         duration:
 *           type: number
 *           example: 25940.671
 *         geometry:
 *           $ref: '#/components/schemas/GeometryLineString'
 */

class RouteController extends BaseController {
	private routeService: RouteService;

	public constructor(logger: Logger, routeService: RouteService) {
		super(logger, APIPath.ROUTES);

		this.routeService = routeService;

		const constructRequestsPerMinute = 5;

		this.addRoute({
			handler: this.constructRoute.bind(this),
			method: "POST",
			path: RoutesApiPath.CONSTRUCT,
			preHandlers: [
				setRateLimit(constructRequestsPerMinute),
				checkHasPermission(PermissionKey.MANAGE_ROUTES),
			],
			validation: {
				body: routesConstructValidationSchema,
			},
		});

		this.addRoute({
			handler: this.create.bind(this),
			method: "POST",
			path: RoutesApiPath.ROOT,
			preHandlers: [checkHasPermission(PermissionKey.MANAGE_ROUTES)],
			validation: { body: routesCreateValidationSchema },
		});

		this.addRoute({
			handler: this.uploadImage.bind(this),
			method: "POST",
			path: RoutesApiPath.$ID_IMAGES,
			preHandlers: [checkHasPermission(PermissionKey.MANAGE_ROUTES)],
		});

		this.addRoute({
			handler: this.deleteImage.bind(this),
			method: "DELETE",
			path: RoutesApiPath.$ID_IMAGES,
			preHandlers: [checkHasPermission(PermissionKey.MANAGE_ROUTES)],
		});

		this.addRoute({
			handler: this.delete.bind(this),
			method: "DELETE",
			path: RoutesApiPath.$ID,
			preHandlers: [checkHasPermission(PermissionKey.MANAGE_ROUTES)],
		});

		this.addRoute({
			handler: this.findById.bind(this),
			method: "GET",
			path: RoutesApiPath.$ID,
		});

		this.addRoute({
			handler: this.findAll.bind(this),
			method: "GET",
			path: RoutesApiPath.ROOT,
			validation: { query: routesSearchQueryValidationSchema },
		});

		this.addRoute({
			handler: this.patch.bind(this),
			method: "PATCH",
			path: RoutesApiPath.$ID,
			preHandlers: [checkHasPermission(PermissionKey.MANAGE_ROUTES)],
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
	 *       - Route
	 *     summary: Construct Mapbox route (requires manage_routes permission)
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             required:
	 *               - poiIds
	 *             properties:
	 *               poiIds:
	 *                 type: array
	 *                 items:
	 *                   type: integer
	 *                 minItems: 2
	 *                 description: Array of Point of Interest IDs to construct the route through
	 *                 example: [5, 1, 3]
	 *     responses:
	 *       200:
	 *         description: Route constructed successfully with planned path data
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 data:
	 *                   $ref: '#/components/schemas/PlannedPath'
	 */

	public async constructRoute({
		body: { poiIds },
	}: APIHandlerOptions<{
		body: RouteConstructRequestDto;
	}>): Promise<APIHandlerResponse<PlannedPathResponseDto>> {
		const data = await this.routeService.construct(poiIds);

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
	 *       - Route
	 *     summary: Create a new route (requires manage_routes permission)
	 *     description: Creates a new route. Requires authentication and manage_routes permission.
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             required:
	 *               - name
	 *               - description
	 *               - poiIds
	 *               - plannedPathId
	 *               - createdByUserId
	 *             properties:
	 *               name:
	 *                 type: string
	 *                 example: Landscape alley
	 *               description:
	 *                 type: string
	 *                 example: An alley with blooming flowers
	 *               poiIds:
	 *                 type: array
	 *                 items:
	 *                   type: number
	 *                 example: [4, 1, 3]
	 *               plannedPathId:
	 *                 type: number
	 *                 example: 2
	 *               createdByUserId:
	 *                 type: number
	 *                 example: 1
	 *     responses:
	 *       201:
	 *         description: The created route
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 data:
	 *                   $ref: '#/components/schemas/Route'
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
	 *                       example: "Unauthorized access"
	 *       403:
	 *         description: Forbidden - User lacks manage_routes permission
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
	 *                       example: "You don't have permission to perform this action."
	 */

	public async create(
		options: APIHandlerOptions<{
			body: RouteCreateRequestDto;
		}>,
	): Promise<APIHandlerResponse<RouteGetByIdResponseDto>> {
		const route = await this.routeService.create(options.body);

		return {
			payload: { data: route },
			status: HTTPCode.CREATED,
		};
	}

	/**
	 * @swagger
	 * /routes/{id}:
	 *   delete:
	 *     security:
	 *      - bearerAuth: []
	 *     tags:
	 *       - Route
	 *     summary: Delete a route (requires manage_routes permission)
	 *     description: Deletes an existing route. Requires authentication and manage_routes permission.
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
	 *                       example: "Unauthorized access"
	 *       403:
	 *         description: Forbidden - User lacks manage_routes permission
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
	 *                       example: "You don't have permission to perform this action."
	 */

	public async delete(
		options: APIHandlerOptions<{ params: { id: string } }>,
	): Promise<APIHandlerResponse<boolean>> {
		const id = Number(options.params.id);
		const isDeleted = await this.routeService.delete(id);

		return {
			payload: { data: isDeleted },
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
	 *       - Route
	 *     summary: Retrieve all routes with optional search by name
	 *     description: |
	 *       Get all routes, or only those whose names match the search query.
	 *
	 *       **Without query parameters**: Returns all routes.
	 *
	 *       **With query `name` parameter**: Returns routes whose names match the search query. Search is case-insensitive.
	 *       **With `latitude` and `longitude`**: Sorts routes by proximity to the provided coordinates (based on their first point of interest).
	 *     parameters:
	 *       - in: query
	 *         name: name
	 *         schema:
	 *           type: string
	 *           example: "landscape"
	 *       - in: query
	 *         name: latitude
	 *         schema:
	 *           type: number
	 *           format: float
	 *           example: 49.8397
	 *       - in: query
	 *         name: longitude
	 *         schema:
	 *           type: number
	 *           format: float
	 *           example: 24.0297
	 *       - in: query
	 *         name: categories
	 *         schema:
	 *           type: array
	 *           items:
	 *             type: string
	 *         style: form
	 *         explode: true
	 *         description: categories;
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
	 *                     $ref: '#/components/schemas/RouteListItem'
	 * */

	public async deleteImage(
		options: APIHandlerOptions<{
			params: { id: number };
		}>,
	): Promise<APIHandlerResponse<boolean>> {
		const id = Number(options.params.id);

		const isDeleted = await this.routeService.deleteImage(id);

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
	 *       - Route
	 *     summary: Get a route by ID
	 *     description: Retrieves a route by its ID. Requires authentication but no special permissions.
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
	 *                       example: "Unauthorized access"
	 */

	public async findAll(
		options: APIHandlerOptions<{
			query?: RouteFindAllOptions;
		}>,
	): Promise<APIHandlerResponse<RouteGetAllItemResponseDto[]>> {
		const { query = null } = options;

		const { items } = await this.routeService.findAll(query);

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
	 *       - Route
	 *     summary: Update a route (requires manage_routes permission)
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
	 *                       example: "Unauthorized access"
	 *       403:
	 *         description: Forbidden - User lacks manage_routes permission
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
	 *                       example: "You don't have permission to perform this action."
	 */

	public async findById(
		options: APIHandlerOptions<{ params: { id: string } }>,
	): Promise<APIHandlerResponse<RouteGetByIdResponseDto>> {
		const id = Number(options.params.id);

		const route = await this.routeService.findById(id);

		return {
			payload: { data: route },
			status: HTTPCode.OK,
		};
	}

	/**
	 * @swagger
	 * /routes/{id}/image:
	 *   post:
	 *     summary: Upload an image
	 *     description: Upload an image to the route
	 *     tags:
	 *       - Route
	 *     security:
	 *       - bearerAuth: []
	 *     parameters:
	 *       - in: path
	 *         name: id
	 *         required: true
	 *         schema:
	 *           type: string
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         multipart/form-data:
	 *           schema:
	 *             type: object
	 *             required:
	 *               - file
	 *             properties:
	 *               file:
	 *                 type: string
	 *                 format: binary
	 *                 description: File to upload (image/jpeg or image/png)
	 *     responses:
	 *       201:
	 *         description: Image uploaded succesfully
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 data:
	 *                   $ref: '#/components/schemas/FileUploadResponseDto'
	 */

	public async patch(
		options: APIHandlerOptions<{
			body: RoutePatchRequestDto;
			params: { id: string };
		}>,
	): Promise<APIHandlerResponse<RouteGetByIdResponseDto>> {
		const id = Number(options.params.id);
		const { description, name } = options.body;

		const route = await this.routeService.patch(id, {
			description,
			name,
		});

		return {
			payload: { data: route },
			status: HTTPCode.OK,
		};
	}

	/**
	 * @swagger
	 * /files/{id}/image:
	 *   delete:
	 *     security:
	 *       - bearerAuth: []
	 *     tags: [Files]
	 *     summary: Delete a file
	 *     parameters:
	 *       - in: path
	 *         name: id
	 *         required: true
	 *         schema:
	 *           type: string
	 *     responses:
	 *       200:
	 *         description: File deleted successfully
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 data:
	 *                   type: boolean
	 */

	public async uploadImage(
		options: APIHandlerOptions<{
			body: {
				file: MultipartFile;
			};
			params: { id: string };
		}>,
	): Promise<APIHandlerResponse<RouteUploadImageResponseDto>> {
		const id = Number(options.params.id);

		const image = await this.routeService.uploadImage(id, options.body.file);

		return {
			payload: { data: image },
			status: HTTPCode.OK,
		};
	}
}
export { RouteController };
