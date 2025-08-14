import { type Knex } from "knex";

const TABLE_NAME = "users";

function down(knex: Knex): Promise<void> {
	return knex.schema.alterTable(TABLE_NAME, (table) => {
		table.dropColumn("is_visible_profile");
	});
}

function up(knex: Knex): Promise<void> {
	return knex.schema.alterTable(TABLE_NAME, (table) => {
		table.boolean("is_visible_profile").defaultTo(true).notNullable();
	});
}

export { down, up };
