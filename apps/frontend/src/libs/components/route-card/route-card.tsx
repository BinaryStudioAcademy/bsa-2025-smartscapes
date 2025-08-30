import { Icon, Link } from "~/libs/components/components.js";
import { AppRoute } from "~/libs/enums/enums.js";
import {
	configureString,
	generateStaticMapUrl,
} from "~/libs/helpers/helpers.js";
import { useCallback, useMemo } from "~/libs/hooks/hooks.js";
import { type RouteGetAllItemResponseDto } from "~/libs/types/types.js";

import styles from "./styles.module.css";

type Properties = {
	onClick: (id: number) => void;
	route: RouteGetAllItemResponseDto;
};

const RouteCard = ({ onClick, route }: Properties): React.JSX.Element => {
	const { id, images, name, pois } = route;

	const coverImage = images.at(0)?.url;

	const handleClick = useCallback((): void => {
		onClick(id);
	}, [onClick, id]);

	const markers = useMemo(() => {
		return pois.map((poi) => ({
			coordinates: poi.location.coordinates,
		}));
	}, [pois]);

	const staticMapUrl = useMemo(() => {
		return generateStaticMapUrl({
			markers,
		});
	}, [markers]);

	return (
		<li className={styles["route-card"]}>
			<div className={styles["container"]}>
				<button className={styles["button"]} onClick={handleClick}>
					{coverImage ? (
						<img alt={name} className={styles["image"]} src={coverImage} />
					) : (
						<div className={styles["image-placeholder"]}>
							<img
								alt={`Map preview for ${name}`}
								className={styles["image"]}
								src={staticMapUrl}
							/>
						</div>
					)}
					<div className={styles["data"]}>
						<p className={styles["label"]}>{name}</p>
						{Boolean(id) && (
							<Link
								className={styles["linkButton"]}
								to={configureString(AppRoute.ROUTES_$ID, {
									id: id.toString(),
								})}
							>
								<Icon height={16} name="link" width={16} />
							</Link>
						)}
					</div>
				</button>
			</div>
		</li>
	);
};

export { RouteCard };
