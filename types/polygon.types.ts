export interface Polygon {
  id: string;
  coordinates: number[][];
  fillColor: string;
  borderColor: string;
}

export interface RootState {
  polygons: {
    polygons: Polygon[];
  };
}
