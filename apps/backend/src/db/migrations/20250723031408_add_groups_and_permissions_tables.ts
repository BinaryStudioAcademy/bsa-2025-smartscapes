import { type Knex } from "knex";

const TableName = {
	GROUPS: "groups",
	GROUPS_TO_PERMISSIONS: "groups_to_permissions",
	PERMISSIONS: "permissions",
	USERS: "users",
} as const;

const ColumnName = {
	CREATED_AT: "created_at",
	GROUP_ID: "group_id",
	ID: "id",
	KEY: "key",
	NAME: "name",
	PERMISSION_ID: "permission_id",
	UPDATED_AT: "updated_at",
} as const;

async function down(knex: Knex): Promise<void> {
	await knex.transaction(async (trx) => {
		await trx.schema.alterTable(TableName.USERS, (table) => {
			table.dropColumn(ColumnName.GROUP_ID);
		});

		await trx.schema.dropTableIfExists(TableName.GROUPS_TO_PERMISSIONS);
		await trx.schema.dropTableIfExists(TableName.PERMISSIONS);
		await trx.schema.dropTableIfExists(TableName.GROUPS);
	});
}

async function up(knex: Knex): Promise<void> {
	await knex.transaction(async (trx) => {
		await trx.schema.createTable(TableName.GROUPS, (table) => {
			table.increments(ColumnName.ID).primary();
			table
				.timestamp(ColumnName.CREATED_AT)
				.notNullable()
				.defaultTo(trx.fn.now());
			table
				.timestamp(ColumnName.UPDATED_AT)
				.notNullable()
				.defaultTo(trx.fn.now());
			table.string(ColumnName.KEY).notNullable().unique();
			table.string(ColumnName.NAME).notNullable();
		});

		await trx.schema.createTable(TableName.PERMISSIONS, (table) => {
			table.increments(ColumnName.ID).primary();
			table
				.timestamp(ColumnName.CREATED_AT)
				.notNullable()
				.defaultTo(trx.fn.now());
			table
				.timestamp(ColumnName.UPDATED_AT)
				.notNullable()
				.defaultTo(trx.fn.now());
			table.string(ColumnName.KEY).notNullable().unique();
			table.string(ColumnName.NAME).notNullable();
		});

		await trx.schema.createTable(TableName.GROUPS_TO_PERMISSIONS, (table) => {
			table.increments(ColumnName.ID).primary();
			table
				.timestamp(ColumnName.CREATED_AT)
				.notNullable()
				.defaultTo(trx.fn.now());
			table
				.timestamp(ColumnName.UPDATED_AT)
				.notNullable()
				.defaultTo(trx.fn.now());
			table
				.integer(ColumnName.GROUP_ID)
				.notNullable()
				.references(ColumnName.ID)
				.inTable(TableName.GROUPS)
				.onDelete("CASCADE");
			table
				.integer(ColumnName.PERMISSION_ID)
				.notNullable()
				.references(ColumnName.ID)
				.inTable(TableName.PERMISSIONS)
				.onDelete("CASCADE");
		});

		await trx.schema.alterTable(TableName.USERS, (table) => {
			table
				.integer(ColumnName.GROUP_ID)
				.nullable()
				.references(ColumnName.ID)
				.inTable(TableName.GROUPS)
				.onDelete("SET NULL");
		});
	});
}

export { down, up };
