import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { GroupEntity } from "./group.entity.js";
import { GroupKey } from "./libs/enums/enums.js";

describe("GroupEntity", () => {
	it("create group entity with id", () => {
		const groupData = {
			id: 1,
			key: GroupKey.ADMINS,
			name: "Administrators",
			permissions: [],
		};

		const groupEntity = GroupEntity.initialize(groupData);
		const result = groupEntity.toObject();

		assert.strictEqual(result.id, groupData.id);
		assert.strictEqual(result.key, groupData.key);
		assert.strictEqual(result.name, groupData.name);
	});

	it("initialize new group entity without id", () => {
		const groupData = {
			key: GroupKey.ADMINS,
			name: "Regular Users",
		};

		const groupEntity = GroupEntity.initializeNew(groupData);
		const result = groupEntity.toNewObject();

		assert.strictEqual(result.key, groupData.key);
		assert.strictEqual(result.name, groupData.name);
	});
});
