import { type Knex } from "knex";

const TABLE_NAME = "users";

const ColumnName = {
	CREATED_AT: "created_at",
	EMAIL: "email",
	FIRST_NAME: "first_name",
	ID: "id",
	LAST_NAME: "last_name",
	PASSWORD_HASH: "password_hash",
	PASSWORD_SALT: "password_salt",
	UPDATED_AT: "updated_at",
} as const;

function down(knex: Knex): Promise<void> {
	return knex.schema.dropTableIfExists(TABLE_NAME);
}

function up(knex: Knex): Promise<void> {
	return knex.schema.createTable(TABLE_NAME, (table) => {
		table.increments(ColumnName.ID).primary();
		table.string(ColumnName.EMAIL).unique().notNullable();
		table.string(ColumnName.FIRST_NAME).notNullable();
		table.string(ColumnName.LAST_NAME).notNullable();
		table.text(ColumnName.PASSWORD_HASH).notNullable();
		table.text(ColumnName.PASSWORD_SALT).notNullable();
		table
			.dateTime(ColumnName.CREATED_AT)
			.notNullable()
			.defaultTo(knex.fn.now());
		table
			.dateTime(ColumnName.UPDATED_AT)
			.notNullable()
			.defaultTo(knex.fn.now());
	});
}

export { down, up };
