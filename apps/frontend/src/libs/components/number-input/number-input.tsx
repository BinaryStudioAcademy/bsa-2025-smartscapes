import { type JSX } from "react";

import { Icon } from "~/libs/components/components.js";
import { useCallback } from "~/libs/hooks/hooks.js";

import styles from "./styles.module.css";

type Properties = {
	max: number;
	min: number;
	onChange?: (value: number) => void;
	value: number;
};

const STEP_VALUE = 1;

const NumberInput = ({
	max,
	min,
	onChange,
	value,
}: Properties): JSX.Element => {
	const handleIncrement = useCallback((): void => {
		const newValue = Math.min(max, (value || min) + STEP_VALUE);
		onChange?.(newValue);
	}, [max, min, onChange, value]);

	const handleDecrement = useCallback((): void => {
		const newValue = Math.max(min, (value || min) - STEP_VALUE);
		onChange?.(newValue);
	}, [min, onChange, value]);

	const handleInputChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const inputValue = Number(event.target.value);
			const isNotNumber = Number.isNaN(inputValue);
			const isMoreThanMin = inputValue >= min;
			const isLessThanMax = inputValue <= max;

			if (!isNotNumber && isMoreThanMin && isLessThanMax) {
				onChange?.(inputValue);
			} else if (isNotNumber) {
				onChange?.(min);
			}
		},
		[max, min, onChange],
	);

	return (
		<div className={styles["container"]}>
			<div className={styles["wrapper"]}>
				<input
					className={styles["input"]}
					max={max}
					min={min}
					onChange={handleInputChange}
					type="number"
					value={value}
				/>
				<div className={styles["buttons"]}>
					<button
						className={styles["button"]}
						disabled={(value || min) >= max}
						onClick={handleIncrement}
						type="button"
					>
						<Icon height={8} name="caretUp" width={8} />
						<span className="visually-hidden">Increase value</span>
					</button>
					<button
						className={styles["button"]}
						disabled={(value || min) <= min}
						onClick={handleDecrement}
						type="button"
					>
						<Icon height={8} name="caretDown" width={8} />
						<span className="visually-hidden">Increase value</span>
					</button>
				</div>
			</div>
		</div>
	);
};

export { NumberInput };
