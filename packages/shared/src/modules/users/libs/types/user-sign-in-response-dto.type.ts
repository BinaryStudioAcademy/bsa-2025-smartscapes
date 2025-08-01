import { type GroupAuthResponseDto } from "../../../groups/types/types.js";
import { type UserAuthResponseDto } from "./user-auth-response-dto.type.js";

type UserSignInResponseDto = {
	group: GroupAuthResponseDto;
	token: string;
	user: Pick<UserAuthResponseDto, "email" | "id">;
};

export { type UserSignInResponseDto };
