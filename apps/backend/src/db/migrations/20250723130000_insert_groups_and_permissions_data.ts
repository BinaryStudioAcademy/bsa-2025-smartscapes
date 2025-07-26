import { type Knex } from "knex";

type IdObject = { id: number };

type IdObjectList = IdObject[];

const TableNames = {
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
	const group = await knex<IdObject>(TableNames.GROUPS)
		.select(ColumnName.ID)
		.where(ColumnName.KEY, "admins")
		.first();

	const permission = await knex<IdObject>(TableNames.PERMISSIONS)
		.select(ColumnName.ID)
		.where(ColumnName.KEY, "create_route")
		.first();

	if (group?.id && permission?.id) {
		await knex(TableNames.GROUPS_TO_PERMISSIONS)
			.where({
				[ColumnName.GROUP_ID]: group.id,
				[ColumnName.PERMISSION_ID]: permission.id,
			})
			.delete();
	}

	await knex(TableNames.PERMISSIONS)
		.where(ColumnName.KEY, "create_route")
		.delete();

	await knex(TableNames.GROUPS)
		.whereIn(ColumnName.KEY, ["admins", "users"])
		.delete();
}

async function up(knex: Knex): Promise<void> {
	const now = new Date();

	await knex(TableNames.GROUPS).insert([
		{
			[ColumnName.CREATED_AT]: now,
			[ColumnName.KEY]: "admins",
			[ColumnName.NAME]: "Admins",
			[ColumnName.UPDATED_AT]: now,
		},
		{
			[ColumnName.CREATED_AT]: now,
			[ColumnName.KEY]: "users",
			[ColumnName.NAME]: "Users",
			[ColumnName.UPDATED_AT]: now,
		},
	]);

	await knex(TableNames.PERMISSIONS).insert({
		[ColumnName.CREATED_AT]: now,
		[ColumnName.KEY]: "create_route",
		[ColumnName.NAME]: "Create Route",
		[ColumnName.UPDATED_AT]: now,
	});

	const [group] = (await knex(TableNames.GROUPS)
		.select(ColumnName.ID)
		.where(ColumnName.KEY, "admins")) as IdObjectList;

	const [permission] = (await knex(TableNames.PERMISSIONS)
		.select(ColumnName.ID)
		.where(ColumnName.KEY, "create_route")) as IdObjectList;

	if (group && permission) {
		await knex(TableNames.GROUPS_TO_PERMISSIONS).insert({
			[ColumnName.CREATED_AT]: now,
			[ColumnName.GROUP_ID]: group.id,
			[ColumnName.PERMISSION_ID]: permission.id,
			[ColumnName.UPDATED_AT]: now,
		});
	}
}

export { down, up };
