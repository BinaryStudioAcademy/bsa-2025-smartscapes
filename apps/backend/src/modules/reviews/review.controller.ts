import { APIPath } from "~/libs/enums/enums.js";
import {
	type APIHandlerOptions,
	type APIHandlerResponse,
	BaseController,
} from "~/libs/modules/controller/controller.js";
import { HTTPCode } from "~/libs/modules/http/http.js";
import { type Logger } from "~/libs/modules/logger/logger.js";
import { type ReviewService } from "~/modules/reviews/review.service.js";

import {
	type ReviewRequestDto,
	type ReviewResponseDto,
} from "./libs/types/types.js";
import { reviewCreateValidationSchema } from "./libs/validation-schemas/validation-schemas.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     Reviews:
 *       type: object
 *       required:
 *         - userId
 *         - content
 *       properties:
 *         id:
 *           type: integer
 *         userId:
 *           type: integer
 *         content:
 *           type: string
 *           example: "This is a review content."
 *         likesCount:
 *           type: integer
 *         routeId:
 *           type: integer
 *           nullable: true
 *         poiId:
 *           type: integer
 *           nullable: true
 *       oneOf:
 *         - required: [routeId]
 *         - required: [poiId]
 */

class ReviewController extends BaseController {
	private reviewService: ReviewService;

	public constructor(logger: Logger, reviewService: ReviewService) {
		super(logger, APIPath.REVIEWS);
		this.reviewService = reviewService;

		this.addRoute({
			handler: this.create.bind(this),
			method: "POST",
			path: "/",
			validation: {
				body: reviewCreateValidationSchema,
			},
		});

		this.addRoute({
			handler: this.findAll.bind(this),
			method: "GET",
			path: "/",
		});
	}

	/**
	 * @swagger
	 * /reviews:
	 *   post:
	 *     tags:
	 *       - Reviews
	 *     summary: Create a new review
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             required:
	 *               - userId
	 *               - content
	 *             properties:
	 *               userId:
	 *                 type: integer
	 *               content:
	 *                 type: string
	 *               routeId:
	 *                 type: integer
	 *                 nullable: true
	 *               poiId:
	 *                 type: integer
	 *                 nullable: true
	 *             oneOf:
	 *               - required: [routeId]
	 *               - required: [poiId]
	 *     responses:
	 *       201:
	 *         description: Review created successfully
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/Reviews'
	 *       400:
	 *         description: Bad Request - missing or invalid parameters (e.g., neither routeId nor poiId provided)
	 */

	public async create(
		options: APIHandlerOptions<{ body: ReviewRequestDto }>,
	): Promise<APIHandlerResponse<ReviewResponseDto>> {
		const { body } = options;
		const review = await this.reviewService.create(body);

		return {
			payload: { data: review },
			status: HTTPCode.OK,
		};
	}

	/**
	 * @swagger
	 * /reviews:
	 *   get:
	 *     tags:
	 *       - Reviews
	 *     summary: Retrieve all reviews
	 *     responses:
	 *       200:
	 *         description: A list of reviews
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 data:
	 *                   type: array
	 *                   items:
	 *                     $ref: '#/components/schemas/Reviews'
	 */
	public async findAll(): Promise<APIHandlerResponse<ReviewResponseDto[]>> {
		const { items } = await this.reviewService.findAll();

		return {
			payload: { data: items },
			status: HTTPCode.OK,
		};
	}
}

export { ReviewController };
