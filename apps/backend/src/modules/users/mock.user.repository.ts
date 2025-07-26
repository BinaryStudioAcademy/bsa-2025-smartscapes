import { mock } from "node:test";

import { type UserEntity } from "~/modules/users/user.entity.js";
import { type UserModel } from "~/modules/users/user.model.js";
import { UserRepository } from "~/modules/users/user.repository.js";

const mockCreate = mock.fn((): Promise<UserEntity> => {
	return Promise.resolve({} as UserEntity);
});

const mockFindAll = mock.fn((): Promise<UserEntity[]> => {
	return Promise.resolve([]);
});

const mockFindByEmail = mock.fn((): Promise<null | UserEntity> => {
	return Promise.resolve(null);
});

class MockUserRepository extends UserRepository {
	public create = mockCreate;

	public findAll = mockFindAll;

	public findByEmail = mockFindByEmail;

	public constructor(userModel: typeof UserModel) {
		super(userModel);
	}
}

export { MockUserRepository };
