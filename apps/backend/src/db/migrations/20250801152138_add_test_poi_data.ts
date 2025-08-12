import { type Knex } from "knex";

const TABLE_NAME = "points_of_interest";

const createTestPoiData = (
	knex: Knex,
): { location: Knex.Raw; name: string }[] => [
	{
		location: knex.raw(
			"ST_GeomFromText('POINT(30.54774957435002 50.495672989398045)', 4326)",
		),
		name: "SUP Kayak Club 4 Storony",
	},
	{
		location: knex.raw(
			"ST_GeomFromText('POINT(30.59164450406016 50.435811951232914)', 4326)",
		),
		name: "River Grill, Rusanivska Embankment",
	},
	{
		location: knex.raw(
			"ST_GeomFromText('POINT(30.489360642633223 50.34604954584428)', 4326)",
		),
		name: "Feofaniya Lake Pavilion",
	},
	{
		location: knex.raw(
			"ST_GeomFromText('POINT(30.52891473160112 50.45525806052608)', 4326)",
		),
		name: "Glass Bridge",
	},
	{
		location: knex.raw(
			"ST_GeomFromText('POINT(30.51218977226998 50.45644495976739)', 4326)",
		),
		name: "Park Landscape Alley",
	},
	{
		location: knex.raw(
			"ST_GeomFromText('POINT(30.568354431825888 50.504871708811216)', 4326)",
		),
		name: "Plyazh Troeshchyna",
	},
];

async function down(knex: Knex): Promise<void> {
	const testData = createTestPoiData(knex);
	await knex(TABLE_NAME)
		.whereIn(
			"name",
			testData.map((poi) => poi.name),
		)
		.del();
}

async function up(knex: Knex): Promise<void> {
	const testData = createTestPoiData(knex);
	await knex(TABLE_NAME).insert(testData);
}

export { down, up };
