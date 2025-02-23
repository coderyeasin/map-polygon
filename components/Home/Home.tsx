"use client";
import CustomLayout from "@/app/(customLayout)/layout";
import React from "react";
import MapComponent from "../Map/MapComponent";
import PolygonList from "../Map/PolygonList";

const MainPage = () => {
  return (
    <CustomLayout>
      <MapComponent />
      <PolygonList />
    </CustomLayout>
  );
};

export default MainPage;
