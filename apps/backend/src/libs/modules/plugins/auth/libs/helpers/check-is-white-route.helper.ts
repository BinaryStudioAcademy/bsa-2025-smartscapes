import { type HTTPMethod } from "~/libs/types/types.js";

import { type WhiteRoute } from "../../auth.plugin.js";

type CheckIsWhiteRouteParameters = {
	method: HTTPMethod;
	url: string;
	whiteRoutes: WhiteRoute[];
};

const checkIsWhiteRoute = ({
	method,
	url,
	whiteRoutes,
}: CheckIsWhiteRouteParameters): boolean => {
	const apiUrlRegex = /^\/api\/v\d+(\/.+)$/;
	const match = url.match(apiUrlRegex);
	const [, route] = match ?? [];

	if (!route) {
		return true;
	}

	return whiteRoutes.some(({ method: _method, path }) => {
		if (_method !== method) {
			return false;
		}

		const rootPathCritea = "/*";
		const isRootPath = path.includes(rootPathCritea);

		if (!isRootPath) {
			return url === path;
		}

		const rootPath = path.replace(rootPathCritea, "");

		return url.startsWith(rootPath);
	});
};

export { checkIsWhiteRoute };
