import { flexRender, type Table } from "@tanstack/react-table";
import { type JSX } from "react";

import styles from "../../../styles.module.css";

type Properties<T> = {
	table: Table<T>;
};

function TableHead<T>({ table }: Readonly<Properties<T>>): JSX.Element {
	return (
		<thead className={styles["thead"]}>
			{table.getHeaderGroups().map((headerGroup) => (
				<tr className={styles["tr"]} key={headerGroup.id}>
					{headerGroup.headers.map((header) => (
						<th
							className={styles["th"]}
							key={header.id}
							style={{ width: header.getSize() }}
						>
							{flexRender(header.column.columnDef.header, header.getContext())}
						</th>
					))}
				</tr>
			))}
		</thead>
	);
}

export { TableHead };
