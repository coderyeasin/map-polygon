/* eslint-disable @typescript-eslint/no-unused-vars */
import L from "leaflet";

declare module "leaflet" {
  interface Polygon {
    editing?: {
      enable: () => void;
      disable: () => void;
    };
  }
}
