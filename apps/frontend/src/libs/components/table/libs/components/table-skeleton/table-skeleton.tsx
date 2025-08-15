import { type ColumnDef } from "@tanstack/react-table";
import { type JSX } from "react";

import { combineClassNames } from "~/libs/helpers/helpers.js";

import styles from "./styles.module.css";

type Properties<T> = {
	columns: ColumnDef<T>[];
	rowCount: number;
};

function TableSkeleton<T>({
	columns,
	rowCount,
}: Readonly<Properties<T>>): JSX.Element {
	return (
		<>
			<thead>
				<tr>
					{columns.map((_, index) => (
						<th
							className={combineClassNames(
								styles["th"],
								styles["skeleton-header"],
							)}
							key={index}
						>
							<div className={styles["skeleton-line"]} />
						</th>
					))}
				</tr>
			</thead>
			<tbody>
				{Array.from({ length: rowCount }).map((_, rowIndex) => (
					<tr className={styles["tr"]} key={rowIndex}>
						{columns.map((_, cellIndex) => (
							<td
								className={combineClassNames(
									styles["td"],
									styles["skeleton-cell"],
								)}
								key={cellIndex}
							>
								<div className={styles["skeleton-line"]} />
							</td>
						))}
					</tr>
				))}
			</tbody>
		</>
	);
}

export { TableSkeleton };
