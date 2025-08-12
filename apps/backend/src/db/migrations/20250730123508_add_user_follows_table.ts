import { type Knex } from "knex";

const TABLE_NAME = "user_follows";
const REF_TABLE_NAME = "users";

const ColumnName = {
	CREATED_AT: "created_at",
	FOLLOWER_ID: "follower_id",
	FOLLOWING_ID: "following_id",
	ID: "id",
	UPDATED_AT: "updated_at",
} as const;

function down(knex: Knex): Promise<void> {
	return knex.schema.dropTableIfExists(TABLE_NAME);
}

function up(knex: Knex): Promise<void> {
	return knex.schema.createTable(TABLE_NAME, (table) => {
		table.increments(ColumnName.ID).primary();

		table
			.integer(ColumnName.FOLLOWER_ID)
			.notNullable()
			.references(ColumnName.ID)
			.inTable(REF_TABLE_NAME)
			.onDelete("CASCADE");

		table
			.integer(ColumnName.FOLLOWING_ID)
			.notNullable()
			.references(ColumnName.ID)
			.inTable(REF_TABLE_NAME)
			.onDelete("CASCADE");

		table
			.timestamp(ColumnName.CREATED_AT)
			.notNullable()
			.defaultTo(knex.fn.now());

		table
			.timestamp(ColumnName.UPDATED_AT)
			.notNullable()
			.defaultTo(knex.fn.now());

		table.unique([ColumnName.FOLLOWER_ID, ColumnName.FOLLOWING_ID]);
	});
}

export { down, up };
