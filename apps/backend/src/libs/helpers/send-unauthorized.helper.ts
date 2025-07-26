import { type FastifyReply } from "fastify";

import { CommonExceptionMessage, HTTPCode } from "~/libs/enums/enums.js";
import { HTTPError } from "~/libs/exceptions/exceptions.js";

const sendUnathorized = (reply: FastifyReply): void => {
	const { UNAUTHORIZED: status } = HTTPCode;
	const error = new HTTPError({
		message: CommonExceptionMessage.UNAUTHORIZED,
		status,
	});
	reply.status(status).send(error);
};

export { sendUnathorized };
