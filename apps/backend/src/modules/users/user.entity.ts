import { type Entity } from "~/libs/types/types.js";

class UserEntity implements Entity {
	private email: string;

	private firstName: string;

	private id: null | number;

	private lastName: string;

	private passwordHash: string;

	private passwordSalt: string;

	private constructor({
		email,
		firstName,
		id,
		lastName,
		passwordHash,
		passwordSalt,
	}: {
		email: string;
		firstName: string;
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
	}

	public static initialize({
		email,
		firstName,
		id,
		lastName,
		passwordHash,
		passwordSalt,
	}: {
		email: string;
		firstName: string;
		id: number;
		lastName: string;
		passwordHash: string;
		passwordSalt: string;
	}): UserEntity {
		return new UserEntity({
			email,
			firstName,
			id,
			lastName,
			passwordHash,
			passwordSalt,
		});
	}

	public static initializeNew({
		email,
		firstName,
		lastName,
		passwordHash,
		passwordSalt,
	}: {
		email: string;
		firstName: string;
		lastName: string;
		passwordHash: string;
		passwordSalt: string;
	}): UserEntity {
		return new UserEntity({
			email,
			firstName,
			id: null,
			lastName,
			passwordHash,
			passwordSalt,
		});
	}

	public getId(): number {
		if (this.id === null) {
			throw new Error(
				"User id is null. It is not possible to create token for a user without an id.",
			);
		}

		return this.id;
	}

	public getPasswordHash(): string {
		return this.passwordHash;
	}

	public getPasswordSalt(): string {
		return this.passwordSalt;
	}

	public toNewObject(): {
		email: string;
		firstName: string;
		lastName: string;
		passwordHash: string;
		passwordSalt: string;
	} {
		return {
			email: this.email,
			firstName: this.firstName,
			lastName: this.lastName,
			passwordHash: this.passwordHash,
			passwordSalt: this.passwordSalt,
		};
	}

	public toObject(): {
		email: string;
		firstName: string;
		id: number;
		lastName: string;
	} {
		return {
			email: this.email,
			firstName: this.firstName,
			id: this.id as number,
			lastName: this.lastName,
		};
	}
}

export { UserEntity };
