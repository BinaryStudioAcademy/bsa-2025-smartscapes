import { type Entity } from "~/libs/types/types.js";

class CategoryEntity implements Entity {
	private id: null | number;
	private key: string;
	private name: string;

	private constructor({
		id,
		key,
		name,
	}: {
		id: null | number;
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
	}): CategoryEntity {
		return new CategoryEntity({ id, key, name });
	}

	public static initializeNew({
		key,
		name,
	}: {
		key: string;
		name: string;
	}): CategoryEntity {
		return new CategoryEntity({ id: null, key, name });
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
			id: this.id as number,
			key: this.key,
			name: this.name,
		};
	}
}

export { CategoryEntity };
