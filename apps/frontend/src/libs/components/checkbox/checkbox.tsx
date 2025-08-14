import {
	type Control,
	type FieldErrors,
	type FieldPath,
	type FieldValues,
} from "react-hook-form";

import { FieldError } from "~/libs/components/components.js";
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

	return (
		<label className={styles["container"]}>
			{label}
			<input
				autoComplete={autocomplete}
				defaultChecked={field.value}
				name={name}
				onChange={field.onChange}
				type="checkbox"
				value={field.value}
			/>
			{hasError && <FieldError description={error as string} />}
		</label>
	);
};

export { Checkbox };
