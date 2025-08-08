import { type Repository } from "~/libs/types/types.js";
import { GroupEntity } from "~/modules/groups/group.entity.js";
import { type GroupModel } from "~/modules/groups/group.model.js";

class GroupRepository implements Repository {
	private groupModel: typeof GroupModel;

	public constructor(groupModel: typeof GroupModel) {
		this.groupModel = groupModel;
	}

	public async create(entity: GroupEntity): Promise<GroupEntity> {
		const { key, name } = entity.toNewObject();

		const group = await this.groupModel
			.query()
			.insert({ key, name })
			.returning("*")
			.execute();

		return GroupEntity.initialize(group);
	}

	public async find(id: number): Promise<GroupEntity | null> {
		const group = await this.groupModel.query().findById(id);

		return group ? GroupEntity.initialize(group) : null;
	}

	public async findAll(): Promise<GroupEntity[]> {
		const groups = await this.groupModel.query().execute();

		return groups.map((group) => GroupEntity.initialize(group));
	}

	public async findByKey(key: string): Promise<GroupEntity | null> {
		const group = await this.groupModel.query().where("key", key).first();

		return group ? GroupEntity.initialize(group) : null;
	}
}

export { GroupRepository };
