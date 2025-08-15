import { type ColumnDef } from "@tanstack/react-table";

import { ActionCell } from "~/libs/components/table/libs/components/components.js";

import { type RowData } from "../types/types.js";

const createColumns = (
	onEdit: (id: number) => void,
	onDelete: (id: number) => void,
): ColumnDef<RowData>[] => [
	{
		accessorKey: "id",
		header: "Id",
		maxSize: 100,
		minSize: 50,
		size: 66,
	},
	{
		accessorKey: "name",
		header: "Name",
		minSize: 150,
		size: 491,
	},
	{
		accessorKey: "createdAt",
		header: "Created at",
		size: 355,
	},
	{
		cell: ({ row }) => (
			<ActionCell id={row.original.id} onDelete={onDelete} onEdit={onEdit} />
		),
		header: "Actions",
		id: "actions",
		size: 144,
	},
];

export { createColumns };
