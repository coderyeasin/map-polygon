import { LeafletEvent, PolygonOptions } from "@/types/polygon.types";
import L from "leaflet";
import { updatePolygon, setSelectedPolygon } from "@/store/polygonSlice";
import { AppDispatch } from "@/store/store";

// Handle polygon editing
export const handlePolygonEdited = (e: LeafletEvent, dispatch: AppDispatch) => {
  const layers = e.layers;

  layers.eachLayer((layer: L.Layer) => {
    if (layer instanceof L.Polygon) {
      const id = (layer.options as PolygonOptions).id;
      const coordinates = (layer.getLatLngs()[0] as L.LatLng[]).map(
        (latlng: L.LatLng) => [latlng.lat, latlng.lng]
      );

      if (id) {
        // Update polygon
        dispatch(updatePolygon({ id, coordinates }));

        // Editing mode for the edited polygon
        if (layer.editing) {
          layer.editing.disable();
        }

        // Clear polygon by selected ID
        dispatch(setSelectedPolygon(null));
      }
    }
  });
};
