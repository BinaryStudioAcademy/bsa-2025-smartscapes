import { type Knex } from "knex";

async function down(knex: Knex): Promise<void> {
	await knex.raw("DROP EXTENSION IF EXISTS postgis");
}

async function up(knex: Knex): Promise<void> {
	await knex.raw("CREATE EXTENSION IF NOT EXISTS postgis");
}

export { down, up };
