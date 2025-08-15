import { useEffect } from "react";
import { Navigate, useNavigate, useParams } from "react-router";

import mockImage1 from "~/assets/images/mocks/poi1.jpg";
import mockImage2 from "~/assets/images/mocks/poi2.jpg";
import mockImage3 from "~/assets/images/mocks/poi3.jpg";
import {
	AppRoute,
	CommonExceptionMessage,
	DataStatus,
} from "~/libs/enums/enums.js";
import { useAppDispatch, useAppSelector } from "~/libs/hooks/hooks.js";
import { toastNotifier } from "~/libs/modules/toast-notifier/toast-notifier.js";
import { actions } from "~/modules/points-of-interest/points-of-interest.js";

import styles from "./styles.module.css";

const PointsOfInterestDetails = (): React.JSX.Element => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const { dataStatus, pointsOfInterestDetails } = useAppSelector(
		({ pointsOfInterestDetails }) => pointsOfInterestDetails,
	);
	const { id } = useParams();
	const formattedId = Number(id);
	const isRejected = dataStatus === DataStatus.REJECTED;

	useEffect(() => {
		if (formattedId) {
			void dispatch(actions.getById(formattedId));
		} else {
			void (async (): Promise<void> => {
				try {
					await navigate(AppRoute.NOT_FOUND, { replace: true });
				} catch {
					toastNotifier.showError(
						CommonExceptionMessage.COMMON_EXCEPTION_MESSAGE,
					);
				}
			})();
		}
	}, [dispatch, formattedId, navigate]);

	return (
		<>
			{isRejected && <Navigate replace to={AppRoute.NOT_FOUND} />}
			<main className={styles["poi-container"]}>
				{pointsOfInterestDetails && (
					<>
						<h2 className={styles["poi-header"]}>
							{pointsOfInterestDetails.name}
						</h2>
						<div className={styles["poi-gallery"]}>
							<img
								alt="point of interest"
								className={styles["poi-route-image"]}
								src={mockImage1}
							/>
							<div className={styles["poi-sub-gallery"]}>
								<img
									alt="point of interest"
									className={styles["poi-route-sub-image"]}
									src={mockImage2}
								/>
								<img
									alt="point of interest"
									className={styles["poi-route-sub-image"]}
									src={mockImage3}
								/>
							</div>
						</div>
						<p className={styles["poi-description"]}>
							{pointsOfInterestDetails.description}
						</p>
					</>
				)}
			</main>
		</>
	);
};

export { PointsOfInterestDetails };
