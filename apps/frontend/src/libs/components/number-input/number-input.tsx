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
	const [localValue, setLocalValue] = useState<string>(String(value));

	const handleValueChange = useCallback(
		(newValue: number) => {
			if (newValue >= range.min && newValue <= range.max) {
				onChange(newValue);
				setLocalValue(String(newValue));
			}
		},
		[onChange, range.min, range.max],
	);

	const handleIncrement = useCallback(() => {
		handleValueChange(value + STEP_VALUE);
	}, [value, handleValueChange]);

	const handleDecrement = useCallback(() => {
		handleValueChange(value - STEP_VALUE);
	}, [value, handleValueChange]);

	const handleInput = useCallback(
		(event: React.FormEvent<HTMLInputElement>) => {
			const input = event.currentTarget.value;

			if (!/^\d*$/.test(input)) {
				event.preventDefault();

				return;
			}

			setLocalValue(input);

			const numberValue = Number(input);

			if (numberValue >= range.min && numberValue <= range.max) {
				onChange(numberValue);
			}
		},
		[onChange, range.min, range.max],
	);

	const inputWidthCh =
		Math.max(localValue.length, MIN_INPUT_WIDTH_CH).toString() + "ch";

	return (
		<div className={styles["container"]}>
			<div className={styles["wrapper"]}>
				<input
					className={styles["input"]}
					max={range.max}
					min={range.min}
					onInput={handleInput}
					step={STEP_VALUE}
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
