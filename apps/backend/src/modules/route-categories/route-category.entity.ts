import { type Entity } from "~/libs/types/types.js";

type Constructor = {
	id: null | number;
	name: string;
};

class RouteCategoryEntity implements Entity {
	private id: null | number;

	private name: string;

	private constructor({ id, name }: Constructor) {
		this.id = id;
		this.name = name;
	}

	public static initialize({
		id,
		name,
	}: {
		id: number;
		name: string;
	}): RouteCategoryEntity {
		return new RouteCategoryEntity({ id, name });
	}

	public static initializeNew({ name }: { name: string }): RouteCategoryEntity {
		return new RouteCategoryEntity({ id: null, name });
	}

	public toNewObject(): { name: string } {
		return { name: this.name };
	}

	public toObject(): { id: number; name: string } {
		return { id: this.id as number, name: this.name };
	}
}

export { RouteCategoryEntity };
