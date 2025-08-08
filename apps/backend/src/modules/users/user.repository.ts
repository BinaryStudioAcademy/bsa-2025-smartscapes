import { type Repository } from "~/libs/types/types.js";
import { type UserPasswordDetails } from "~/modules/users/libs/types/types.js";
import { UserEntity } from "~/modules/users/user.entity.js";
import { type UserModel } from "~/modules/users/user.model.js";

import { GroupEntity } from "../groups/group.entity.js";
import { PermissionEntity } from "../permission/permission.entity.js";

class UserRepository implements Repository {
	private userModel: typeof UserModel;

	public constructor(userModel: typeof UserModel) {
		this.userModel = userModel;
	}

	public async create(entity: UserEntity): Promise<UserEntity> {
		const { email, firstName, groupId, lastName, passwordHash, passwordSalt } =
			entity.toNewObject();

		const user = await this.userModel
			.query()
			.insert({
				email,
				firstName,
				groupId,
				lastName,
				passwordHash,
				passwordSalt,
			})
			.returning("*")
			.execute();

		return UserEntity.initialize({
			email: user.email,
			firstName: user.firstName,
			group: user.group ? GroupEntity.initialize(user.group).toObject() : null,
			groupId: user.groupId,
			id: user.id,
			lastName: user.lastName,
			passwordHash: user.passwordHash,
			passwordSalt: user.passwordSalt,
		});
	}

	public async findAll(): Promise<UserEntity[]> {
		const users = await this.userModel
			.query()
			.select([
				"users.id",
				"firstName",
				"lastName",
				"users.group_id as groupId",
				"email",
				"groups.id",
				"groups.key as groupKey",
				"groups.name as groupName",
			])
			.innerJoin("groups", "users.group_id", "groups.id")
			.leftJoin(
				"groups_to_permissions",
				"groups.id",
				"groups_to_permissions.group_id",
			)
			.leftJoin(
				"permissions",
				"groups_to_permissions.permission_id",
				"permissions.id",
			)
			.execute();

		return users.map((user) =>
			UserEntity.initialize({
				email: user.email,
				firstName: user.firstName,
				group: user.group
					? GroupEntity.initialize(user.group).toObject()
					: null,
				groupId: user.groupId,
				id: user.id,
				lastName: user.lastName,
				passwordHash: user.passwordHash,
				passwordSalt: user.passwordSalt,
			}),
		);
	}

	public async findByEmail(email: string): Promise<null | UserEntity> {
		const user = await this.userModel
			.query()
			.where("email", email)
			.withGraphJoined("group.permissions")
			.first();

		if (!user) {
			return null;
		}

		return UserEntity.initialize({
			email: user.email,
			firstName: user.firstName,
			group: user.group
				? GroupEntity.initializeWithPermissions({
						id: user.group.id,
						key: user.group.key,
						name: user.group.name,
						permissions: user.group.permissions
							? user.group.permissions.map((per) =>
									PermissionEntity.initialize(per).toObject(),
								)
							: [],
					}).toObject()
				: null,
			groupId: user.groupId,
			id: user.id,
			lastName: user.lastName,
			passwordHash: user.passwordHash,
			passwordSalt: user.passwordSalt,
		});
	}

	public async findById(id: number): Promise<null | UserEntity> {
		const user = await this.userModel
			.query()
			.findById(id)
			.withGraphJoined("group.permissions")
			.first();

		if (!user) {
			return null;
		}

		return UserEntity.initialize({
			email: user.email,
			firstName: user.firstName,
			group: user.group
				? GroupEntity.initializeWithPermissions({
						id: user.group.id,
						key: user.group.key,
						name: user.group.name,
						permissions: user.group.permissions
							? user.group.permissions.map((per) =>
									PermissionEntity.initialize(per).toObject(),
								)
							: [],
					}).toObject()
				: null,
			groupId: user.groupId,
			id: user.id,
			lastName: user.lastName,
			passwordHash: user.passwordHash,
			passwordSalt: user.passwordSalt,
		});
	}

	public async findPasswordDetails(
		email: string,
	): Promise<null | UserPasswordDetails> {
		const user = await this.userModel
			.query()
			.select(
				"users.id",
				"users.first_name",
				"users.last_name",
				"users.password_hash as passwordHash",
				"users.password_salt as passwordSalt",
				"users.group_id as groupId",
			)
			.withGraphJoined("group.permissions")
			.where("users.email", email)
			.first();

		if (!user || !user.group || !user.group.permissions) {
			return null;
		}

		return {
			firstName: user.firstName,
			group: {
				id: user.group.id,
				key: user.group.key,
				name: user.group.name,
				permissions: user.group.permissions.map((permission) =>
					PermissionEntity.initialize({
						id: permission.id,
						key: permission.key,
						name: permission.name,
					}).toObject(),
				),
			},
			groupId: user.groupId,
			id: user.id,
			lastName: user.lastName,
			passwordHash: user.passwordHash,
			passwordSalt: user.passwordSalt,
		};
	}
}

export { UserRepository };
