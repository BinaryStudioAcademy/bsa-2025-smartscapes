import { type MultiValue, type SingleValue } from "react-select";

import { type SelectOption } from "../../types/types.js";

const isMultiValue = <T>(
	value: MultiValue<SelectOption<T>> | SingleValue<SelectOption<T>>,
): value is MultiValue<SelectOption<T>> => Array.isArray(value);

const getSelectNewValue = <TOptionValue>(
	newValue:
		| MultiValue<SelectOption<TOptionValue>>
		| SingleValue<SelectOption<TOptionValue>>,
): TOptionValue[] => {
	if (isMultiValue(newValue)) {
		return newValue.map((option) => option.value);
	}

	if (newValue) {
		return [newValue.value];
	}

	return [];
};

export { getSelectNewValue };
