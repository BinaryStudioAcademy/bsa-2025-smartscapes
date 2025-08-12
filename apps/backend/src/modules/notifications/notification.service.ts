import { type CollectionResult, type Service } from "~/libs/types/types.js";
import {
	type NotificationCreateRequestDto,
	type NotificationGetAllItemResponseDto,
} from "~/modules/notifications/libs/types/types.js";
import { NotificationEntity } from "~/modules/notifications/notification.entity.js";
import { type NotificationRepository } from "~/modules/notifications/notification.repository.js";

class NotificationService implements Service {
	private notificationRepository: NotificationRepository;

	public constructor(notificationRepository: NotificationRepository) {
		this.notificationRepository = notificationRepository;
	}

	public async create(
		payload: NotificationCreateRequestDto,
	): Promise<NotificationGetAllItemResponseDto> {
		const notification = await this.notificationRepository.create(
			NotificationEntity.initializeNew(payload),
		);

		return notification.toObject();
	}

	public async findAllByUserId(
		userId: number,
	): Promise<CollectionResult<NotificationGetAllItemResponseDto>> {
		const notifications =
			await this.notificationRepository.findAllByUserId(userId);

		return {
			items: notifications.map((notification) => notification.toObject()),
		};
	}
}

export { NotificationService };
