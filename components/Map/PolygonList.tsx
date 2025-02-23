"use client";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../types/polygon.types";
import { deletePolygon, setSelectedPolygon } from "../../store/polygonSlice";

const PolygonList = () => {
  const polygons = useSelector((state: RootState) => state.polygons.polygons);
  const dispatch = useDispatch();

  // Function to export polygons as GeoJSON
  const handleExportGeoJSON = () => {
    // Create a GeoJSON FeatureCollection
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
          coordinates: [p.coordinates], // Wrap coordinates in an array for GeoJSON format
        },
      })),
    };

    // Convert GeoJSON to a JSON string
    const jsonString = JSON.stringify(geoJSON, null, 2);

    // Create a Blob with the GeoJSON data
    const blob = new Blob([jsonString], { type: "application/json" });

    // Create a download link
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "saved_polygons.geojson"; // File name
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url); // Clean up the URL object
  };

  return (
    <div className="polygon-list">
      <h2>Saved Polygons</h2>
      {polygons.length === 0 ? (
        <p>No polygons saved yet.</p>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Coordinates</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {polygons.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{JSON.stringify(p.coordinates)}</td>
                  <td className="actions">
                    <button onClick={() => dispatch(setSelectedPolygon(p.id))}>
                      Edit
                    </button>
                    <button onClick={() => dispatch(deletePolygon(p.id))}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={handleExportGeoJSON}
            style={{ marginBottom: "10px" }}
          >
            Export GeoJSON
          </button>
        </>
      )}
    </div>
  );
};

export default PolygonList;
