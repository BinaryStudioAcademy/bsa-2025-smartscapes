import React from "react";

import {
	Button,
	Input,
	MapLocationField,
	Modal,
	TextArea,
} from "~/libs/components/components.js";
import { useAppForm } from "~/libs/hooks/hooks.js";
import {
	type PointsOfInterestCreateRequestDto,
	pointsOfInterestCreateValidationSchema,
} from "~/modules/points-of-interest/points-of-interest.js";

import {
	type CreatePOIFormValues,
	DEFAULT_CREATE_POI_PAYLOAD,
} from "./libs/constants/constants.js";
import styles from "./styles.module.css";

type Properties = {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (payload: PointsOfInterestCreateRequestDto) => void;
};

const CreatePOIModal = ({
	isOpen,
	onClose,
	onSubmit,
}: Properties): React.JSX.Element => {
	const { control, errors, handleReset, handleSubmit } =
		useAppForm<CreatePOIFormValues>({
			defaultValues: DEFAULT_CREATE_POI_PAYLOAD,
			validationSchema: pointsOfInterestCreateValidationSchema,
		});

	const handleFormSubmit = (payload: CreatePOIFormValues): void => {
		onSubmit(payload as PointsOfInterestCreateRequestDto);
		handleReset(DEFAULT_CREATE_POI_PAYLOAD);
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<div className={styles["header"]}>
				<h3 className={styles["title"]}>Create new POI</h3>
			</div>
			<form
				className={styles["form"]}
				onSubmit={handleSubmit(handleFormSubmit)}
			>
				<Input
					autocomplete="name"
					control={control}
					errors={errors}
					label="Name"
					name="name"
					type="text"
				/>
				<MapLocationField
					control={control}
					errors={errors}
					label="Location"
					name="location"
				/>
				<TextArea
					control={control}
					errors={errors}
					label="Description (optional)"
					name="description"
				/>
				<div className={styles["footer"]}>
					<div>
						<Button label="Create" type="submit" />
					</div>
				</div>
			</form>
		</Modal>
	);
};

export { CreatePOIModal };
