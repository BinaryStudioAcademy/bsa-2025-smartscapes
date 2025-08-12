import { type Knex } from "knex";

const TABLE_NAME = "users";

const ColumnName = {
	FIRST_NAME: "first_name",
	LAST_NAME: "last_name",
} as const;

function down(knex: Knex): Promise<void> {
	return knex.schema.alterTable(TABLE_NAME, (table) => {
		table.dropColumn(ColumnName.FIRST_NAME);
		table.dropColumn(ColumnName.LAST_NAME);
	});
}

function up(knex: Knex): Promise<void> {
	return knex.schema.alterTable(TABLE_NAME, (table) => {
		table.string(ColumnName.FIRST_NAME).notNullable();
		table.string(ColumnName.LAST_NAME).notNullable();
	});
}

export { down, up };
