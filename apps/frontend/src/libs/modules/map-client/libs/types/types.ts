import { type PointGeometry } from "@smartscapes/shared";
import { type default as mapboxgl } from "mapbox-gl";

type AccessToken = MapOptions["accessToken"];

type Constructor = {
	token?: AccessToken;
};

type ControlPosition = mapboxgl.ControlPosition;

type GeolocateControlOptions = mapboxgl.GeolocateControlOptions & {
	autoTrigger?: boolean;
	position?: ControlPosition;
};

type IControl = mapboxgl.IControl;

type MapBoxGL = typeof mapboxgl;

type MapBoxGLWithToken = MapBoxGL & {
	accessToken: AccessToken;
};

type MapOptions = Omit<mapboxgl.MapOptions, "container">;

type Marker = mapboxgl.Marker & {
	id: string;
};

type MarkerOptions = {
	color?: string;
	coordinates: PointGeometry["coordinates"];
	scale?: number;
};

type NavigationControlOptions = mapboxgl.NavigationControlOptions & {
	position?: ControlPosition;
};

type ScaleControlOptions = mapboxgl.ScaleControlOptions & {
	position?: ControlPosition;
};

export {
	type Constructor,
	type ControlPosition,
	type GeolocateControlOptions,
	type IControl,
	type MapBoxGLWithToken,
	type MapOptions,
	type Marker,
	type MarkerOptions,
	type NavigationControlOptions,
	type ScaleControlOptions,
};
export { type PointGeometry } from "@smartscapes/shared";
