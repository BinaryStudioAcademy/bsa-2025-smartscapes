import { APIPath } from "~/libs/enums/enums.js";
import {
	type APIHandlerOptions,
	type APIHandlerResponse,
	BaseController,
} from "~/libs/modules/controller/controller.js";
import { HTTPCode } from "~/libs/modules/http/http.js";
import { type Logger } from "~/libs/modules/logger/logger.js";
import { type RouteCategoryService } from "~/modules/route-categories/route-category.service.js";

import { RouteCategoriesApiPath } from "./libs/enums/enums.js";
import {
	type RouteCategoryGetAllItemResponseDto,
	type RouteCategoryRequestDto,
} from "./libs/types/types.js";

/**
 * @swagger
 * components:
 *    schemas:
 *     RouteCategoryRequestDto:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           example: Popular
 *
 *     RouteCategory:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *           example: Popular
 */

class RouteCategoryController extends BaseController {
	private routeCategoryService: RouteCategoryService;

	public constructor(
		logger: Logger,
		routeCategoryService: RouteCategoryService,
	) {
		super(logger, APIPath.ROUTE_CATEGORIES);
		this.routeCategoryService = routeCategoryService;

		this.addRoute({
			handler: this.create.bind(this),
			method: "POST",
			path: RouteCategoriesApiPath.ROOT,
		});

		this.addRoute({
			handler: this.findAll.bind(this),
			method: "GET",
			path: RouteCategoriesApiPath.ROOT,
		});
	}

	/**
	 * @swagger
	 * /route-categories:
	 *   post:
	 *     security:
	 *       - bearerAuth: []
	 *     tags:
	 *       - RouteCategories
	 *     summary: Create new route category
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             $ref: '#/components/schemas/RouteCategoryRequestDto'
	 *     responses:
	 *       201:
	 *         description: New route category object
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 data:
	 *                   type: object
	 *                   $ref: '#/components/schemas/RouteCategory'
	 *
	 *   get:
	 *     tags:
	 *       - RouteCategories
	 *     summary: Retrieve all route categories
	 *     responses:
	 *       200:
	 *         description: A list of route categories
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 data:
	 *                   type: array
	 *                   items:
	 *                     $ref: '#/components/schemas/RouteCategory'
	 */

	public async create(
		options: APIHandlerOptions<{
			body: RouteCategoryRequestDto;
		}>,
	): Promise<APIHandlerResponse<RouteCategoryGetAllItemResponseDto>> {
		const { body } = options;

		const item = await this.routeCategoryService.create(body);

		return {
			payload: { data: item },
			status: HTTPCode.CREATED,
		};
	}

	/**
	 * @swagger
	 * /route-categories:
	 *   get:
	 *     security:
	 *       - bearerAuth: []
	 *     tags:
	 *       - RouteCategories
	 *     summary: Retrieve all route categories
	 *     responses:
	 *       200:
	 *         description: A list of route categories
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 data:
	 *                   type: array
	 *                   items:
	 *                     $ref: '#/components/schemas/RouteCategory'
	 */

	public async findAll(): Promise<
		APIHandlerResponse<RouteCategoryGetAllItemResponseDto[]>
	> {
		const { items } = await this.routeCategoryService.findAll();

		return {
			payload: { data: items },
			status: HTTPCode.OK,
		};
	}
}

export { RouteCategoryController };
