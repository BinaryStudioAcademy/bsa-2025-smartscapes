import {
	type Control,
	type FieldErrors,
	type FieldPath,
	type FieldValues,
} from "react-hook-form";

import errorIcon from "~/assets/images/error.svg";
import { combineClassNames } from "~/libs/helpers/helpers.js";
import { useFormController } from "~/libs/hooks/hooks.js";

import styles from "./styles.module.css";

type Properties<T extends FieldValues> = {
	autocomplete?: HTMLInputElement["autocomplete"];
	control: Control<T, null>;
	errors: FieldErrors<T>;
	label: string;
	name: FieldPath<T>;
	placeholder?: string;
	type?: "email" | "password" | "text";
};

const Input = <T extends FieldValues>({
	autocomplete = "on",
	control,
	errors,
	label,
	name,
	placeholder = "",
	type = "text",
}: Properties<T>): React.JSX.Element => {
	const { field } = useFormController({ control, name });

	const error = errors[name]?.message;
	const hasError = Boolean(error);

	return (
		<label className={styles["label"]}>
			<span className={styles["label-caption"]}>{label}</span>
			<input
				autoComplete={autocomplete}
				className={combineClassNames(
					styles["input"],
					hasError && styles["input-error"],
				)}
				name={field.name}
				onChange={field.onChange}
				placeholder={placeholder}
				type={type}
				value={field.value}
			/>
			{hasError && (
				<span className={styles["error"]}>
					<img alt="error-icon" src={errorIcon} />
					{error as string}
				</span>
			)}
		</label>
	);
};

export { Input };
