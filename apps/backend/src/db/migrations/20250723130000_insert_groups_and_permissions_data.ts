import { type Knex } from "knex";

type GroupRecord = { id: number; key: string };

type IdRecord = { id: number };

const TableName = {
	GROUPS: "groups",
	GROUPS_TO_PERMISSIONS: "groups_to_permissions",
	PERMISSIONS: "permissions",
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
		const group = await trx<IdRecord>(TableName.GROUPS)
			.select(ColumnName.ID)
			.where(ColumnName.KEY, "admins")
			.first();

		const permission = await trx<IdRecord>(TableName.PERMISSIONS)
			.select(ColumnName.ID)
			.where(ColumnName.KEY, "create_route")
			.first();

		if (group?.id && permission?.id) {
			await trx(TableName.GROUPS_TO_PERMISSIONS)
				.where({
					[ColumnName.GROUP_ID]: group.id,
					[ColumnName.PERMISSION_ID]: permission.id,
				})
				.delete();
		}

		await trx(TableName.PERMISSIONS)
			.where(ColumnName.KEY, "create_route")
			.delete();

		await trx(TableName.GROUPS)
			.whereIn(ColumnName.KEY, ["admins", "users"])
			.delete();
	});
}

async function up(knex: Knex): Promise<void> {
	await knex.transaction(async (trx) => {
		const insertedGroups = (await trx(TableName.GROUPS)
			.insert([
				{
					[ColumnName.CREATED_AT]: trx.fn.now(),
					[ColumnName.KEY]: "admins",
					[ColumnName.NAME]: "Admins",
					[ColumnName.UPDATED_AT]: trx.fn.now(),
				},
				{
					[ColumnName.CREATED_AT]: trx.fn.now(),
					[ColumnName.KEY]: "users",
					[ColumnName.NAME]: "Users",
					[ColumnName.UPDATED_AT]: trx.fn.now(),
				},
			])
			.returning(["id", "key"])) as GroupRecord[];

		const group = insertedGroups.find((g) => g.key === "admins");

		const [permission] = (await trx(TableName.PERMISSIONS)
			.insert({
				[ColumnName.CREATED_AT]: trx.fn.now(),
				[ColumnName.KEY]: "create_route",
				[ColumnName.NAME]: "Create Route",
				[ColumnName.UPDATED_AT]: trx.fn.now(),
			})
			.returning(["id"])) as IdRecord[];

		await trx(TableName.GROUPS_TO_PERMISSIONS).insert({
			[ColumnName.CREATED_AT]: trx.fn.now(),
			[ColumnName.GROUP_ID]: group?.id,
			[ColumnName.PERMISSION_ID]: permission?.id,
			[ColumnName.UPDATED_AT]: trx.fn.now(),
		});
	});
}

export { down, up };
