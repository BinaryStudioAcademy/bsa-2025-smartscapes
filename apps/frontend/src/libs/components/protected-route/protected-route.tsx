import { Navigate } from "react-router";

import { AppRoute } from "~/libs/enums/app-route.enum.js";
import { type PermissionKey } from "~/libs/enums/enums.js";
import { checkHasPermission } from "~/libs/helpers/helpers.js";
import { useAppSelector } from "~/libs/hooks/hooks.js";
import { type ValueOf } from "~/libs/types/types.js";
import { NotFound } from "~/pages/not-found/not-found.js";

type Properties = {
	children: React.JSX.Element;
	routePermissions?: ValueOf<typeof PermissionKey>[];
};

const ProtectedRoute = ({
	children,
	routePermissions,
}: Properties): React.JSX.Element => {
	const authenticatedUser = useAppSelector(
		({ auth }) => auth.authenticatedUser,
	);

	const hasPermission = checkHasPermission(
		routePermissions ?? [],
		authenticatedUser?.group.permissions ?? [],
	);

	if (!authenticatedUser) {
		return <Navigate replace to={AppRoute.SIGN_IN} />;
	}

	if (!hasPermission) {
		return <NotFound />;
	}

	return <>{children}</>;
};

export { ProtectedRoute };
