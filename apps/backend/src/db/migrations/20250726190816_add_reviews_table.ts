import { type Knex } from "knex";

const TABLE_NAME = "reviews";

const ColumnName = {
	CONTENT: "content",
	CREATED_AT: "created_at",
	ID: "id",
	LIKES_COUNT: "likes_count",
	POI_ID: "poi_id",
	ROUTE_ID: "route_id",
	UPDATED_AT: "updated_at",
	USER_ID: "user_id",
} as const;

async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTableIfExists(TABLE_NAME);
}

async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable(TABLE_NAME, (table) => {
		table.increments(ColumnName.ID).primary();
		table
			.dateTime(ColumnName.CREATED_AT)
			.notNullable()
			.defaultTo(knex.fn.now());
		table
			.dateTime(ColumnName.UPDATED_AT)
			.notNullable()
			.defaultTo(knex.fn.now());
		table.integer(ColumnName.USER_ID).notNullable();
		table.text(ColumnName.CONTENT);
		table.integer(ColumnName.LIKES_COUNT).defaultTo(0);
		table.integer(ColumnName.ROUTE_ID).nullable();
		table.integer(ColumnName.POI_ID).nullable();
	});
}

export { down, up };
