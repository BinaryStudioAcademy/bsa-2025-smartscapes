import { type Knex } from "knex";

const TABLE_NAME = "points_of_interest";

const ColumnName = {
	LOCATION: "location",
} as const;

async function down(knex: Knex): Promise<void> {
	await knex.schema.alterTable(TABLE_NAME, (table) => {
		table.dropColumn(ColumnName.LOCATION);
	});
}

async function up(knex: Knex): Promise<void> {
	await knex.schema.alterTable(TABLE_NAME, (table) => {
		table.specificType(ColumnName.LOCATION, "geometry(Point, 4326)");
	});
}

export { down, up };
