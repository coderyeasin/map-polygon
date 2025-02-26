import { LeafletEvent, PolygonOptions } from "@/types/polygon.types";
import { updatePolygon, setSelectedPolygon } from "@/store/polygonSlice";
import { AppDispatch } from "@/store/store";

// polygon editing
export const handlePolygonEdited = async (
  e: LeafletEvent,
  dispatch: AppDispatch
) => {
  const L = (await import("leaflet")).default;
  const layers = e.layers;

  layers.eachLayer((layer: L.Layer) => {
    if (layer instanceof L.Polygon) {
      const id = (layer.options as PolygonOptions).id;
      const coordinates = (layer.getLatLngs()[0] as L.LatLng[]).map(
        (latlng: L.LatLng) => [latlng.lat, latlng.lng]
      );

      if (id) {
        dispatch(updatePolygon({ id, coordinates }));
        if (layer.editing) {
          layer.editing.disable();
        }
        dispatch(setSelectedPolygon(null));
      }
    }
  });
};
