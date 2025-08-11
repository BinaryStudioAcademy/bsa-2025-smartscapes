import { type Repository } from "~/libs/types/types.js";
import {
	type AuthenticatedUserPatchRequestDto,
	type UserPasswordDetails,
} from "~/modules/users/libs/types/types.js";
import { UserEntity } from "~/modules/users/user.entity.js";
import { type UserModel } from "~/modules/users/user.model.js";

class UserRepository implements Repository {
	private userModel: typeof UserModel;

	public constructor(userModel: typeof UserModel) {
		this.userModel = userModel;
	}

	public async create(entity: UserEntity): Promise<UserEntity> {
		const { email, firstName, lastName, passwordHash, passwordSalt } =
			entity.toNewObject();

		const user = await this.userModel
			.query()
			.insert({
				email,
				firstName,
				lastName,
				passwordHash,
				passwordSalt,
			})
			.returning("*")
			.execute();

		return UserEntity.initialize(user);
	}

	public async findAll(): Promise<UserEntity[]> {
		const users = await this.userModel.query().execute();

		return users.map((user) => UserEntity.initialize(user));
	}

	public async findByEmail(email: string): Promise<null | UserEntity> {
		const user = await this.userModel.query().where("email", email).first();

		return user ? UserEntity.initialize(user) : null;
	}

	public async findById(id: number): Promise<null | UserEntity> {
		const user = await this.userModel.query().findById(id);

		return user ? UserEntity.initialize(user) : null;
	}

	public async findPasswordDetails(
		email: string,
	): Promise<null | UserPasswordDetails> {
		const user = await this.userModel
			.query()
			.select(
				"id",
				"passwordHash",
				"passwordSalt",
				"email",
				"firstName",
				"lastName",
			)
			.where("email", email)
			.first();

		return user ?? null;
	}

	public async patch(
		id: number,
		payload: AuthenticatedUserPatchRequestDto,
	): Promise<null | UserEntity> {
		const { firstName, lastName } = payload;

		const [updatedRow] = await this.userModel
			.query()
			.patch({ firstName, lastName })
			.where("id", "=", id)
			.returning("*")
			.execute();

		return updatedRow ? UserEntity.initialize(updatedRow) : null;
	}
}

export { UserRepository };
