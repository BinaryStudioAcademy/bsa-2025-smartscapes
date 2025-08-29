import { z } from "zod";

import { UserRouteStatus } from "../libs/enums/enums.js";

const userRouteGetAll = z.object({
	status: z.enum(Object.values(UserRouteStatus)).optional(),
});

export { userRouteGetAll };
