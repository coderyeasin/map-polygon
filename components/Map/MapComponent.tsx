/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { TileLayer, MapContainer, FeatureGroup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import L from "leaflet";
import dynamic from "next/dynamic";
import { useDispatch, useSelector } from "react-redux";

import { setSelectedPolygon } from "@/store/polygonSlice";
import { useEffect, useRef } from "react";
import { IPolygon, PolygonOptions, PolygonState } from "@/types/polygon.types";
import { handlePolygonCreated } from "@/utils/mapCreateFunc";
import { handlePolygonEdited } from "@/utils/mapEditFunc";

const EditControl = dynamic(
  () => import("react-leaflet-draw").then((mod) => mod.EditControl),
  { ssr: false }
);

export default function MapComponent() {
  const dispatch = useDispatch();
  const { polygons, selectedPolygonId } = useSelector(
    (state: { polygons: PolygonState }) => state.polygons
  );
  const featureGroupRef = useRef<L.FeatureGroup | null>(null);

  // Dynamically Manage polygon layers
  useEffect(() => {
    if (featureGroupRef.current) {
      const featureGroup = featureGroupRef.current;

      // Remove all existing layers
      featureGroup.clearLayers();

      // Add current polygons to the FeatureGroup
      polygons.forEach((p: IPolygon) => {
        // Polygon instance
        const polygon = L.polygon(p.coordinates, {
          fillColor: p.fillColor,
          color: p.borderColor,
        } as PolygonOptions);

        // Assign ID
        (polygon.options as PolygonOptions).id = p.id;

        // Add event handlers
        polygon.on("click", () => dispatch(setSelectedPolygon(p.id)));

        // Add polygon to FeatureGroup
        featureGroup.addLayer(polygon);
      });
    }
  }, [polygons, dispatch]);

  // Enable editing for selected polygon
  useEffect(() => {
    if (featureGroupRef.current && selectedPolygonId) {
      const layers = featureGroupRef.current.getLayers();
      layers.forEach((layer: L.Layer) => {
        if (layer instanceof L.Polygon) {
          if ((layer.options as PolygonOptions).id === selectedPolygonId) {
            (layer as any).editing.enable();
          } else {
            (layer as any).editing.disable();
          }
        }
      });
    }
  }, [selectedPolygonId, polygons]);

  return (
    <MapContainer
      style={{ height: "50%", width: "100%" }}
      center={[51.505, -0.09]}
      zoom={13}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <FeatureGroup ref={featureGroupRef}>
        <EditControl
          position="topright"
          onCreated={(e) => handlePolygonCreated(e, dispatch)}
          onEdited={(e) => handlePolygonEdited(e, dispatch)}
          draw={{
            rectangle: false,
            polygon: true,
            circle: false,
            circlemarker: false,
            marker: false,
            polyline: false,
          }}
        />
      </FeatureGroup>
    </MapContainer>
  );
}
