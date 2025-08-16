import { type Knex } from "knex";

const TableName = {
	CATEGORIES: "categories",
	ROUTE_CATEGORIES: "route_categories",
	ROUTES: "routes",
};

const ColumnName = {
	CATEGORY_ID: "category_id",
	CREATED_AT: "created_at",
	ID: "id",
	KEY: "key",
	NAME: "name",
	ROUTE_ID: "route_id",
	UPDATED_AT: "updated_at",
};

const MAX_NAME_LENGTH = 100;

async function down(knex: Knex): Promise<void> {
	await knex.transaction(async (trx) => {
		await trx.schema.alterTable(TableName.ROUTE_CATEGORIES, (table) => {
			table.dropColumn(ColumnName.CATEGORY_ID);
			table.dropColumn(ColumnName.ROUTE_ID);
			table.string(ColumnName.NAME).unique();
		});

		await trx.schema.dropTableIfExists(TableName.CATEGORIES);
	});
}

async function up(knex: Knex): Promise<void> {
	await knex.transaction(async (trx) => {
		await trx.schema.createTable(TableName.CATEGORIES, (table) => {
			table.increments(ColumnName.ID).primary();
			table
				.timestamp(ColumnName.CREATED_AT)
				.notNullable()
				.defaultTo(trx.fn.now());
			table
				.timestamp(ColumnName.UPDATED_AT)
				.notNullable()
				.defaultTo(trx.fn.now());
			table.string(ColumnName.KEY, MAX_NAME_LENGTH).unique().notNullable();
			table.string(ColumnName.NAME, MAX_NAME_LENGTH).notNullable();
		});

		await trx.schema.alterTable(TableName.ROUTE_CATEGORIES, (table) => {
			table.dropColumn(ColumnName.NAME);

			table
				.integer(ColumnName.CATEGORY_ID)
				.notNullable()
				.references(ColumnName.ID)
				.inTable(TableName.CATEGORIES)
				.onDelete("CASCADE");

			table
				.integer(ColumnName.ROUTE_ID)
				.notNullable()
				.references(ColumnName.ID)
				.inTable(TableName.ROUTES)
				.onDelete("CASCADE");
		});
	});
}

export { down, up };
