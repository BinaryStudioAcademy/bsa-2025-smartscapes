import { logger } from "~/libs/modules/logger/logger.js";

import { NotificationController } from "./notification.controller.js";
import { NotificationModel } from "./notification.model.js";
import { NotificationRepository } from "./notification.repository.js";
import { NotificationService } from "./notification.service.js";

const notificationRepository = new NotificationRepository(NotificationModel);
const notificaitonService = new NotificationService(notificationRepository);
const notificationController = new NotificationController(
	logger,
	notificaitonService,
);

export { notificationController };
