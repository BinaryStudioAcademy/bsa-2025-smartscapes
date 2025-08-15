import { memo } from "react";

import { Icon } from "~/libs/components/components.js";
import { useCallback } from "~/libs/hooks/hooks.js";

import styles from "./styles.module.css";

type ActionCellProperties = {
	id: number;
	onDelete: (id: number) => void;
	onEdit: (id: number) => void;
};

const ActionCell = memo(({ id, onDelete, onEdit }: ActionCellProperties) => {
	const handleEditClick = useCallback((): void => {
		onEdit(id);
	}, [id, onEdit]);

	const handleDeleteClick = useCallback(() => {
		onDelete(id);
	}, [id, onDelete]);

	return (
		<div className={styles["actions-cell"]}>
			<button
				aria-label="Edit"
				className={styles["icon-button"]}
				onClick={handleEditClick}
				type="button"
			>
				<Icon height={24} name="edit" width={24} />
				<span className="visually-hidden">Edit</span>
			</button>
			<button
				aria-label="Delete"
				className={styles["icon-button"]}
				onClick={handleDeleteClick}
				type="button"
			>
				<Icon height={24} name="trash" width={24} />
				<span className="visually-hidden">Delete</span>
			</button>
		</div>
	);
});

ActionCell.displayName = "ActionCell";

export { ActionCell };
