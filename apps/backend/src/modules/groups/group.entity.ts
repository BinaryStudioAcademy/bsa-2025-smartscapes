import { type Entity, type ValueOf } from "~/libs/types/types.js";

import { type PermissionEntity } from "../permission/permission.entity.js";
import { type GroupKey } from "./libs/enums/enums.js";

class GroupEntity implements Entity {
	private id: null | number;
	private key: ValueOf<typeof GroupKey>;
	private name: string;
	private permissions: null | ReturnType<PermissionEntity["toObject"]>[];

	private constructor({
		id,
		key,
		name,
		permissions = [],
	}: {
		id: null | number;
		key: ValueOf<typeof GroupKey>;
		name: string;
		permissions?: ReturnType<PermissionEntity["toObject"]>[];
	}) {
		this.id = id;
		this.key = key;
		this.name = name;
		this.permissions = permissions;
	}

	public static initialize({
		id,
		key,
		name,
	}: {
		id: number;
		key: ValueOf<typeof GroupKey>;
		name: string;
	}): GroupEntity {
		return new GroupEntity({ id, key, name });
	}

	public static initializeNew({
		key,
		name,
	}: {
		key: ValueOf<typeof GroupKey>;
		name: string;
	}): GroupEntity {
		return new GroupEntity({
			id: null,
			key,
			name,
		});
	}

	public static initializeWithPermissions({
		id,
		key,
		name,
		permissions,
	}: {
		id: number;
		key: ValueOf<typeof GroupKey>;
		name: string;
		permissions: ReturnType<PermissionEntity["toObject"]>[];
	}): GroupEntity {
		return new GroupEntity({ id, key, name, permissions });
	}

	public toNewObject(): {
		key: ValueOf<typeof GroupKey>;
		name: string;
	} {
		return {
			key: this.key,
			name: this.name,
		};
	}

	public toObject(): {
		id: number;
		key: ValueOf<typeof GroupKey>;
		name: string;
		permissions: ReturnType<PermissionEntity["toObject"]>[];
	} {
		return {
			id: this.id as number,
			key: this.key,
			name: this.name,
			permissions: this.permissions ?? [],
		};
	}
}

export { GroupEntity };
