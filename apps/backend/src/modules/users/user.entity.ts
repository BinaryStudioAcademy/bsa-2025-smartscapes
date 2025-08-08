import { type Entity } from "~/libs/types/types.js";

import { type GroupEntity } from "../groups/group.entity.js";

class UserEntity implements Entity {
	private email: string;

	private firstName: string;

	private group: null | ReturnType<GroupEntity["toObject"]>;

	private groupId: number;

	private id: null | number;

	private lastName: string;

	private passwordHash: string;

	private passwordSalt: string;

	private constructor({
		email,
		firstName,
		group,
		groupId,
		id,
		lastName,
		passwordHash,
		passwordSalt,
	}: {
		email: string;
		firstName: string;
		group: null | ReturnType<GroupEntity["toObject"]>;
		groupId: number;
		id: null | number;
		lastName: string;
		passwordHash: string;
		passwordSalt: string;
	}) {
		this.id = id;
		this.email = email;
		this.firstName = firstName;
		this.lastName = lastName;
		this.passwordHash = passwordHash;
		this.passwordSalt = passwordSalt;
		this.group = group;
		this.groupId = groupId;
	}

	public static initialize({
		email,
		firstName,
		group,
		groupId,
		id,
		lastName,
		passwordHash,
		passwordSalt,
	}: {
		email: string;
		firstName: string;
		group: null | ReturnType<GroupEntity["toObject"]>;
		groupId: number;
		id: number;
		lastName: string;
		passwordHash: string;
		passwordSalt: string;
	}): UserEntity {
		return new UserEntity({
			email,
			firstName,
			group,
			groupId,
			id,
			lastName,
			passwordHash,
			passwordSalt,
		});
	}

	public static initializeNew({
		email,
		firstName,
		groupId,
		lastName,
		passwordHash,
		passwordSalt,
	}: {
		email: string;
		firstName: string;
		groupId: number;
		lastName: string;
		passwordHash: string;
		passwordSalt: string;
	}): UserEntity {
		return new UserEntity({
			email,
			firstName,
			group: null,
			groupId,
			id: null,
			lastName,
			passwordHash,
			passwordSalt,
		});
	}

	public toNewObject(): {
		email: string;
		firstName: string;
		groupId: number;
		lastName: string;
		passwordHash: string;
		passwordSalt: string;
	} {
		return {
			email: this.email,
			firstName: this.firstName,
			groupId: this.groupId,
			lastName: this.lastName,
			passwordHash: this.passwordHash,
			passwordSalt: this.passwordSalt,
		};
	}

	public toObject(): {
		email: string;
		firstName: string;
		group: ReturnType<GroupEntity["toObject"]>;
		groupId: number;
		id: number;
		lastName: string;
	} {
		return {
			email: this.email,
			firstName: this.firstName,
			group: this.group as ReturnType<GroupEntity["toObject"]>,
			groupId: this.groupId,
			id: this.id as number,
			lastName: this.lastName,
		};
	}
}

export { UserEntity };
