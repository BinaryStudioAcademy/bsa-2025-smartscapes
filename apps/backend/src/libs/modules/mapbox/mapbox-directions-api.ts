import { ContentType } from "~/libs/enums/enums.js";
import { BaseHTTPApi } from "~/libs/modules/api/api.js";
import { type Config } from "~/libs/modules/config/config.js";
import { type HTTP } from "~/libs/modules/http/http.js";
import { type PointGeometry, type ValueOf } from "~/libs/types/types.js";

import {
	type MapboxAPIGeometricsType,
	MapboxAPIPath,
	type MapboxAPIProfile,
} from "./libs/enums/enums.js";
import { type GetMapboxRouteResponseDto } from "./libs/types/types.js";

type Constructor = {
	config: Config;
	http: HTTP;
};

class MapboxDirectionsApi extends BaseHTTPApi {
	private accessToken: string;

	public constructor({ config, http }: Constructor) {
		super({
			baseUrl: config.ENV.MAPBOX.MAPBOX_URL,
			http,
			path: MapboxAPIPath.DIRECTIONS,
		});
		this.accessToken = config.ENV.MAPBOX.MAPBOX_ACCESS_TOKEN;
	}

	public async getRoute(
		profile: ValueOf<typeof MapboxAPIProfile>,
		coordinates: PointGeometry["coordinates"][],
		geometricsType: ValueOf<typeof MapboxAPIGeometricsType>,
	): Promise<GetMapboxRouteResponseDto> {
		const query = {
			access_token: this.accessToken,
			alternatives: "false",
			geometries: geometricsType,
			overview: "simplified",
			steps: "false",
		};

		const formattedCoordinates = coordinates
			.map((coordinate) => coordinate.join(","))
			.join(";");

		const response = await this.load<GetMapboxRouteResponseDto>(
			this.getFullEndpoint(profile, "/", formattedCoordinates, {}),
			{
				contentType: ContentType.JSON,
				method: "GET",
				query,
			},
		);

		return await response.json();
	}
}

export { MapboxDirectionsApi };
