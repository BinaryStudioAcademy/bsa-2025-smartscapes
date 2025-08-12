import { type Knex } from "knex";

const TableName = {
	GROUPS: "groups",
	USERS: "users",
} as const;

const GROUP_KEY = "admins";

const ColumnName = {
	EMAIL: "email",
	ID: "id",
	KEY: "key",
} as const;

type IdRecord = { id: number };

const SUPERADMIN_EMAIL = "asmith@smart-scapes.com";

async function down(knex: Knex): Promise<void> {
	await knex(TableName.USERS).where(ColumnName.EMAIL, SUPERADMIN_EMAIL).del();
}

async function up(knex: Knex): Promise<void> {
	await knex.transaction(async (trx) => {
		const group = await trx<IdRecord>(TableName.GROUPS)
			.select(ColumnName.ID)
			.where(ColumnName.KEY, GROUP_KEY)
			.first();

		if (!group) {
			throw new Error(`Group "${GROUP_KEY}" not found`);
		}

		await trx(TableName.USERS).insert({
			created_at: trx.fn.now(),
			email: SUPERADMIN_EMAIL,
			first_name: "Anna",
			group_id: group.id,
			last_name: "Smith",
			password_hash:
				"$2b$10$hT3tqQLq08s0i7rLgSQi/uU/4PODBIW0ZNH6qQfrYzPvYvtZZ1.zO",
			password_salt: "$2b$10$hT3tqQLq08s0i7rLgSQi/u",
			updated_at: trx.fn.now(),
		});
	});
}

export { down, up };
