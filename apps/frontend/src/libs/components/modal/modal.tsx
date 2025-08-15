import React from "react";

import { KeyboardKey } from "~/libs/enums/enums.js";
import { useCallback, useEffect } from "~/libs/hooks/hooks.js";

import { Icon } from "../components.js";
import styles from "./styles.module.css";

type Properties = {
	children: React.ReactNode;
	isOpen: boolean;
	onClose: () => void;
};

const Modal = ({
	children,
	isOpen,
	onClose,
}: Properties): null | React.JSX.Element => {
	useEffect((): (() => void) => {
		if (!isOpen) {
			return () => {};
		}

		const onKeyDown = (event: KeyboardEvent): void => {
			if (event.key === KeyboardKey.ESCAPE) {
				onClose();
			}
		};

		document.addEventListener("keydown", onKeyDown);

		return (): void => {
			document.removeEventListener("keydown", onKeyDown);
		};
	}, [isOpen, onClose]);

	const handleBackdropClick = useCallback((): void => {
		onClose();
	}, [onClose]);

	if (!isOpen) {
		return null;
	}

	return (
		<>
			<div
				aria-hidden="true"
				className={styles["backdrop"]}
				onClick={handleBackdropClick}
			/>
			<div aria-modal="true" className={styles["dialog"]} role="dialog">
				<button
					aria-label="Close"
					className={styles["close-button"]}
					onClick={onClose}
					type="button"
				>
					<Icon height={24} name="close" width={24} />
				</button>
				{children}
			</div>
		</>
	);
};

export { Modal };
