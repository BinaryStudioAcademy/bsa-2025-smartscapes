import {
	type Control,
	type FieldErrors,
	type FieldPath,
	type FieldValues,
} from "react-hook-form";

import { FieldError, Icon } from "~/libs/components/components.js";
import { combineClassNames } from "~/libs/helpers/helpers.js";
import { useFormController } from "~/libs/hooks/hooks.js";

import styles from "./styles.module.css";

type Properties<T extends FieldValues> = {
	autocomplete?: HTMLInputElement["autocomplete"];
	control: Control<T, null>;
	errors: FieldErrors<T>;
	label: string;
	name: FieldPath<T>;
};

const Checkbox = <T extends FieldValues>({
	autocomplete = "on",
	control,
	errors,
	label,
	name,
}: Properties<T>): React.JSX.Element => {
	const { field } = useFormController({ control, name });

	const error = errors[name]?.message;
	const hasError = Boolean(error);
	const isChecked = field.value;

	return (
		<label className={styles["container"]}>
			<input
				autoComplete={autocomplete}
				checked={isChecked}
				className={combineClassNames(styles["input"], "visually-hidden")}
				name={name}
				onChange={field.onChange}
				type="checkbox"
			/>
			<span className={styles["custom-checkbox"]}>
				{isChecked && <Icon height={8} name="check" width={8} />}
			</span>
			<span className="visually-hidden">{label}</span>
			{label}
			{hasError && <FieldError description={error as string} />}
		</label>
	);
};

export { Checkbox };
