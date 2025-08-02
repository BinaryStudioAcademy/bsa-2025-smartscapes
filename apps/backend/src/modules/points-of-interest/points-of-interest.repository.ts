import { type Repository } from "~/libs/types/types.js";
import { PointsOfInterestEntity } from "~/modules/points-of-interest/points-of-interest.entity.js";
import { type PointsOfInterestModel } from "~/modules/points-of-interest/points-of-interest.model.js";

import {
	type PointsOfInterestLocation,
	type PointsOfInterestSearchQuery,
} from "./libs/types/type.js";

class PointsOfInterestRepository implements Repository {
	private pointsOfInterestModel: typeof PointsOfInterestModel;

	public constructor(pointsOfInterestModel: typeof PointsOfInterestModel) {
		this.pointsOfInterestModel = pointsOfInterestModel;
	}

	public async create(
		entity: PointsOfInterestEntity,
	): Promise<PointsOfInterestEntity> {
		const { location, name } = entity.toNewObject();

		const pointOfInterest = await this.pointsOfInterestModel
			.query()
			.insert({
				location,
				name,
			})
			.returning([
				"id",
				"name",
				"created_at",
				"updated_at",
				this.pointsOfInterestModel.raw("ST_AsGeoJSON(location) as location"),
			])
			.execute();

		return this.toEntityFromDbRecord(pointOfInterest) as PointsOfInterestEntity;
	}

	public async delete(id: number): Promise<boolean> {
		const deletedCount = await this.pointsOfInterestModel
			.query()
			.deleteById(id)
			.execute();

		return Boolean(deletedCount);
	}

	public async findAll(): Promise<PointsOfInterestEntity[]> {
		const pointsOfInterest = await this.pointsOfInterestModel
			.query()
			.select("id", "name", "created_at", "updated_at")
			.select(
				this.pointsOfInterestModel.raw("ST_AsGeoJSON(location) as location"),
			)
			.execute();

		return pointsOfInterest
			.map((point) => this.toEntityFromDbRecord(point))
			.filter(Boolean) as PointsOfInterestEntity[];
	}

	public async findById(id: number): Promise<null | PointsOfInterestEntity> {
		const pointOfInterest = await this.pointsOfInterestModel
			.query()
			.select("id", "name", "created_at", "updated_at")
			.select(
				this.pointsOfInterestModel.raw("ST_AsGeoJSON(location) as location"),
			)
			.findById(id)
			.execute();

		return this.toEntityFromDbRecord(pointOfInterest);
	}

	public async findByName(
		name: string,
	): Promise<null | PointsOfInterestEntity> {
		const point = await this.pointsOfInterestModel
			.query()
			.select("id", "name", "created_at", "updated_at")
			.select(
				this.pointsOfInterestModel.raw("ST_AsGeoJSON(location) as location"),
			)
			.where("name", "ilike", name)
			.first();

		return this.toEntityFromDbRecord(point);
	}

	public async findNearby(
		normalizedQuery: PointsOfInterestSearchQuery,
	): Promise<PointsOfInterestEntity[]> {
		const { latitude, longitude, radius } = normalizedQuery;

		const pointsOfInterest = await this.pointsOfInterestModel
			.query()
			.select("id", "name", "created_at", "updated_at")
			.select(
				this.pointsOfInterestModel.raw("ST_AsGeoJSON(location) as location"),
			)
			.select(
				this.pointsOfInterestModel.raw(
					"ST_Distance(location::geography, ST_SetSRID(ST_MakePoint(?, ?), 4326)::geography) as distance",
					[longitude, latitude],
				),
			)
			.whereRaw(
				"ST_DWithin(location::geography, ST_SetSRID(ST_MakePoint(?, ?), 4326)::geography, ?)",
				[longitude, latitude, radius],
			)
			.orderByRaw("distance ASC")
			.execute();

		return pointsOfInterest
			.map((point) => this.toEntityFromDbRecord(point))
			.filter(Boolean) as PointsOfInterestEntity[];
	}

	public async patch(
		id: number,
		entity: PointsOfInterestEntity,
	): Promise<null | PointsOfInterestEntity> {
		const { location, name } = entity.toNewObject();

		const [updatedRow] = await this.pointsOfInterestModel
			.query()
			.patch({
				location,
				name,
			})
			.where("id", "=", id)
			.returning([
				"id",
				"name",
				"created_at",
				"updated_at",
				this.pointsOfInterestModel.raw("ST_AsGeoJSON(location) as location"),
			])
			.execute();

		return this.toEntityFromDbRecord(updatedRow);
	}

	private toEntityFromDbRecord(
		point: PointsOfInterestModel | undefined,
	): null | PointsOfInterestEntity {
		if (!point) {
			return null;
		}

		const locationString =
			typeof point.location === "string"
				? point.location
				: JSON.stringify(point.location);

		const parsedLocation = JSON.parse(
			locationString,
		) as PointsOfInterestLocation;

		return PointsOfInterestEntity.initialize({
			createdAt: point.createdAt,
			id: point.id,
			location: parsedLocation,
			name: point.name,
			updatedAt: point.updatedAt,
		});
	}
}

export { PointsOfInterestRepository };
