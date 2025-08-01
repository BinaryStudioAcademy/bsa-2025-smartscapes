import { GroupModel } from "../groups/group.model.js";
import { GroupRepository } from "../groups/group.repository.js";

const groupRepository = new GroupRepository(GroupModel);

export { groupRepository };
