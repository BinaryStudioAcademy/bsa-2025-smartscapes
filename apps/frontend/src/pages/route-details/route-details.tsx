import {
	Button,
	FeatureGallery,
	Input,
	Loader,
	MapProvider,
	TextArea,
} from "~/libs/components/components.js";
import { DataStatus, PermissionKey } from "~/libs/enums/enums.js";
import { checkHasPermission } from "~/libs/helpers/helpers.js";
import {
	useAppDispatch,
	useAppForm,
	useAppSelector,
	useCallback,
	useEffect,
	useParams,
	useRef,
	useState,
} from "~/libs/hooks/hooks.js";
import { type ReviewRequestDto } from "~/modules/reviews/reviews.js";
import {
	actions as routeActions,
	type RoutePatchRequestDto,
} from "~/modules/routes/routes.js";

import { NotFound } from "../not-found/not-found.js";
import {
	PointOfInterestSection,
	RouteReviewsSection,
} from "./libs/components/components.js";
import { ROUTE_FORM_DEFAULT_VALUES } from "./libs/constants/constants.js";
import styles from "./styles.module.css";

const RouteDetails = (): React.JSX.Element => {
	const [isEditMode, setIsEditMode] = useState<boolean>(false);
	const route = useAppSelector(({ routeDetails }) => routeDetails.route);
	const user = useAppSelector(({ auth }) => auth.authenticatedUser);
	const dataStatus = useAppSelector(
		({ routeDetails }) => routeDetails.dataStatus,
	);

	const reviews = useAppSelector(({ routeDetails }) => routeDetails.reviews);
	const isAuthenticatedUser = Boolean(user);
	const { control, errors, getValues, handleReset } =
		useAppForm<RoutePatchRequestDto>({
			defaultValues: ROUTE_FORM_DEFAULT_VALUES,
		});
	const dispatch = useAppDispatch();
	const { id: routeId } = useParams<{ id: string }>();

	const hasEditPermissions = Boolean(
		user &&
			checkHasPermission([PermissionKey.MANAGE_ROUTES], user.group.permissions),
	);
	const fileInputReference = useRef<HTMLInputElement | null>(null);

	const handleFileUpload = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const file = event.target.files?.[0];

			if (!file) {
				return;
			}

			void dispatch(
				routeActions.uploadImage({ file, id: route?.id as number }),
			);
			event.target.value = "";
		},
		[dispatch, route],
	);

	const handleTriggerFileUpload = useCallback(() => {
		fileInputReference.current?.click();
	}, []);

	const handleToggleEditMode = useCallback(() => {
		setIsEditMode((isEditMode) => !isEditMode);
	}, []);

	const handleResetFormValues = useCallback(() => {
		if (!route) {
			return;
		}

		handleReset({
			description: route.description,
			name: route.name,
		});
	}, [handleReset, route]);

	const handleCancel = useCallback(() => {
		handleResetFormValues();
		setIsEditMode(false);
	}, [handleResetFormValues]);

	const handlePatchRequest = useCallback(() => {
		if (route) {
			const { description, name } = getValues();
			void dispatch(
				routeActions.patch({
					id: route.id,
					payload: { description, name },
				}),
			);
			setIsEditMode(false);
		}
	}, [dispatch, setIsEditMode, route, getValues]);

	const handleDeleteImage = useCallback(
		(id: number) => {
			void dispatch(routeActions.deleteImage(id));
		},
		[dispatch],
	);

	useEffect(() => {
		void dispatch(routeActions.getById(Number(routeId)));
	}, [dispatch, routeId]);

	useEffect(() => {
		handleResetFormValues();
	}, [handleResetFormValues]);

	useEffect(() => {
		void dispatch(routeActions.getReviews({ routeId: Number(routeId) }));
	}, [dispatch, routeId]);

	const handleCreateReview = useCallback(
		(payload: ReviewRequestDto): void => {
			void dispatch(routeActions.createReview(payload));
		},
		[dispatch],
	);

	if (dataStatus === DataStatus.PENDING || dataStatus === DataStatus.IDLE) {
		return (
			<div className={styles["loader-container"]}>
				<Loader />
			</div>
		);
	}

	if (dataStatus === DataStatus.REJECTED) {
		return <NotFound />;
	}

	if (!route) {
		return <></>;
	}

	const { description, id, images, name, pois } = route;

	const hasDescription = Boolean(description);

	return (
		<>
			<main className={styles["container"]}>
				<div className={styles["header-container"]}>
					{isEditMode ? (
						<>
							<Input
								control={control}
								errors={errors}
								label="Title"
								name="name"
							/>
							<div className={styles["edit-mode-controls"]}>
								<Button label="Save" onClick={handlePatchRequest} />
								<Button label="Cancel" onClick={handleCancel} />
							</div>
						</>
					) : (
						<>
							<h1 className={styles["label"]}>{name}</h1>
							{hasEditPermissions && (
								<div>
									<Button label="Edit" onClick={handleToggleEditMode} />
								</div>
							)}
						</>
					)}
				</div>
				<FeatureGallery
					slides={[
						{
							content: <MapProvider />,
						},
						...images.map((image) => ({
							content: (
								<img
									alt="point of interest"
									className={styles["image"]}
									src={image.url}
								/>
							),
							...(isEditMode && {
								onDelete: (): void => {
									handleDeleteImage(image.id);
								},
							}),
						})),
					]}
				/>

				{isEditMode && (
					<>
						<input
							accept="image/*"
							onChange={handleFileUpload}
							ref={fileInputReference}
							style={{ display: "none" }}
							type="file"
						/>
						<div className={styles["upload-button"]}>
							<Button
								label="Upload image"
								onClick={handleTriggerFileUpload}
								variant="outlined"
							/>
						</div>
					</>
				)}
				{isEditMode ? (
					<TextArea
						control={control}
						errors={errors}
						label="Description"
						name="description"
					/>
				) : (
					hasDescription && (
						<p className={styles["description"]}>{description}</p>
					)
				)}
				<PointOfInterestSection pointOfInterests={pois} />
				<RouteReviewsSection
					isAuthenticatedUser={isAuthenticatedUser}
					items={reviews}
					onCreate={handleCreateReview}
					routeId={Number(id)}
				/>
			</main>
		</>
	);
};

export { RouteDetails };
