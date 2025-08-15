import { SortingOrder } from "~/libs/enums/enums.js";
import { type EntityPagination, type Repository } from "~/libs/types/types.js";
import {
	type PointsOfInterestFindAllOptions,
	type PointsOfInterestPaginatedOptions,
	type PointsOfInterestSearchQuery,
} from "~/modules/points-of-interest/libs/types/type.js";
import { PointsOfInterestEntity } from "~/modules/points-of-interest/points-of-interest.entity.js";
import { type PointsOfInterestModel } from "~/modules/points-of-interest/points-of-interest.model.js";

const PAGE_NUMBER_OFFSET = 1;

class PointsOfInterestRepository implements Repository {
	private pointsOfInterestModel: typeof PointsOfInterestModel;

	public constructor(pointsOfInterestModel: typeof PointsOfInterestModel) {
		this.pointsOfInterestModel = pointsOfInterestModel;
	}

	public async create(
		entity: PointsOfInterestEntity,
	): Promise<PointsOfInterestEntity> {
		const { description, location, name } = entity.toNewObject();

		const pointOfInterest = await this.pointsOfInterestModel
			.query()
			.insert({
				description,
				location,
				name,
			})
			.returning([
				"id",
				"name",
				"created_at",
				"updated_at",
				"description",
				this.pointsOfInterestModel.raw(
					"ST_AsGeoJSON(location)::json as location",
				),
			])
			.execute();

		return PointsOfInterestEntity.initialize(pointOfInterest);
	}

	public async delete(id: number): Promise<boolean> {
		const deletedCount = await this.pointsOfInterestModel
			.query()
			.deleteById(id)
			.execute();

		return Boolean(deletedCount);
	}

	public async findAll(
		options: null | PointsOfInterestFindAllOptions,
	): Promise<PointsOfInterestEntity[]> {
		const pointsOfInterest = await this.pointsOfInterestModel
			.query()
			.select([
				"id",
				"name",
				"created_at",
				"updated_at",
				"description",
				this.pointsOfInterestModel.raw(
					"ST_AsGeoJSON(location)::json as location",
				),
			])
			.modify((builder) => {
				if (options?.ids) {
					builder.whereIn("id", options.ids);
				}

				if (options?.name) {
					builder.whereILike("name", `%${options.name.trim()}%`);
				}
			})
			.execute();

		return pointsOfInterest.map((point) =>
			PointsOfInterestEntity.initialize(point),
		);
	}

	public async findById(id: number): Promise<null | PointsOfInterestEntity> {
		const pointOfInterest = await this.pointsOfInterestModel
			.query()
			.select([
				"id",
				"name",
				"created_at",
				"updated_at",
				"description",
				this.pointsOfInterestModel.raw(
					"ST_AsGeoJSON(location)::json as location",
				),
			])
			.findById(id)
			.execute();

		if (!pointOfInterest) {
			return null;
		}

		return PointsOfInterestEntity.initialize(pointOfInterest);
	}

	public async findByName(
		name: string,
	): Promise<null | PointsOfInterestEntity> {
		const pointOfInterest = await this.pointsOfInterestModel
			.query()
			.select([
				"id",
				"name",
				"created_at",
				"updated_at",
				"description",
				this.pointsOfInterestModel.raw(
					"ST_AsGeoJSON(location)::json as location",
				),
			])
			.where("name", "ilike", name)
			.first();

		if (!pointOfInterest) {
			return null;
		}

		return PointsOfInterestEntity.initialize(pointOfInterest);
	}

	public async findNearby(
		normalizedQuery: PointsOfInterestSearchQuery,
	): Promise<PointsOfInterestEntity[]> {
		const { latitude, longitude, name, radius } = normalizedQuery;

		const pointsOfInterest = await this.pointsOfInterestModel
			.query()
			.select([
				"id",
				"name",
				"created_at",
				"updated_at",
				"description",
				this.pointsOfInterestModel.raw(
					"ST_AsGeoJSON(location)::json as location",
				),
				this.pointsOfInterestModel.raw(
					"ST_Distance(location::geography, ST_SetSRID(ST_MakePoint(?, ?), 4326)::geography) as distance",
					[longitude, latitude],
				),
			])
			.whereRaw(
				"ST_DWithin(location::geography, ST_SetSRID(ST_MakePoint(?, ?), 4326)::geography, ?)",
				[longitude, latitude, radius],
			)
			.orderBy("distance", SortingOrder.ASC)
			.modify((builder) => {
				if (name) {
					builder.whereILike("name", `%${name.trim()}%`);
				}
			})
			.execute();

		return pointsOfInterest
			.filter(Boolean)
			.map((point) => PointsOfInterestEntity.initialize(point));
	}

	public async findPaginated(
		options: PointsOfInterestPaginatedOptions,
	): Promise<EntityPagination<PointsOfInterestEntity>> {
		const { limit, page, search } = options;

		const query = this.pointsOfInterestModel
			.query()
			.select(["id", "name", "created_at"])
			.modify((builder) => {
				if (search) {
					builder.where("name", "ilike", `%${search}%`);
				}
			});

		const total = await query.resultSize();

		const items = await query
			.offset((page - PAGE_NUMBER_OFFSET) * limit)
			.limit(limit)
			.execute();

		return {
			items: items.map((point) =>
				PointsOfInterestEntity.initializeSummary(point),
			),
			total,
		};
	}

	public async patch(
		id: number,
		entity: PointsOfInterestEntity,
	): Promise<null | PointsOfInterestEntity> {
		const { description, location, name } = entity.toNewObject();

		const [updatedPointOfInterest] = await this.pointsOfInterestModel
			.query()
			.patch({
				description,
				location,
				name,
			})
			.where("id", "=", id)
			.returning([
				"id",
				"name",
				"created_at",
				"updated_at",
				"description",
				this.pointsOfInterestModel.raw(
					"ST_AsGeoJSON(location)::json as location",
				),
			])
			.execute();

		if (!updatedPointOfInterest) {
			return null;
		}

		return PointsOfInterestEntity.initialize(updatedPointOfInterest);
	}
}

export { PointsOfInterestRepository };
