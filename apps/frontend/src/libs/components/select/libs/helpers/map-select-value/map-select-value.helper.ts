import { type SelectOption } from "../../types/types.js";

const mapSelectValue = <TOptionValue>(
	rawValue: TOptionValue[],
	options: SelectOption<TOptionValue>[],
): SelectOption<TOptionValue>[] => {
	return options.filter((option) => rawValue.includes(option.value));
};

export { mapSelectValue };
