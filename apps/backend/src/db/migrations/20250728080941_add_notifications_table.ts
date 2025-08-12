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

const NotificationEntityType = {
	USERS: "users",
} as const;

async function down(knex: Knex): Promise<void> {
	await knex.transaction(async (trx) => {
		await trx.schema.dropTableIfExists(TABLE_NAME);
		await trx.raw("DROP TYPE IF EXISTS notification_type");
		await trx.raw("DROP TYPE IF EXISTS notification_entity_type");
	});
}

async function up(knex: Knex): Promise<void> {
	await knex.transaction(async (trx) => {
		await trx.raw(`
			CREATE TYPE notification_type AS ENUM ('${Object.values(NotificationType).join("', '")}')
		`);

		await trx.raw(`
			CREATE TYPE notification_entity_type AS ENUM ('${Object.values(NotificationEntityType).join("', '")}')
		`);

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
				.references(ColumnName.ID)
				.inTable(USERS_TABLE_NAME)
				.onDelete("CASCADE");

			table
				.specificType(ColumnName.NOTIFICATION_TYPE, "notification_type")
				.notNullable();
			table
				.specificType(ColumnName.ENTITY_TYPE, "notification_entity_type")
				.notNullable();
			table.integer(ColumnName.ENTITY_ID).notNullable();
			table.text(ColumnName.CONTENT).notNullable();
			table.dateTime(ColumnName.READ_AT).nullable();
		});
	});
}

export { down, up };
