import dynamic from "next/dynamic";

export const MapContainer = dynamic(
  () => import("react-leaflet/MapContainer").then((mod) => mod.MapContainer),
  { ssr: false }
);
export const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
export const FeatureGroup = dynamic(
  () => import("react-leaflet").then((mod) => mod.FeatureGroup),
  { ssr: false }
);
export const EditControl = dynamic(
  () => import("react-leaflet-draw").then((mod) => mod.EditControl),
  { ssr: false }
);
