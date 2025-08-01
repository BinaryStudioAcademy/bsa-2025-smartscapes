import { type Knex } from "knex";

const TABLE_NAME = "notifications";
const USERS_TABLE_NAME = "users";

const ColumnName = {
	CONTENT: "content",
	CREATED_AT: "created_at",
	ENTITY_ID: "entity_id",
	ENTITY_TYPE: "entity_type",
	ID: "id",
	NOTIFICATION_TYPE: "notification_type",
	READ_AT: "read_at",
	UPDATED_AT: "updated_at",
	USER_ID: "user_id",
} as const;

const NotificationType = {
	USER_FOLLOWED: "user_followed",
} as const;

const EntityType = {
	USERS: "users",
} as const;

async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTableIfExists(TABLE_NAME).then(async () => {
		await knex.raw("DROP TYPE IF EXISTS notification_type");
		await knex.raw("DROP TYPE IF EXISTS entity_type");
	});
}

async function up(knex: Knex): Promise<void> {
	await knex.raw(`
		CREATE TYPE notification_type AS ENUM ('${Object.values(NotificationType).join("', '")}')
	`);

	await knex.raw(`
		CREATE TYPE entity_type AS ENUM ('${Object.values(EntityType).join("', '")}')
	`);

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

		table
			.integer(ColumnName.USER_ID)
			.unsigned()
			.notNullable()
			.references(ColumnName.ID)
			.inTable(USERS_TABLE_NAME)
			.onDelete("CASCADE");

		table
			.specificType(ColumnName.NOTIFICATION_TYPE, "notification_type")
			.notNullable();
		table.specificType(ColumnName.ENTITY_TYPE, "entity_type").notNullable();
		table.integer(ColumnName.ENTITY_ID).notNullable();
		table.text(ColumnName.CONTENT).notNullable();
		table.dateTime(ColumnName.READ_AT).nullable();
	});
}

export { down, up };
