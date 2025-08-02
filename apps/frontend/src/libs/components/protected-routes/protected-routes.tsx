import { Navigate, Outlet, useLocation } from "react-router";

import { AppRoute } from "~/libs/enums/app-route.enum.js";
import { useAppSelector } from "~/libs/hooks/hooks.js";

const ProtectedRoutes = (): React.JSX.Element => {
	const { pathname } = useLocation();

	const authenticatedUser = useAppSelector(
		({ auth }) => auth.authenticatedUser,
	);

	if (pathname === AppRoute.SIGN_IN || pathname === AppRoute.SIGN_UP) {
		return <Outlet />;
	}

	const isAuthenticated = Boolean(authenticatedUser);

	return isAuthenticated ? (
		<Outlet />
	) : (
		<Navigate replace to={AppRoute.SIGN_IN} />
	);
};

export { ProtectedRoutes };
