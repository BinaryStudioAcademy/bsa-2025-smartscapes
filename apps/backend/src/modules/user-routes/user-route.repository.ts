import { SortingOrder } from "~/libs/enums/enums.js";
import { type Repository } from "~/libs/types/types.js";

import { UserRouteStatus } from "./libs/enums/enum.js";
import { type UserRouteGetAllFilters } from "./libs/types/types.js";
import { UserRouteEntity } from "./user-route.entity.js";
import { type UserRouteModel } from "./user-route.model.js";

class UserRouteRepository implements Repository {
	private userRouteModel: typeof UserRouteModel;

	public constructor(userRouteModel: typeof UserRouteModel) {
		this.userRouteModel = userRouteModel;
	}

	public async checkHasActiveRoute(userId: number): Promise<boolean> {
		const [userRoute] = await this.userRouteModel
			.query()
			.where({ status: UserRouteStatus.ACTIVE, userId })
			.execute();

		return Boolean(userRoute);
	}

	public async create(entity: UserRouteEntity): Promise<UserRouteEntity> {
		const insertData = entity.toNewObject();

		const userRoute = await this.userRouteModel
			.query()
			.insert(insertData)
			.returning([
				"user_routes.id",
				"routeId",
				"userId",
				"status",
				"startedAt",
				"completedAt",
				this.userRouteModel.raw(
					"ST_AsGeoJSON(actual_geometry)::json as actual_geometry",
				),
				this.userRouteModel.raw(
					"ST_AsGeoJSON(planned_geometry)::json as planned_geometry",
				),
			])
			.execute();

		return UserRouteEntity.initialize(userRoute);
	}

	public async deleteSavedRoute(id: number, userId: number): Promise<boolean> {
		const isDeleted = await this.userRouteModel
			.query()
			.delete()
			.where({ id, userId })
			.execute();

		return Boolean(isDeleted);
	}

	public async findAll(
		filters: UserRouteGetAllFilters,
	): Promise<UserRouteEntity[]> {
		const userRoutes = await this.userRouteModel
			.query()
			.leftJoin("reviews", "reviews.route_id", "user_routes.route_id")
			.withGraphJoined("routes")
			.select([
				"user_routes.id",
				"user_routes.route_id",
				"user_routes.user_id",
				"user_routes.status",
				"user_routes.started_at",
				"user_routes.completed_at",
				this.userRouteModel.raw(
					"ST_AsGeoJSON(user_routes.actual_geometry)::json as actual_geometry",
				),
				this.userRouteModel.raw(
					"ST_AsGeoJSON(user_routes.planned_geometry)::json as planned_geometry",
				),
				"reviews.content as review_comment",
				"routes.name as route_name",
				"routes.distance",
			])
			.modify((builder) => {
				if (filters.userId) {
					builder.where("user_routes.user_id", filters.userId);
				}

				if (filters.status) {
					builder.where("user_routes.status", filters.status);
				}

				if (filters.routeId) {
					builder.where("user_routes.route_id", filters.routeId);
				}
			})
			.orderBy("user_routes.created_at", SortingOrder.DESC)
			.execute();

		return userRoutes.map((item) => UserRouteEntity.initialize(item));
	}

	public async findOne(
		filters: UserRouteGetAllFilters,
	): Promise<null | UserRouteEntity> {
		const userRoute = await this.userRouteModel
			.query()
			.where(filters)
			.withGraphJoined("routes")
			.select([
				"user_routes.id as id",
				"routeId",
				"userId",
				"status",
				"startedAt",
				"completedAt",
				this.userRouteModel.raw(
					"ST_AsGeoJSON(actual_geometry)::json as actual_geometry",
				),
				this.userRouteModel.raw(
					"ST_AsGeoJSON(planned_geometry)::json as planned_geometry",
				),
				"name as routeName",
				"distance",
			])
			.orderBy("user_routes.created_at", SortingOrder.DESC)
			.first();

		return userRoute ? UserRouteEntity.initialize(userRoute) : null;
	}

	public async findPopular(): Promise<UserRouteEntity[]> {
		const LIMIT = 10;

		const popularRoutes = await this.userRouteModel
			.query()
			.select([
				"routes.id as routeId",
				"routes.name as routeName",
				"routes.geometry as plannedGeometry",
			])
			.count("user_routes.id as totalCount")
			.join("routes", "routes.id", "user_routes.routeId")
			.where("user_routes.status", UserRouteStatus.COMPLETED)
			.groupBy("routes.id", "routes.name", "routes.geometry")
			.orderBy("totalCount", SortingOrder.DESC)
			.limit(LIMIT);

		return popularRoutes.map((item) => UserRouteEntity.initialize(item));
	}

	public async patch(
		id: number,
		userId: number,
		entity: UserRouteEntity,
	): Promise<null | UserRouteEntity> {
		const updatedUserData = entity.toNewObject();
		const [updatedUserRoute] = await this.userRouteModel
			.query()
			.where({
				id,
				userId,
			})
			.patch(updatedUserData)
			.returning([
				"id",
				"routeId",
				"userId",
				"status",
				"startedAt",
				"completedAt",
				this.userRouteModel.raw(
					"ST_AsGeoJSON(actual_geometry)::json as actual_geometry",
				),
				this.userRouteModel.raw(
					"ST_AsGeoJSON(planned_geometry)::json as planned_geometry",
				),
			])
			.execute();

		return updatedUserRoute
			? UserRouteEntity.initialize(updatedUserRoute)
			: null;
	}
}

export { UserRouteRepository };
