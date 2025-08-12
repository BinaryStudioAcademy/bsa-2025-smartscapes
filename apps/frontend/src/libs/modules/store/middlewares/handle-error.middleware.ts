import { isRejected, type Middleware } from "@reduxjs/toolkit";

import { CommonExceptionMessage } from "~/libs/enums/enums.js";
import { type ExtraArguments } from "~/libs/modules/store/libs/types/types.js";

const handleError = ({ toastNotifier }: ExtraArguments): Middleware => {
	return () => {
		return (next) => (action) => {
			if (isRejected(action)) {
				toastNotifier.showError(
					action.error.message ??
						CommonExceptionMessage.COMMON_EXCEPTION_MESSAGE,
				);
			}

			return next(action);
		};
	};
};

export { handleError as handleErrorMiddleware };
