import { type ComponentProps } from "react";
import {
	type Control,
	type FieldErrors,
	type FieldPath,
	type FieldValues,
} from "react-hook-form";

import { FieldError } from "~/libs/components/components.js";
import { combineClassNames } from "~/libs/helpers/helpers.js";
import { useFormController } from "~/libs/hooks/hooks.js";

import { InputIcon } from "./libs/components/components.js";
import styles from "./styles.module.css";

type Properties<T extends FieldValues> = {
	autocomplete?: HTMLInputElement["autocomplete"];
	control: Control<T, null>;
	errors: FieldErrors<T>;
	iconRight?: Pick<
		ComponentProps<typeof InputIcon>,
		"label" | "name" | "onClick"
	>;
	isReadonly?: boolean;
	label: string;
	name: FieldPath<T>;
	placeholder?: string;
	type?: "email" | "password" | "text";
};

const Input = <T extends FieldValues>({
	autocomplete = "on",
	control,
	errors,
	iconRight,
	isReadonly = false,
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
			<span className={styles["input-container"]}>
				<input
					autoComplete={autocomplete}
					className={combineClassNames(
						styles["input"],
						hasError && styles["input-error"],
						iconRight && styles["input-right-icon-space"],
						isReadonly && styles["input-readonly"],
					)}
					name={field.name}
					onChange={field.onChange}
					placeholder={placeholder}
					readOnly={isReadonly}
					type={type}
					value={field.value}
				/>
				{iconRight && (
					<span className={styles["icon-right"]}>
						<InputIcon
							label={iconRight.label}
							name={iconRight.name}
							onClick={iconRight.onClick}
							state={hasError ? "error" : "default"}
						/>
					</span>
				)}
			</span>
			{hasError && <FieldError description={error as string} />}
		</label>
	);
};

export { Input };
