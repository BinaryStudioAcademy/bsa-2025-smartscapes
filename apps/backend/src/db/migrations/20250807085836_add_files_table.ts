import { type Knex } from "knex";

const TABLE_NAME = "files";

const ColumnName = {
	CONTENT_TYPE: "content_type",
	CREATED_AT: "created_at",
	ID: "id",
	UPDATED_AT: "updated_at",
	URL: "url",
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
		table.string(ColumnName.URL).unique().notNullable();
		table.string(ColumnName.CONTENT_TYPE).notNullable();
	});
}

export { down, up };
