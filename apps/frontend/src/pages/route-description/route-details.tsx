import { Loader } from "~/libs/components/components.js";
import { DataStatus } from "~/libs/enums/enums.js";
import {
	useAppDispatch,
	useAppSelector,
	useEffect,
	useParams,
} from "~/libs/hooks/hooks.js";
import {
	actions as routeActions,
	type RouteGetByIdResponseDto,
} from "~/modules/routes/routes.js";
import { NotFound } from "~/pages/not-found/not-found.jsx";

import { ImageGallery } from "./libs/components/components.js";
import styles from "./styles.module.css";

const RouteDetails = (): React.JSX.Element => {
	const dispatch = useAppDispatch();

	const { id } = useParams<{ id: string }>();

	useEffect(() => {
		void dispatch(routeActions.getRouteById(Number(id)));
	}, [dispatch, id]);

	const route = useAppSelector(({ route }) => route.route);

	const dataStatus = useAppSelector(({ route }) => route.dataStatus);

	if (dataStatus === DataStatus.REJECTED) {
		return <NotFound />;
	}

	if (dataStatus === DataStatus.PENDING || dataStatus === DataStatus.IDLE) {
		return <Loader />;
	}

	const { description, name } = route as RouteGetByIdResponseDto;

	return (
		<>
			<main className={styles["container"]}>
				<h1 className={styles["label"]}>{name}</h1>
				<ImageGallery />
				<p className={styles["description"]}>{description}</p>
			</main>
		</>
	);
};

export { RouteDetails };
