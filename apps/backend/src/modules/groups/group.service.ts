import { type CollectionResult } from "~/libs/types/collection-result.type.js";
import { type Service } from "~/libs/types/service.type.js";

import { type GroupEntity } from "./group.entity.js";
import { type GroupRepository } from "./group.repository.js";
import {
	GroupError,
	HTTPCode,
} from "./libs/exceptions/group-not-found.exception.js";
import {
	GroupExceptionMessage,
	type GroupResponseDto,
} from "./libs/types/types.js";

class GroupService implements Service<GroupResponseDto> {
	private groupRepository: GroupRepository;

	public constructor(groupRepository: GroupRepository) {
		this.groupRepository = groupRepository;
	}

	public async create(payload: GroupEntity): Promise<GroupResponseDto> {
		const item = await this.groupRepository.create(payload);

		return item.toObject();
	}

	public async find(id: number): Promise<GroupResponseDto> {
		const group = await this.groupRepository.find(id);

		if (!group) {
			throw new GroupError({
				message: GroupExceptionMessage.GROUP_NOT_FOUND,
				status: HTTPCode.INTERNAL_SERVER_ERROR,
			});
		}

		return group.toObject();
	}

	public async findAll(): Promise<CollectionResult<GroupResponseDto>> {
		const groups = await this.groupRepository.findAll();

		return {
			items: groups.map((group) => group.toObject()),
		};
	}

	public async findByKey(key: string): Promise<GroupResponseDto> {
		const group = await this.groupRepository.findByKey(key);

		if (!group) {
			throw new GroupError({
				message: GroupExceptionMessage.GROUP_NOT_FOUND,
				status: HTTPCode.INTERNAL_SERVER_ERROR,
			});
		}

		return group.toObject();
	}
}

export { GroupService };
