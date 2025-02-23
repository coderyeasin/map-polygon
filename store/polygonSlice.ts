import { createSlice } from "@reduxjs/toolkit";
import { Polygon } from "../types/polygon.types";

const initialState: { polygons: Polygon[]; selectedPolygonId: string | null } =
  {
    polygons: [],
    selectedPolygonId: null,
  };

const polygonSlice = createSlice({
  name: "polygons",
  initialState,
  reducers: {
    addPolygon: (state, action) => {
      state.polygons.push(action.payload);
    },
    updatePolygon: (state, action) => {
      const { id, ...updates } = action.payload;
      const index = state.polygons.findIndex((p) => p.id === id);
      if (index !== -1) {
        state.polygons[index] = { ...state.polygons[index], ...updates };
      }
    },
    deletePolygon: (state, action) => {
      state.polygons = state.polygons.filter((p) => p.id !== action.payload);
    },
    setSelectedPolygon: (state, action) => {
      state.selectedPolygonId = action.payload;
    },
  },
});

export const { addPolygon, updatePolygon, deletePolygon, setSelectedPolygon } =
  polygonSlice.actions;
export default polygonSlice.reducer;
