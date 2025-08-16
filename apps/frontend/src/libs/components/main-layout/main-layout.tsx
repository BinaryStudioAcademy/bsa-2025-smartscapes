import { type JSX, type PropsWithChildren } from "react";
import { useLocation } from "react-router";

import { Header } from "~/libs/components/header/header.js";
import { Sidebar } from "~/libs/components/sidebar/sidebar.js";
import { NAVIGATION_ITEMS_GROUPS } from "~/libs/constants/constants.js";
import { type AppRoute } from "~/libs/enums/app-route.enum.js";
import { useAppSelector } from "~/libs/hooks/hooks.js";
import { type ValueOf } from "~/libs/types/types.js";

type Properties = PropsWithChildren & {
	layoutExclude: ValueOf<typeof AppRoute>[];
};

const MainLayout = ({ children, layoutExclude }: Properties): JSX.Element => {
	const { pathname } = useLocation();
	const user = useAppSelector(({ auth }) => auth.authenticatedUser);
	const isLayoutInclude = !layoutExclude.some((excludedPath) =>
		pathname.endsWith(excludedPath),
	);

	return (
		<>
			{isLayoutInclude && (
				<>
					<Header actions={[]} user={user} />
					{user && <Sidebar navigationItemsGroups={NAVIGATION_ITEMS_GROUPS} />}
				</>
			)}
			{children}
		</>
	);
};

export { MainLayout };
