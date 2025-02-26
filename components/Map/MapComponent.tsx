/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedPolygon } from "@/store/polygonSlice";
import { useEffect, useRef } from "react";
import { IPolygon, PolygonOptions, PolygonState } from "@/types/polygon.types";
import { handlePolygonCreated } from "@/utils/mapCreateFunc";
import { handlePolygonEdited } from "@/utils/mapEditFunc";
import {
  EditControl,
  FeatureGroup,
  MapContainer,
  TileLayer,
} from "./leafletFeature";

export default function MapComponent() {
  const dispatch = useDispatch();
  const { polygons, selectedPolygonId } = useSelector(
    (state: { polygons: PolygonState }) => state.polygons
  );
  const featureGroupRef = useRef<L.FeatureGroup | null>(null);

  // Manage polygon layers
  useEffect(() => {
    if (!featureGroupRef.current) return;
    const featureGroup = featureGroupRef.current;
    featureGroup.clearLayers();
    if (typeof window !== "undefined") {
      import("leaflet").then((L) => {
        polygons.forEach((p: IPolygon) => {
          const polygon = L.polygon(p.coordinates, {
            fillColor: p.fillColor,
            color: p.borderColor,
          } as PolygonOptions);
          (polygon.options as PolygonOptions).id = p.id;
          polygon.on("click", () => dispatch(setSelectedPolygon(p.id)));
          featureGroup.addLayer(polygon);
        });
      });
    }
  }, [polygons, dispatch]);

  // selected polygon editing
  useEffect(() => {
    if (!featureGroupRef.current || !selectedPolygonId) return;
    const layers = featureGroupRef.current.getLayers();
    if (typeof window !== "undefined") {
      import("leaflet").then((L) => {
        layers.forEach((layer: any) => {
          if (layer instanceof L.Polygon) {
            if ((layer.options as PolygonOptions).id === selectedPolygonId) {
              (layer as any).editing.enable();
            } else {
              (layer as any).editing.disable();
            }
          }
        });
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
