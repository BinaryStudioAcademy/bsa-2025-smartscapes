import { GroupModel } from "./group.model.js";
import { GroupRepository } from "./group.repository.js";
import { GroupService } from "./group.service.js";

const groupRepository = new GroupRepository(GroupModel);
const groupService = new GroupService(groupRepository);

export { groupService };
