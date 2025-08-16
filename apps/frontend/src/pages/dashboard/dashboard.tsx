import {
	Button,
	CreatePOIModal,
	Header,
	Loader,
	Select,
	Sidebar,
} from "~/libs/components/components.js";
import { type SelectOption } from "~/libs/components/select/libs/types/types.js";
import { NAVIGATION_ITEMS_GROUPS } from "~/libs/constants/constants.js";
import { AppRoute, DataStatus } from "~/libs/enums/enums.js";
import { getPermittedNavigationItems } from "~/libs/helpers/helpers.js";
import {
	useAppDispatch,
	useAppForm,
	useAppSelector,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "~/libs/hooks/hooks.js";
import { HTTPError } from "~/libs/modules/http/http.js";
import { toastNotifier } from "~/libs/modules/toast-notifier/toast-notifier.js";
import { fileApi } from "~/modules/files/files.js";
import { FileFolderName } from "~/modules/files/libs/enums/enums.js";
import { type PointsOfInterestRequestDto } from "~/modules/points-of-interest/libs/types/types.js";
import { actions as poiActions } from "~/modules/points-of-interest/points-of-interest.js";

import { Carousel } from "../../libs/components/carousel/carousel.js";
import styles from "./styles.module.css";

type FormValues = {
	multiColors: string[];
	singleColor: null | string;
};

const DEFAULT_LONGITUDE = 30.5234;
const DEFAULT_LATITUDE = 50.4501;

const Dashboard = (): React.JSX.Element => {
	const [uploadedImages, setUploadedImages] = useState<string[]>([]);
	const [isUploading, setIsUploading] = useState<boolean>(false);
	const fileInputReference = useRef<HTMLInputElement>(null);
	const authenticatedUser = useAppSelector(
		({ auth }) => auth.authenticatedUser,
	);
	const dispatch = useAppDispatch();

	const colorOptions: SelectOption<string>[] = [
		{ label: "Red", value: "red" },
		{ label: "Green", value: "green" },
		{ label: "Blue", value: "blue" },
	];

	const { control } = useAppForm<FormValues>({
		defaultValues: { multiColors: [], singleColor: null },
	});

	const handleFileUpload = useCallback(
		async (event: React.ChangeEvent<HTMLInputElement>) => {
			const file = event.target.files?.[0];

			if (!file) {
				return;
			}

			setIsUploading(true);

			try {
				const responseURL = await fileApi.uploadFile({
					file,
					folder: FileFolderName.AVATARS,
				});

				setUploadedImages((previous) => [...previous, responseURL.data.url]);
				setIsUploading(false);

				toastNotifier.showSuccess("File uploaded successfully");
			} catch (error: unknown) {
				setIsUploading(false);
				toastNotifier.showError(
					error instanceof HTTPError ? error.message : "Uploading file failed",
				);
			}
		},
		[],
	);

	const handleButtonClick = useCallback(() => {
		fileInputReference.current?.click();
	}, []);

	useEffect(() => {
		const loadFiles = async (): Promise<void> => {
			const response = await fileApi.getAllFiles();
			setUploadedImages(response.data.map((file) => file.url));
		};

		void loadFiles();
	}, []);

	const [isCreatePOIOpen, setIsCreatePOIOpen] = useState<boolean>(false);
	const createStatus = useAppSelector(
		(state) => state.pointsOfInterest.createStatus,
	);
	const handleModalToggle = useCallback(() => {
		setIsCreatePOIOpen((previous) => !previous);
	}, []);

	const handleSubmit = useCallback(
		(payload: PointsOfInterestRequestDto): void => {
			void dispatch(poiActions.create(payload));
		},
		[dispatch],
	);
	useEffect(() => {
		if (createStatus === DataStatus.FULFILLED) {
			setIsCreatePOIOpen(false);
		}
	}, [createStatus]);

	const userGroup = authenticatedUser?.group;
	const userPermissions = authenticatedUser?.group.permissions;

	const permittedNavigationItems = useMemo(() => {
		return getPermittedNavigationItems(
			NAVIGATION_ITEMS_GROUPS,
			userGroup ?? null,
			userPermissions ?? [],
		);
	}, [userPermissions, userGroup]);

	return (
		<div className={styles["container"]}>
			<div className={styles["components-container"]}>
				<Header
					actions={[{ label: "Sign in", to: AppRoute.SIGN_IN }]}
					user={authenticatedUser}
				/>
				<div className={styles["sidebar-container"]}>
					<Sidebar navigationItemsGroups={permittedNavigationItems} />
				</div>
				<Loader />
				<div className={styles["carousel-container"]}>
					<Carousel images={uploadedImages} />
				</div>

				<div className={styles["file-upload-container"]}>
					<label style={{ display: "block", marginBottom: "10px" }}>
						<Button
							label={isUploading ? "Loading..." : "Select File"}
							onClick={handleButtonClick}
							type="button"
						/>
						<input
							accept="image/*"
							disabled={isUploading}
							onChange={handleFileUpload}
							ref={fileInputReference}
							style={{ display: "none" }}
							type="file"
						/>
					</label>
				</div>
				<div className={styles["select-container"]}>
					<Select
						control={control}
						label="Single select"
						name="singleColor"
						options={colorOptions}
					/>
					<Select
						control={control}
						isMulti
						label="Multi select"
						name="multiColors"
						options={colorOptions}
					/>
				</div>
				<div className={styles["button-container"]}>
					<Button
						label="Create new POI"
						onClick={handleModalToggle}
						type="button"
					/>
				</div>
				<CreatePOIModal
					defaultLatitude={DEFAULT_LATITUDE}
					defaultLongitude={DEFAULT_LONGITUDE}
					isOpen={isCreatePOIOpen}
					onClose={handleModalToggle}
					onSubmit={handleSubmit}
				/>
			</div>
		</div>
	);
};

export { Dashboard };
