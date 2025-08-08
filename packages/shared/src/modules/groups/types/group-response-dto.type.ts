import { type ValueOf } from "../../../libs/types/types.js";
import { type GroupKey } from "../groups.js";

type GroupResponseDto = {
	id: number;
	key: ValueOf<typeof GroupKey>;
	name: string;
};

export { type GroupResponseDto };
