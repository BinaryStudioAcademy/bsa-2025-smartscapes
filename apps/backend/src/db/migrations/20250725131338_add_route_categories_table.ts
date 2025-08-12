import { type Knex } from "knex";

const TABLE_NAME = "route_categories";

const ColumnName = {
	CREATED_AT: "created_at",
	ID: "id",
	NAME: "name",
	UPDATED_AT: "updated_at",
} as const;

function down(knex: Knex): Promise<void> {
	return knex.schema.dropTableIfExists(TABLE_NAME);
}

function up(knex: Knex): Promise<void> {
	return knex.schema.createTable(TABLE_NAME, (table) => {
		table.increments(ColumnName.ID).primary();
		table
			.dateTime(ColumnName.CREATED_AT)
			.notNullable()
			.defaultTo(knex.fn.now());
		table
			.dateTime(ColumnName.UPDATED_AT)
			.notNullable()
			.defaultTo(knex.fn.now());
		table.string(ColumnName.NAME).unique().notNullable();
	});
}

export { down, up };
