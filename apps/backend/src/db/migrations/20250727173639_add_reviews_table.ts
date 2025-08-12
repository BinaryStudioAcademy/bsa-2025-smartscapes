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
	await knex.transaction(async (trx) => {
		await trx.schema.createTable(TABLE_NAME, (table) => {
			table.increments(ColumnName.ID).primary();
			table
				.dateTime(ColumnName.CREATED_AT)
				.notNullable()
				.defaultTo(trx.fn.now());
			table
				.dateTime(ColumnName.UPDATED_AT)
				.notNullable()
				.defaultTo(trx.fn.now());
			table
				.integer(ColumnName.USER_ID)
				.notNullable()
				.references("id")
				.inTable("users")
				.onDelete("CASCADE");
			table.text(ColumnName.CONTENT).notNullable();
			table.integer(ColumnName.LIKES_COUNT).defaultTo(0);
			table
				.integer(ColumnName.ROUTE_ID)
				.references("id")
				.inTable("routes")
				.onDelete("CASCADE");
			table
				.integer(ColumnName.POI_ID)
				.references("id")
				.inTable("points_of_interest")
				.onDelete("CASCADE");
		});

		await trx.raw(`
			ALTER TABLE "${TABLE_NAME}"
			ADD CONSTRAINT "check_route_or_poi"
			CHECK (
				(${ColumnName.ROUTE_ID} IS NOT NULL AND ${ColumnName.POI_ID} IS NULL)
				OR
				(${ColumnName.ROUTE_ID} IS NULL AND ${ColumnName.POI_ID} IS NOT NULL)
			)
		`);
	});
}

export { down, up };
