import { FileFolderName } from "@smartscapes/shared/src/modules/files/libs/enums/file-folder-name.enum.js";

import {
	Button,
	Header,
	Loader,
	Select,
	Sidebar,
} from "~/libs/components/components.js";
import { type SelectOption } from "~/libs/components/select/libs/types/types.js";
import { NAVIGATION_ITEMS_GROUPS } from "~/libs/constants/constants.js";
import { AppRoute } from "~/libs/enums/enums.js";
import {
	useAppForm,
	useAppSelector,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "~/libs/hooks/hooks.js";
import { filesApi } from "~/modules/files/files.js";

import { Carousel } from "../../libs/components/carousel/carousel.js";
import styles from "./styles.module.css";

type FormValues = {
	multiColors: string[];
	singleColor: null | string;
};

const Dashboard = (): React.JSX.Element => {
	const [uploadedImages, setUploadedImages] = useState<string[]>([]);
	const [isUploading, setIsUploading] = useState<boolean>(false);
	const fileInputReference = useRef<HTMLInputElement>(null);
	const authenticatedUser = useAppSelector(
		({ auth }) => auth.authenticatedUser,
	);

	const colorOptions: SelectOption<string>[] = [
		{ label: "Red", value: "red" },
		{ label: "Green", value: "green" },
		{ label: "Blue", value: "blue" },
	];

	const { control } = useAppForm<FormValues>({
		defaultValues: {
			multiColors: [],
			singleColor: null,
		},
	});

	const handleFileUpload = useCallback(
		async (event: React.ChangeEvent<HTMLInputElement>) => {
			const file = event.target.files?.[0];

			if (!file) {
				return;
			}

			setIsUploading(true);

			try {
				const responseURL = await filesApi.uploadFile({
					file,
					folder: FileFolderName.AVATARS,
				});

				setUploadedImages((previous) => [...previous, responseURL.data.url]);
				setIsUploading(false);
			} catch {
				setIsUploading(false);
			}
		},
		[],
	);

	const handleButtonClick = useCallback(() => {
		fileInputReference.current?.click();
	}, []);

	useEffect(() => {
		const loadFiles = async (): Promise<void> => {
			const response = await filesApi.getAllFiles();
			setUploadedImages(response.data.map((file) => file.url));
		};

		void loadFiles();
	}, []);

	return (
		<div className={styles["container"]}>
			<div className={styles["components-container"]}>
				<Header
					actions={[{ label: "Sign in", to: AppRoute.SIGN_IN }]}
					user={authenticatedUser}
				/>
				<div className={styles["sidebar-container"]}>
					<Sidebar navigationItemsGroups={NAVIGATION_ITEMS_GROUPS} />
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
			</div>
		</div>
	);
};

export { Dashboard };
