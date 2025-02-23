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

const EditControl = dynamic(
  () => import("react-leaflet-draw").then((mod) => mod.EditControl),
  { ssr: false }
);

export default function MapComponent() {
  const dispatch = useDispatch();
  const { polygons, selectedPolygonId } = useSelector(
    (state: any) => state.polygons
  );
  const featureGroupRef = useRef<any>(null);

  // Handle polygon creation
  const handlePolygonCreated = (e: any) => {
    const layer = e.layer;
    const coordinates = layer
      .getLatLngs()[0]
      .map((latlng: any) => [latlng.lat, latlng.lng]);
    const id = uuidv4();

    // Assign the ID
    layer.options.id = id;

    // save polygon
    dispatch(
      addPolygon({
        id,
        coordinates,
        fillColor: "#FF5733",
        borderColor: "#000000",
      })
    );
  };

  // polygon edit
  const handlePolygonEdited = (e: any) => {
    const layers = e.layers;
    layers.eachLayer((layer: any) => {
      const id = layer.options.id;
      const coordinates = layer
        .getLatLngs()[0]
        .map((latlng: any) => [latlng.lat, latlng.lng]);

      if (id) {
        // update polygon
        dispatch(updatePolygon({ id, coordinates }));

        // editing mode for the edited polygon
        if (featureGroupRef.current) {
          const layersInGroup = featureGroupRef.current.getLayers();
          layersInGroup.forEach((l: any) => {
            if (l.options.id === id) {
              l.editing.disable(); // Disable editing for the edited polygon
            }
          });
        }

        // Clear polygon by selected  ID
        dispatch(setSelectedPolygon(null));
      }
    });
  };

  // Manage polygon layers dynamically
  useEffect(() => {
    if (featureGroupRef.current) {
      const featureGroup = featureGroupRef.current;

      // Remove all existing layers
      featureGroup.clearLayers();

      // Add current polygons to the FeatureGroup
      polygons.forEach((p: any) => {
        // polygon instance
        const polygon = L.polygon(p.coordinates, {
          fillColor: p.fillColor,
          color: p.borderColor,
        });

        // Assign ID
        polygon.options.id = p.id;

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
      layers.forEach((layer: any) => {
        if (layer.options.id === selectedPolygonId) {
          layer.editing.enable();
        } else {
          layer.editing.disable();
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
