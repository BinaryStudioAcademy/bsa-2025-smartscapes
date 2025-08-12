import React from "react";
import {
	type Control,
	type FieldPath,
	type FieldValues,
	type Path,
	type PathValue,
} from "react-hook-form";
import ReactSelect, { type MultiValue, type SingleValue } from "react-select";

import { useFormController, useMemo } from "~/libs/hooks/hooks.js";

import { selectStylesConfig } from "./libs/constants/constants.js";
import { getSelectNewValue, mapSelectValue } from "./libs/helpers/helpers.js";
import { type SelectOption } from "./libs/types/select-option.type.js";
import styles from "./styles.module.css";

type Properties<TFieldValues extends FieldValues, TOptionValue = string> = {
	control: Control<TFieldValues, null>;
	isMulti?: boolean;
	label: string;
	name: FieldPath<TFieldValues>;
	options: SelectOption<TOptionValue>[];
	placeholder?: string;
};

const Select = <TFieldValues extends FieldValues, TOptionValue = string>({
	control,
	isMulti = false,
	label,
	name,
	options,
	placeholder = "",
}: Properties<TFieldValues, TOptionValue>): React.JSX.Element => {
	const { field } = useFormController<TFieldValues>({ control, name });

	const value = useMemo(() => {
		const rawValue = (field.value ?? []) as TOptionValue[];

		return mapSelectValue<TOptionValue>(rawValue, options);
	}, [field.value, options]);

	const handleChange = useMemo((): ((
		newValue:
			| MultiValue<SelectOption<TOptionValue>>
			| SingleValue<SelectOption<TOptionValue>>,
	) => void) => {
		return (newValue) => {
			const cleanValue = getSelectNewValue(newValue);
			field.onChange(cleanValue);
		};
	}, [field]);

	return (
		<label className={styles["label"]}>
			<span className={styles["label-caption"]}>{label}</span>
			<ReactSelect
				classNames={selectStylesConfig}
				isMulti={isMulti}
				name={name}
				onChange={handleChange}
				options={options as PathValue<TFieldValues, Path<TFieldValues>>}
				placeholder={placeholder}
				unstyled
				value={value}
			/>
		</label>
	);
};

export { Select };
