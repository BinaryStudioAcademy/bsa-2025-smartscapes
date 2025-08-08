import { type Knex } from "knex";

const TABLE_NAME = {
	GROUPS: "groups",
	USERS: "users",
} as const;

const ColumnName = {
	GROUP_ID: "group_id",
	ID: "id",
	KEY: "key",
} as const;

async function down(knex: Knex): Promise<void> {
	await knex.schema.alterTable(TABLE_NAME.USERS, (table) => {
		table.integer(ColumnName.GROUP_ID).nullable().alter();
	});
}

async function up(knex: Knex): Promise<void> {
	await knex.transaction(async (trx) => {
		await trx(TABLE_NAME.USERS)
			.whereNull(ColumnName.GROUP_ID)
			.update({
				[ColumnName.GROUP_ID]: knex(TABLE_NAME.GROUPS)
					.select(ColumnName.ID)
					.where(ColumnName.KEY, "users")
					.first(),
			});

		await trx.schema.alterTable(TABLE_NAME.USERS, (table) => {
			table.integer(ColumnName.GROUP_ID).notNullable().alter();
		});
	});
}

export { down, up };
