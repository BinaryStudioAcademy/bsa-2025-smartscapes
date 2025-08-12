import { combineClassNames } from "~/libs/helpers/helpers.js";

import styles from "../../styles.module.css";

const selectStylesConfig = {
	clearIndicator: (): string => styles["clear-indicator"] as string,
	control: (): string => styles["control"] as string,
	menu: (): string => styles["menu"] as string,
	multiValue: (): string => styles["multi-value"] as string,
	multiValueLabel: (): string => styles["multi-value-label"] as string,
	multiValueRemove: (): string => styles["multi-value-remove"] as string,
	option: ({
		isFocused,
		isSelected,
	}: {
		isFocused: boolean;
		isSelected: boolean;
	}): string =>
		combineClassNames(
			styles["option"],
			isFocused && styles["option-focused"],
			isSelected && styles["option-selected"],
		),
	placeholder: (): string => styles["placeholder"] as string,
	singleValue: (): string => styles["single-value"] as string,
};

export { selectStylesConfig };
