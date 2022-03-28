import create from "zustand";
import Store from "./store";
import Settings from "./settings";
import Color from "./canvas";
import Dashboard from "./dashboard";
import Simulation from "./simulation";
import Canvas from "./canvas";

const useStore = create(Store);
const useColor = create(Color);
const useSettings = create(Settings);
const useDashboard = create(Dashboard)
const useSimulation = create(Simulation)
const useCanvas = create(Canvas)

export { useColor, useStore, useSettings, useDashboard, useSimulation, useCanvas };