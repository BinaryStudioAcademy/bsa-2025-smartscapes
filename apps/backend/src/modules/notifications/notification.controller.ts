import { APIPath } from "~/libs/enums/enums.js";
import {
	type APIHandlerOptions,
	type APIHandlerResponse,
	BaseController,
} from "~/libs/modules/controller/controller.js";
import { HTTPCode } from "~/libs/modules/http/http.js";
import { type Logger } from "~/libs/modules/logger/logger.js";
import {
	NotificationApiPath,
	NotificationExceptionMessage,
} from "~/modules/notifications/libs/enums/enums.js";
import { NotificationError } from "~/modules/notifications/libs/exceptions/exceptions.js";
import {
	type NotificationCreateRequestDto,
	type NotificationGetAllItemResponseDto,
} from "~/modules/notifications/libs/types/types.js";
import { notificationCreateValidationSchema } from "~/modules/notifications/libs/validation-schemas/validation-schemas.js";
import { type NotificationService } from "~/modules/notifications/notification.service.js";

class NotificationController extends BaseController {
	private notificationService: NotificationService;

	public constructor(logger: Logger, notificationService: NotificationService) {
		super(logger, APIPath.NOTIFICATIONS);

		this.notificationService = notificationService;

		this.addRoute({
			handler: this.create.bind(this),
			method: "POST",
			path: NotificationApiPath.ROOT,
			validation: {
				body: notificationCreateValidationSchema,
			},
		});

		this.addRoute({
			handler: this.findAllByUserId.bind(this),
			method: "GET",
			path: NotificationApiPath.ROOT,
		});
	}

	/**
	 * @swagger
	 * /notifications:
	 *   post:
	 *     tags:
	 *       - Notifications
	 *     summary: Create a new notification
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             $ref: '#/components/schemas/NotificationCreateRequestDto'
	 *     responses:
	 *       201:
	 *         description: Notification created successfully
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/NotificationGetAllItemResponseDto'
	 */
	public async create(
		options: APIHandlerOptions<{
			body: NotificationCreateRequestDto;
		}>,
	): Promise<APIHandlerResponse<NotificationGetAllItemResponseDto>> {
		const { body } = options;

		const notification = await this.notificationService.create(body);

		return {
			payload: { data: notification },
			status: HTTPCode.CREATED,
		};
	}

	/**
	 * @swagger
	 * /notifications:
	 *   get:
	 *     tags:
	 *       - Notifications
	 *     summary: Get all notifications for the current user
	 *     security:
	 *       - bearerAuth: []
	 *     responses:
	 *       200:
	 *         description: A list of notifications
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 data:
	 *                   type: object
	 *                   properties:
	 *                     items:
	 *                       type: array
	 *                       items:
	 *                         $ref: '#/components/schemas/NotificationGetAllItemResponseDto'
	 */
	public async findAllByUserId(
		options: APIHandlerOptions,
	): Promise<
		APIHandlerResponse<{ items: NotificationGetAllItemResponseDto[] }>
	> {
		if (!options.user) {
			throw new NotificationError({
				message: NotificationExceptionMessage.NOTIFICATION_UNAUTHORIZED,
				status: HTTPCode.UNAUTHORIZED,
			});
		}

		const userId = options.user.id;

		if (!userId) {
			throw new NotificationError({
				message: NotificationExceptionMessage.NOTIFICATION_UNAUTHORIZED,
				status: HTTPCode.UNAUTHORIZED,
			});
		}

		const { items } = await this.notificationService.findAllByUserId(userId);

		return {
			payload: { data: { items } },
			status: HTTPCode.OK,
		};
	}
}

export { NotificationController };
