import { type Knex } from "knex";

const TableNames = {
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
	await knex.schema.alterTable(TableNames.USERS, (table) => {
		table.dropColumn(ColumnName.GROUP_ID);
	});

	await knex.schema.dropTableIfExists(TableNames.GROUPS_TO_PERMISSIONS);
	await knex.schema.dropTableIfExists(TableNames.PERMISSIONS);
	await knex.schema.dropTableIfExists(TableNames.GROUPS);
}

async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable(TableNames.GROUPS, (table) => {
		table.increments(ColumnName.ID).primary();
		table
			.timestamp(ColumnName.CREATED_AT)
			.notNullable()
			.defaultTo(knex.fn.now());
		table
			.timestamp(ColumnName.UPDATED_AT)
			.notNullable()
			.defaultTo(knex.fn.now());
		table.string(ColumnName.KEY).notNullable().unique();
		table.string(ColumnName.NAME).notNullable();
	});

	await knex.schema.createTable(TableNames.PERMISSIONS, (table) => {
		table.increments(ColumnName.ID).primary();
		table
			.timestamp(ColumnName.CREATED_AT)
			.notNullable()
			.defaultTo(knex.fn.now());
		table
			.timestamp(ColumnName.UPDATED_AT)
			.notNullable()
			.defaultTo(knex.fn.now());
		table.string(ColumnName.KEY).notNullable().unique();
		table.string(ColumnName.NAME).notNullable();
	});

	await knex.schema.createTable(TableNames.GROUPS_TO_PERMISSIONS, (table) => {
		table.increments(ColumnName.ID).primary();
		table
			.timestamp(ColumnName.CREATED_AT)
			.notNullable()
			.defaultTo(knex.fn.now());
		table
			.timestamp(ColumnName.UPDATED_AT)
			.notNullable()
			.defaultTo(knex.fn.now());
		table
			.integer(ColumnName.GROUP_ID)
			.notNullable()
			.references(ColumnName.ID)
			.inTable(TableNames.GROUPS)
			.onDelete("CASCADE");
		table
			.integer(ColumnName.PERMISSION_ID)
			.notNullable()
			.references(ColumnName.ID)
			.inTable(TableNames.PERMISSIONS)
			.onDelete("CASCADE");
	});

	await knex.schema.alterTable(TableNames.USERS, (table) => {
		table
			.integer(ColumnName.GROUP_ID)
			.nullable()
			.references(ColumnName.ID)
			.inTable(TableNames.GROUPS)
			.onDelete("SET NULL");
	});
}

export { down, up };
