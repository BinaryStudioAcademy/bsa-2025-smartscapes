import { type ColumnDef } from "@tanstack/react-table";

import { AppRoute } from "~/libs/enums/enums.js";
import { configureString } from "~/libs/helpers/helpers.js";
import { useAppDispatch, useCallback, useMemo } from "~/libs/hooks/hooks.js";
import {
	actions,
	type PointsOfInterestGetAllItemResponseDto,
} from "~/modules/points-of-interest/points-of-interest.js";

import { createColumns } from "../helpers/helpers.js";

const useTableColumns =
	(): ColumnDef<PointsOfInterestGetAllItemResponseDto>[] => {
		const dispatch = useAppDispatch();

		const handleEdit = useCallback((id: number) => {
			const url = configureString(AppRoute.POINTS_OF_INTEREST_$ID, {
				id: String(id),
			});
			window.open(url, "_blank");
		}, []);

		const handleDelete = useCallback(
			(id: number) => {
				void dispatch(actions.remove(id));
			},
			[dispatch],
		);

		const columns = useMemo(() => {
			return createColumns(handleEdit, handleDelete);
		}, [handleEdit, handleDelete]);

		return columns;
	};

export { useTableColumns };
