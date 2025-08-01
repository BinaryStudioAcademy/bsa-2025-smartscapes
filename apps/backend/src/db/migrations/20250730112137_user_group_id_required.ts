import { type Knex } from "knex";

const TABLE_NAME = "users";

const ColumnName = {
	GROUP_ID: "group_id",
} as const;

async function down(knex: Knex): Promise<void> {
	await knex.schema.alterTable(TABLE_NAME, (table) => {
		table.integer(ColumnName.GROUP_ID).nullable().alter();
	});
}

async function up(knex: Knex): Promise<void> {
	await knex(TABLE_NAME)
		.whereNull(ColumnName.GROUP_ID)
		.update({ [ColumnName.GROUP_ID]: 2 });

	await knex.schema.alterTable(TABLE_NAME, (table) => {
		table.integer(ColumnName.GROUP_ID).notNullable().alter();
	});
}

export { down, up };
