import { type JSX } from "react";

import { Table } from "~/libs/components/components.js";
import { createColumns } from "~/libs/components/table/libs/constants/column.constants.js";
import {
	useAppSelector,
	useCallback,
	useMemo,
	usePagination,
} from "~/libs/hooks/hooks.js";
import { actions } from "~/modules/points-of-interest/points-of-interest.js";

function DashboardTable(): JSX.Element {
	const { dataStatus, meta, summary } = useAppSelector(
		({ pointsOfInterest }) => pointsOfInterest,
	);

	const handleEdit = useCallback((id: number) => {
		return id;
	}, []);

	const handleDelete = useCallback((id: number) => {
		return id;
	}, []);

	const columns = useMemo(() => {
		return createColumns(handleEdit, handleDelete);
	}, [handleEdit, handleDelete]);

	const paginationPOIS = usePagination(actions.findPaginated);

	return (
		<Table
			columns={columns}
			data={summary}
			loading={dataStatus === "pending"}
			paginationSettings={paginationPOIS}
			title="Points of interest"
			totalItems={meta.total}
			totalPages={meta.totalPages}
		/>
	);
}

export { DashboardTable };
