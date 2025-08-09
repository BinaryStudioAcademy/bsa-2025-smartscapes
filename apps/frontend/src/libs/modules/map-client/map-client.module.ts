import mapboxgl from "mapbox-gl";

import { config } from "~/libs/modules/config/config.js";

import {
	CONTROL_IDS,
	DEFAULT_GEOLOCATE_CONTROL_OPTIONS,
	DEFAULT_MAP_OPTIONS,
	DEFAULT_MARKER_OPTIONS,
	DEFAULT_NAVIGATION_CONTROL_OPTIONS,
	DEFAULT_SCALE_CONTROL_OPTIONS,
	GEOLOCATE_TRIGGER_DELAY,
} from "./libs/constants/constants.js";
import {
	type Constructor,
	type ControlPosition,
	type GeolocateControlOptions,
	type IControl,
	type MapBoxGLWithToken,
	type MapOptions,
	type Marker,
	type MarkerOptions,
	type NavigationControlOptions,
	type PointGeometry,
	type ScaleControlOptions,
} from "./libs/types/types.js";

import "mapbox-gl/dist/mapbox-gl.css";

class MapClient {
	private controls = new Map<string, IControl>();
	private defaultGeolocateControlOptions: GeolocateControlOptions & {
		autoTrigger?: boolean;
		position?: ControlPosition;
	};
	private defaultMapOptions: Omit<MapOptions, "container">;
	private defaultMarkerOptions: MarkerOptions;
	private defaultNavigationControlOptions: NavigationControlOptions & {
		position?: ControlPosition;
	};
	private defaultScaleControlOptions: ScaleControlOptions & {
		position?: ControlPosition;
	};
	private map: mapboxgl.Map | null = null;
	private markerClickHandler?: (
		id: string,
		coordinates: PointGeometry["coordinates"],
	) => void;
	private markers = new Map<string, Marker>();
	private resizeObserver: null | ResizeObserver = null;
	private shouldCenterOnUser: boolean = false;

	public constructor({ token }: Constructor = {}) {
		(mapboxgl as MapBoxGLWithToken).accessToken =
			token || config.ENV.MAPBOX.ACCESS_TOKEN;

		this.defaultMapOptions = DEFAULT_MAP_OPTIONS;
		this.defaultMarkerOptions = DEFAULT_MARKER_OPTIONS;
		this.defaultNavigationControlOptions = DEFAULT_NAVIGATION_CONTROL_OPTIONS;
		this.defaultScaleControlOptions = DEFAULT_SCALE_CONTROL_OPTIONS;
		this.defaultGeolocateControlOptions = DEFAULT_GEOLOCATE_CONTROL_OPTIONS;
	}

	public addAllMapControls(): void {
		this.addNavigationControl();
		this.addScaleControl();
		this.addGeolocateControl();
	}

	public addGeolocateControl(
		position?: ControlPosition,
		options?: GeolocateControlOptions,
	): void {
		if (!this.map) {
			return;
		}

		const mergedOptions = {
			...this.defaultGeolocateControlOptions,
			autoTrigger: this.shouldCenterOnUser,
			...options,
		};

		const {
			autoTrigger,
			position: finalPosition,
			...controlOptions
		} = mergedOptions;

		const control = new mapboxgl.GeolocateControl(controlOptions);

		this.addControl(
			CONTROL_IDS.GEOLOCATE,
			control,
			(position || finalPosition) ?? "bottom-right",
		);

		if (autoTrigger) {
			this.map.on("load", () => {
				setTimeout(() => {
					if (typeof control.trigger === "function") {
						control.trigger();
					}
				}, GEOLOCATE_TRIGGER_DELAY);
			});
		}
	}

	public addMarker(id: string, options: MarkerOptions): void {
		if (!this.map) {
			return;
		}

		this.removeMarker(id);

		const { coordinates, ...markerOptions } = options;

		const marker = new mapboxgl.Marker({
			...this.defaultMarkerOptions,
			...markerOptions,
		})
			.setLngLat(coordinates)
			.addTo(this.map);

		(marker as Marker).id = id;

		if (this.markerClickHandler) {
			const element = marker.getElement();
			element.style.cursor = "pointer";

			element.addEventListener("click", (): void => {
				const lngLat = marker.getLngLat();
				this.markerClickHandler?.(id, [lngLat.lng, lngLat.lat]);
			});
		}

		this.markers.set(id, marker as Marker);
	}

	public addMarkers(markers: Array<MarkerOptions & { id: string }>): void {
		for (const { id, ...options } of markers) {
			this.addMarker(id, options);
		}
	}

	public addNavigationControl(
		position?: ControlPosition,
		options?: NavigationControlOptions,
	): void {
		if (!this.map) {
			return;
		}

		const mergedOptions = {
			...this.defaultNavigationControlOptions,
			...options,
		};

		const { position: finalPosition, ...controlOptions } = mergedOptions;

		const control = new mapboxgl.NavigationControl(controlOptions);

		this.addControl(
			CONTROL_IDS.NAVIGATION,
			control,
			(position || finalPosition) ?? "top-right",
		);
	}

	public addScaleControl(
		position?: ControlPosition,
		options?: ScaleControlOptions,
	): void {
		if (!this.map) {
			return;
		}

		const mergedOptions = {
			...this.defaultScaleControlOptions,
			...options,
		};

		const { position: finalPosition, ...controlOptions } = mergedOptions;

		const control = new mapboxgl.ScaleControl(controlOptions);

		this.addControl(
			CONTROL_IDS.SCALE,
			control,
			(position || finalPosition) ?? "bottom-left",
		);
	}

	public clearAllMarkers(): void {
		for (const marker of this.markers.values()) {
			marker.remove();
		}

		this.markers.clear();
	}

	public destroy(): void {
		for (const marker of this.markers.values()) {
			marker.remove();
		}

		this.markers.clear();

		for (const control of this.controls.values()) {
			if (this.map) {
				this.map.removeControl(control);
			}
		}

		this.controls.clear();

		if (this.resizeObserver) {
			this.resizeObserver.disconnect();
			this.resizeObserver = null;
		}

		this.map?.remove();
		this.map = null;
	}

	public flyTo(center: [number, number], zoom?: number): void {
		if (this.map) {
			this.map.flyTo({
				center,
				essential: true,
				zoom: zoom ?? this.map.getZoom(),
			});
		}
	}

	public getMap(): mapboxgl.Map | null {
		return this.map;
	}

	public init(container: HTMLElement, options: MapOptions = {}): void {
		const mapOptions = {
			container,
			...this.defaultMapOptions,
			...options,
		};

		this.map = new mapboxgl.Map(mapOptions);

		this.resizeObserver = new ResizeObserver(() => {
			if (this.map) {
				this.map.resize();
			}
		});

		this.resizeObserver.observe(container);

		this.shouldCenterOnUser = !options.center;
	}

	public removeMarker(id: string): void {
		const marker = this.markers.get(id);

		if (marker) {
			marker.remove();
			this.markers.delete(id);
		}
	}

	public resize(): void {
		if (this.map) {
			this.map.resize();
		}
	}

	public setCenter(center: [number, number]): void {
		if (this.map) {
			this.map.setCenter(center);
		}
	}

	public setMarkerClickHandler(
		handler: (id: string, coordinates: PointGeometry["coordinates"]) => void,
	): void {
		this.markerClickHandler = handler;

		for (const [id, marker] of this.markers) {
			const element = marker.getElement();
			element.style.cursor = "pointer";

			element.addEventListener("click", (): void => {
				const lngLat = marker.getLngLat();
				handler(id, [lngLat.lng, lngLat.lat]);
			});
		}
	}

	private addControl(
		id: string,
		control: mapboxgl.IControl,
		position: ControlPosition,
	): void {
		if (!this.map) {
			return;
		}

		this.removeControl(id);

		this.map.addControl(control, position);
		this.controls.set(id, control);
	}

	private removeControl(id: string): void {
		const control = this.controls.get(id);

		if (control && this.map) {
			this.map.removeControl(control);
			this.controls.delete(id);
		}
	}
}

export { MapClient };
