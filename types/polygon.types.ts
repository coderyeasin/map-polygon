export interface IPolygon {
  id: string;
  coordinates: [number, number][];
  fillColor: string;
  borderColor: string;
}

export interface RootState {
  polygons: {
    polygons: IPolygon[];
  };
}

export interface PolygonState {
  polygons: IPolygon[];
  selectedPolygonId: string | null;
}

export interface LeafletEvent {
  layer: L.Polygon;
  layers: L.LayerGroup;
}

export interface PolygonOptions extends L.PolylineOptions {
  id?: string;
}
