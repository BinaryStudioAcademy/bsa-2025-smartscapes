import { NumberInput } from "~/libs/components/components.js";
import { type usePagination } from "~/libs/hooks/hooks.js";

import { NavigationButton } from "./libs/components/components.js";
import styles from "./styles.module.css";

type Properties = {
	paginationSettings: ReturnType<typeof usePagination>;
	totalItems: number;
	totalPages: number;
};

const Pagination = ({
	paginationSettings,
	totalItems,
	totalPages,
}: Properties): React.JSX.Element => {
	const {
		handleGoToEnd,
		handleGoToNext,
		handleGoToPrevious,
		handleGoToStart,
		handlePageSizeChange,
		page,
		pageSize,
	} = paginationSettings;

	const range = {
		max: totalItems,
		min: 1,
	};

	return (
		<div className={styles["pagination"]}>
			<span>{totalItems} items total</span>
			<div className={styles["controls"]}>
				<div className={styles["page-size"]}>
					<span>Rows per page:</span>
					<NumberInput
						onChange={handlePageSizeChange}
						range={range}
						value={pageSize}
					/>
				</div>
				<span className={styles["page-status"]}>
					Page {paginationSettings.page} of {totalPages}
				</span>
				<div className={styles["navigation-buttons-container"]}>
					<NavigationButton
						isDisabled={page <= range.min}
						label="«"
						onClick={handleGoToStart}
					/>
					<NavigationButton
						isDisabled={page <= range.min}
						label="‹"
						onClick={handleGoToPrevious}
					/>
					<NavigationButton
						isDisabled={page >= totalPages}
						label="›"
						onClick={handleGoToNext}
					/>
					<NavigationButton
						isDisabled={page >= totalPages}
						label="»"
						onClick={handleGoToEnd}
					/>
				</div>
			</div>
		</div>
	);
};

export { Pagination };
