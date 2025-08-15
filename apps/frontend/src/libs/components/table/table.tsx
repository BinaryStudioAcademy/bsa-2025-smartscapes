import {
	type ColumnDef,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { type JSX } from "react";

import { Pagination } from "~/libs/components/components.js";
import { type usePagination } from "~/libs/hooks/hooks.js";

import {
	TableBody,
	TableHead,
	TableSkeleton,
} from "./libs/components/components.js";
import styles from "./styles.module.css";

type Properties<T> = {
	columns: ColumnDef<T>[];
	data: T[];
	loading: boolean;
	paginationSettings: ReturnType<typeof usePagination>;
	title: string;
	totalItems: number;
	totalPages: number;
};

const DEFAULT_ROWS_COUNT = 5;

function Table<T>({
	columns,
	data,
	loading,
	paginationSettings,
	title,
	totalItems,
	totalPages,
}: Readonly<Properties<T>>): JSX.Element {
	const table = useReactTable({
		columns,
		data,
		getCoreRowModel: getCoreRowModel(),
	});

	const rowCount =
		paginationSettings.limit > 0
			? paginationSettings.limit
			: DEFAULT_ROWS_COUNT;

	return (
		<section className={styles["table-section"]}>
			{title && <h2 className={styles["title"]}>{title}</h2>}

			<table className={styles["table"]}>
				{loading ? (
					<TableSkeleton columns={columns} rowCount={rowCount} />
				) : (
					<>
						<TableHead table={table} />
						<TableBody table={table} />
					</>
				)}
			</table>

			{!loading && (
				<Pagination
					paginationSettings={paginationSettings}
					totalItems={totalItems}
					totalPages={totalPages}
				/>
			)}
		</section>
	);
}

export { Table };
