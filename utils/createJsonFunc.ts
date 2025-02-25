import { IPolygon } from "@/types/polygon.types";

// Export polygons as JSON
export const handleExportGeoJSON = (polygons: IPolygon[]) => {
  const geoJSON = {
    type: "FeatureCollection",
    features: polygons.map((p) => ({
      type: "Feature",
      properties: {
        id: p.id,
        fillColor: p.fillColor,
        borderColor: p.borderColor,
      },
      geometry: {
        type: "Polygon",
        coordinates: [p.coordinates],
      },
    })),
  };

  // Convert GeoJSON to a JSON string
  const jsonString = JSON.stringify(geoJSON, null, 2);

  // Create a Blob with the GeoJSON data
  const blob = new Blob([jsonString], { type: "application/json" });

  // Download link
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "saved_polygons.geojson";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
