import { LeafletEvent, PolygonOptions } from "@/types/polygon.types";
import { v4 as uuidv4 } from "uuid";
import { addPolygon } from "@/store/polygonSlice";
import { AppDispatch } from "@/store/store";

// polygon create
export const handlePolygonCreated = (
  e: LeafletEvent,
  dispatch: AppDispatch
) => {
  const layer = e.layer;
  const coordinates = (layer.getLatLngs()[0] as L.LatLng[]).map(
    (latlng: L.LatLng) => [latlng.lat, latlng.lng]
  );
  const id = uuidv4();
  (layer.options as PolygonOptions).id = id;
  // Save polygon
  dispatch(
    addPolygon({
      id,
      coordinates,
      fillColor: "#FF5733",
      borderColor: "#000000",
    })
  );
};
