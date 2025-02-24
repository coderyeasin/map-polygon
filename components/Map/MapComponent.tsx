/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { TileLayer, MapContainer, FeatureGroup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import L from "leaflet";
import dynamic from "next/dynamic";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import {
  addPolygon,
  updatePolygon,
  setSelectedPolygon,
} from "@/store/polygonSlice";
import { useEffect, useRef } from "react";
import {
  IPolygon,
  LeafletEvent,
  PolygonOptions,
  PolygonState,
} from "@/types/polygon.types";

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

  // Handle polygon creation
  const handlePolygonCreated = (e: LeafletEvent) => {
    const layer = e.layer;

    const coordinates = (layer.getLatLngs()[0] as L.LatLng[]).map(
      (latlng: L.LatLng) => [latlng.lat, latlng.lng]
    );
    const id = uuidv4();

    // Assign the ID
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

  // Polygon edit
  const handlePolygonEdited = (e: LeafletEvent) => {
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
          if (featureGroupRef.current) {
            const layersInGroup = featureGroupRef.current.getLayers();
            layersInGroup.forEach((l: L.Layer) => {
              if (l instanceof L.Polygon) {
                if ((l.options as PolygonOptions).id === id) {
                  (l as any).editing.disable();
                }
              }
            });
          }

          // Clear polygon by selected ID
          dispatch(setSelectedPolygon(null));
        }
      }
    });
  };

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
          onCreated={handlePolygonCreated}
          onEdited={handlePolygonEdited}
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
