import { ReactElement, useEffect } from "react";
import Layout from "../components/Layouts";
import Sidebar from "../components/Sidebar";
import Canvas from "../components/Canvas";
import DataSidebar from "../components/DataSidebar";
import Graphs from "../components/Graphs";
import { useState } from "react";
import type { settings } from "../types/settings";

export default function Home() {
  let defaultState: settings = {
    running: false,
    initialTemp: 0,
    minTemp: 0,
    maxTemp: 0,
    tempStep: 0.01,
    fixedTemp: false,
    equilibriationDelay: 0,
    numberOfCycles: 0,
    latticeSize: 0,
    stepsPerFrame: 0,
    moleRatio: 0,
    magneticField: 0,
    localMagneticField: 0,
    magnetism: "Ferromagnetic",
    boundariesConditions: "Ferromagnetic",
    geometicPattern: "Ferromagnetic",
    nanotubeSimulation: {
      width: 0,
      height: 0,
      diameter: 0,
      spin: false,
    },
    fixedSpin: false,
    proportionSpin: {
      positive: 0,
      negative: 0,
    },
  };
  let [settings, setSettings] = useState<settings>(defaultState);
  let [data, setData] = useState([]);
  console.log(settings);

  useEffect(() => {
    //experiment function(settings)
  }, []);

  return (
    <div className="w-screen bg-red-500 flex">
      <Sidebar settings={settings} setSettings={setSettings} />
      <Canvas />
      <div className="flex flex-col">
        <DataSidebar />
        <Graphs />
      </div>
    </div>
  );
}

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
