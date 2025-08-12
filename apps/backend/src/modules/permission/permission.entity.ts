import { type Entity } from "~/libs/types/types.js";

class PermissionEntity implements Entity {
	private id: number;
	private key: string;
	private name: string;

	private constructor({
		id,
		key,
		name,
	}: {
		id: number;
		key: string;
		name: string;
	}) {
		this.id = id;
		this.key = key;
		this.name = name;
	}

	public static initialize({
		id,
		key,
		name,
	}: {
		id: number;
		key: string;
		name: string;
	}): PermissionEntity {
		return new PermissionEntity({ id, key, name });
	}

	public toNewObject(): {
		key: string;
		name: string;
	} {
		return {
			key: this.key,
			name: this.name,
		};
	}
	public toObject(): {
		id: number;
		key: string;
		name: string;
	} {
		return {
			id: this.id,
			key: this.key,
			name: this.name,
		};
	}
}

export { PermissionEntity };
