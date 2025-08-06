import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import {
	App,
	Dashboard,
	ProtectedRoute,
	RouterProvider,
	StoreProvider,
	ToastContainer,
} from "~/libs/components/components.js";
import { AppRoute } from "~/libs/enums/enums.js";
import { pwa } from "~/libs/modules/pwa/pwa.js";
import { store } from "~/libs/modules/store/store.js";
import { Auth } from "~/pages/auth/auth.jsx";
import { NotFound } from "~/pages/not-found/not-found.jsx";

import { Landing } from "./pages/landing/landing.jsx";

pwa.register();

createRoot(document.querySelector("#root") as HTMLElement).render(
	<StrictMode>
		<StoreProvider store={store.instance}>
			<RouterProvider
				routes={[
					{
						children: [
							{
								element: <Auth />,
								path: AppRoute.SIGN_IN,
							},
							{
								element: <Auth />,
								path: AppRoute.SIGN_UP,
							},
							{
								element: (
									<ProtectedRoute>
										<Dashboard />
									</ProtectedRoute>
								),
								path: AppRoute.APP,
							},
						],
						element: <App />,
						path: AppRoute.APP,
					},
					{
						element: <Landing />,
						path: AppRoute.ROOT,
					},
					{
						element: <NotFound />,
						path: "*",
					},
				]}
			/>
			<ToastContainer />
		</StoreProvider>
	</StrictMode>,
);
