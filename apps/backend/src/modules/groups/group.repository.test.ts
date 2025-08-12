import knex from "knex";
import { createTracker, MockClient, type Tracker } from "knex-mock-client";
import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";

import { GroupEntity } from "./group.entity.js";
import { GroupModel } from "./group.model.js";
import { GroupRepository } from "./group.repository.js";
import { GroupKey } from "./libs/enums/enums.js";

describe("GroupRepository", () => {
	let repository: GroupRepository;
	let tracker: Tracker;

	const USER_GROUP_ID = 2;

	const mockGroup: Parameters<typeof GroupEntity.initialize>[0] = {
		id: 1,
		key: GroupKey.USERS,
		name: "Users",
	};

	beforeEach(() => {
		const database = knex({ client: MockClient });
		tracker = createTracker(database);

		GroupModel.knex(database);
		repository = new GroupRepository(GroupModel);
	});

	afterEach(() => {
		tracker.reset();
	});

	it("insert and return new group", async () => {
		const groupEntity = GroupEntity.initialize(mockGroup);
		tracker.on.insert("groups").response([groupEntity.toObject()]);

		const result = await repository.create(groupEntity);

		assert.deepEqual(result, groupEntity);
	});

	it("findAll should return all groups", async () => {
		const expected = [GroupEntity.initialize(mockGroup)];
		tracker.on.select("groups").response([mockGroup]);

		const result = await repository.findAll();

		assert.deepEqual(result, expected);
	});

	it("findById should return a group by ID", async () => {
		tracker.on.select("groups").response([mockGroup]);

		const result = await repository.find(USER_GROUP_ID);

		assert.deepEqual(result, GroupEntity.initialize(mockGroup));
	});

	it("findByKey should return a group by key", async () => {
		tracker.on.select("groups").response([mockGroup]);

		const result = await repository.findByKey(mockGroup.name);

		assert.deepEqual(result, GroupEntity.initialize(mockGroup));
	});
});
