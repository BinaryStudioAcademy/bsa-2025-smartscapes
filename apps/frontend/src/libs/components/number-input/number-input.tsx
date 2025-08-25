import { IconButton } from "~/libs/components/components.js";
import { useCallback, useState } from "~/libs/hooks/hooks.js";

import styles from "./styles.module.css";

type Properties = {
	onChange: (value: number) => void;
	range: {
		max: number;
		min: number;
	};
	value: number;
};

const MIN_INPUT_WIDTH_CH = 2;
const STEP_VALUE = 1;

const NumberInput = ({
	onChange,
	range,
	value,
}: Properties): React.JSX.Element => {
	const [localValue, setLocalValue] = useState<string>(value.toString());

	const updateValue = useCallback(
		(newValue: number): void => {
			onChange(newValue);
			setLocalValue(String(newValue));
		},
		[onChange],
	);

	const handleIncrement = useCallback((): void => {
		const newValue = Math.min(value + STEP_VALUE, range.max);
		updateValue(newValue);
	}, [value, range.max, updateValue]);

	const handleDecrement = useCallback((): void => {
		const newValue = Math.max(value - STEP_VALUE, range.min);
		updateValue(newValue);
	}, [value, range.min, updateValue]);

	const handleInputChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			setLocalValue(event.target.value);
		},
		[],
	);

	const handleAppliedValue = useCallback(() => {
		updateValue(Number(localValue));
	}, [localValue, updateValue]);

	const handleKeyDown = useCallback(
		(event: React.KeyboardEvent<HTMLInputElement>) => {
			if (event.key === "Enter") {
				handleAppliedValue();
			}
		},
		[handleAppliedValue],
	);

	const { length } = localValue;
	const inputWidthCh = `${Math.max(length, MIN_INPUT_WIDTH_CH).toString()}ch`;

	return (
		<div className={styles["container"]}>
			<div className={styles["wrapper"]}>
				<input
					className={styles["input"]}
					onBlur={handleAppliedValue}
					onChange={handleInputChange}
					onKeyDown={handleKeyDown}
					style={{ width: inputWidthCh }}
					type="number"
					value={localValue}
				/>
				<div className={styles["buttons"]}>
					<IconButton
						className={styles["button"]}
						disabled={value >= range.max}
						icon="caretUp"
						label="Increase value"
						onClick={handleIncrement}
						size={8}
					/>
					<IconButton
						className={styles["button"]}
						disabled={value <= range.min}
						icon="caretDown"
						label="Decrease value"
						onClick={handleDecrement}
						size={8}
					/>
				</div>
			</div>
		</div>
	);
};

export { NumberInput };
