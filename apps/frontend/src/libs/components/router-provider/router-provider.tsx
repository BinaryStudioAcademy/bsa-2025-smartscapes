import {
	createBrowserRouter,
	RouterProvider as LibraryRouterProvider,
	type RouteObject,
} from "react-router";

type Properties = {
	routes: RouteObject[];
};

const RouterProvider = ({ routes }: Properties): React.JSX.Element => (
	<LibraryRouterProvider router={createBrowserRouter(routes)} />
);

export { RouterProvider };
