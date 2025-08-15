import mapboxgl from "mapbox-gl";

import { config } from "~/libs/modules/config/config.js";

import {
	GEOLOCATE_AUTO_TRIGGER_DELAY,
	GEOLOCATE_CONTROL_OPTIONS,
	MAP_CONTROLS_POSITION,
	MAP_OPTIONS,
	MARKER_OPTIONS,
	NAVIGATION_CONTROL_OPTIONS,
	SCALE_CONTROL_OPTIONS,
	ZOOM_LEVEL,
} from "./libs/constants/constants.js";
import { MapControlId } from "./libs/enums/enums.js";
import {
	type ControlPosition,
	type MapControl,
	type MapOptions,
	type PointGeometry,
} from "./libs/types/types.js";
import "mapbox-gl/dist/mapbox-gl.css";

class MapClient {
	private accessToken: MapOptions["accessToken"];
	private controls = new Map<string, MapControl>();
	private isClickAttached = false;
	private map: mapboxgl.Map | null = null;

	private onMapClickBound: (event: mapboxgl.MapMouseEvent) => void;
	private onMapLoadAttachBound: () => void;

	private onSelectCallback: ((coords: [number, number]) => void) | null = null;
	private readyCallbacks: Array<() => void> = [];

	private resizeObserver: null | ResizeObserver = null;
	private selectedMarker: mapboxgl.Marker | null = null;

	public constructor() {
		this.accessToken = config.ENV.MAPBOX.ACCESS_TOKEN;
		this.onMapClickBound = this.onMapClick.bind(this);
		this.onMapLoadAttachBound = this.onMapLoadAttach.bind(this);
	}

	public addGeolocateControl(): void {
		if (!this.map) {
			return;
		}

		const control = new mapboxgl.GeolocateControl(GEOLOCATE_CONTROL_OPTIONS);

		this.addControl(
			MapControlId.GEOLOCATE,
			control,
			MAP_CONTROLS_POSITION["GEOLOCATE"] as ControlPosition,
		);

		this.map.on("load", () => {
			setTimeout(() => {
				control.trigger();
			}, GEOLOCATE_AUTO_TRIGGER_DELAY);
		});
	}

	public addMarkers(
		markers: { coordinates: PointGeometry["coordinates"] }[],
	): void {
		for (const marker of markers) {
			this.addMarker(marker.coordinates);
		}
	}

	public addNavigationControl(): void {
		if (!this.map) {
			return;
		}

		const control = new mapboxgl.NavigationControl(NAVIGATION_CONTROL_OPTIONS);

		this.addControl(
			MapControlId.NAVIGATION,
			control,
			MAP_CONTROLS_POSITION["NAVIGATION"] as ControlPosition,
		);
	}

	public addScaleControl(): void {
		if (!this.map) {
			return;
		}

		const control = new mapboxgl.ScaleControl(SCALE_CONTROL_OPTIONS);

		this.addControl(
			MapControlId.SCALE,
			control,
			MAP_CONTROLS_POSITION["SCALE"] as ControlPosition,
		);
	}

	public clearSelected(): void {
		this.selectedMarker?.remove();
		this.selectedMarker = null;
	}

	public destroy(): void {
		for (const control of this.controls.values()) {
			this.map?.removeControl(control);
		}

		this.controls.clear();

		this.detachClickHandler();
		this.onSelectCallback = null;
		this.isClickAttached = false;

		this.resizeObserver?.disconnect();
		this.resizeObserver = null;

		this.map?.remove();
		this.map = null;
		this.selectedMarker = null;
		this.readyCallbacks = [];
	}

	public enableClickToSelect(
		onSelect: (coords: [number, number]) => void,
	): () => void {
		this.onSelectCallback = onSelect;

		if (this.map) {
			return this.registerClickHandler();
		}

		let innerCleanup: () => void = this.noop;
		const unsub = this.onReady(() => {
			innerCleanup = this.registerClickHandler();
		});

		return () => {
			unsub();
			innerCleanup();
			this.onSelectCallback = null;
		};
	}

	public flyTo(center: [number, number]): void {
		if (!this.map) {
			return;
		}

		this.map.stop();
		this.map.flyTo({ center, essential: true, zoom: ZOOM_LEVEL });
	}

	public init(container: HTMLElement): void {
		if (!this.accessToken) {
			return;
		}

		this.map = new mapboxgl.Map({
			accessToken: this.accessToken,
			container,
			...MAP_OPTIONS,
		});

		this.resizeObserver = new ResizeObserver(() => {
			this.map?.resize();
		});
		this.resizeObserver.observe(container);

		const callbacks = [...this.readyCallbacks];
		this.readyCallbacks = [];

		for (const callback of callbacks) {
			callback();
		}
	}

	public onReady(callback: () => void): () => void {
		if (this.map) {
			callback();

			return this.noop;
		}

		this.readyCallbacks.push(callback);

		return () => {
			this.readyCallbacks = this.readyCallbacks.filter((f) => f !== callback);
		};
	}

	public resize(): void {
		this.map?.resize();
	}

	public setCenter(center: [number, number]): void {
		this.map?.setCenter(center);
	}

	public setSelected(coordinates: [number, number]): void {
		if (!this.map) {
			return;
		}

		if (this.selectedMarker) {
			this.selectedMarker.setLngLat(coordinates);
		} else {
			this.selectedMarker = new mapboxgl.Marker(MARKER_OPTIONS)
				.setLngLat(coordinates)
				.addTo(this.map);
		}
	}

	private addControl(
		id: string,
		control: MapControl,
		position: ControlPosition,
	): void {
		if (!this.map) {
			return;
		}

		this.removeControl(id);
		this.map.addControl(control, position);
		this.controls.set(id, control);
	}

	private addMarker(coordinates: PointGeometry["coordinates"]): void {
		if (!this.map) {
			return;
		}

		new mapboxgl.Marker(MARKER_OPTIONS).setLngLat(coordinates).addTo(this.map);
	}

	private attachClickHandler(): void {
		if (!this.map || this.isClickAttached) {
			return;
		}

		this.map.on("click", this.onMapClickBound);
		this.isClickAttached = true;
	}

	private detachClickHandler(): void {
		if (!this.map || !this.isClickAttached) {
			return;
		}

		this.map.off("click", this.onMapClickBound);
		this.isClickAttached = false;
	}

	private noop = (): void => {};

	private onMapClick(event: mapboxgl.MapMouseEvent): void {
		const coords: [number, number] = [event.lngLat.lng, event.lngLat.lat];
		this.setSelected(coords);

		if (this.onSelectCallback) {
			this.onSelectCallback(coords);
		}
	}

	private onMapLoadAttach(): void {
		this.map?.off("load", this.onMapLoadAttachBound);
		this.attachClickHandler();
	}

	private registerClickHandler(): () => void {
		if (!this.map) {
			return this.noop;
		}

		if (this.map.loaded()) {
			this.attachClickHandler();

			return () => {
				this.detachClickHandler();
			};
		}

		this.map.on("load", this.onMapLoadAttachBound);

		return () => {
			this.map?.off("load", this.onMapLoadAttachBound);
			this.detachClickHandler();
		};
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
