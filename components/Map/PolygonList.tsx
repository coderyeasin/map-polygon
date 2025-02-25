"use client";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../types/polygon.types";
import { deletePolygon, setSelectedPolygon } from "../../store/polygonSlice";
import { handleExportGeoJSON } from "@/utils/createJsonFunc";

const PolygonList = () => {
  const polygons = useSelector((state: RootState) => state.polygons.polygons);
  const dispatch = useDispatch();

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
          <button onClick={() => handleExportGeoJSON(polygons)}>
            Export GeoJSON
          </button>
        </>
      )}
    </div>
  );
};

export default PolygonList;
