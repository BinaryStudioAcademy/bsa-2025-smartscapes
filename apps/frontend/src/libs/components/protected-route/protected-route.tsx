import { Navigate } from "react-router";

import { AppRoute } from "~/libs/enums/app-route.enum.js";
import { useAppSelector } from "~/libs/hooks/hooks.js";

type Properties = {
	children: React.JSX.Element;
};

const ProtectedRoute = ({ children }: Properties): React.JSX.Element => {
	const authenticatedUser = useAppSelector(
		({ auth }) => auth.authenticatedUser,
	);

	if (!authenticatedUser) {
		return <Navigate replace to={AppRoute.SIGN_IN} />;
	}

	return <>{children}</>;
};

export { ProtectedRoute };
