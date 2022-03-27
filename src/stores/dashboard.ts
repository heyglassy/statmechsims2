import { dashboard } from "../types/dashboard";
import { settings } from "../types/settings";
import produce from "immer"
import create from "zustand/vanilla";
import Settings from "./settings";

const { getState } = Settings;

const calculateTotalFrames = (state: settings) => {
    let diff;
    if (state.finalTemp !== 0) {
        diff = (state.finalTemp! - state.initialTemp!) / state.tempStep!
    } else {
        diff = 1
    }
    return diff * state.numberOfCycles!
}

const Dashboard = create<dashboard>((set) => ({
    frames: {
        savedFrames: 0,
        totalFrames: 0,
    },
    cycles: {
        currentCycle: 1,
        totalCycles: 0,
    },
    steps: 0,
    temperature: 0,
    energy: 0,
    totalEnergy: 0,
    averageEnergy: 0,
    sigmaEnergy: 0,
    magnetization: 0,
    totalMagnetization: 0,
    averageMagnetization: 0,
    sigmaMagnetisation: 0,
    resetDashboard: () => set({}, true),
    initDashboard: () => set(dashboard => produce(dashboard, state => {
        state.temperature = getState().initialTemp!;
        state.cycles.totalCycles = getState().numberOfCycles!
        state.frames.totalFrames = calculateTotalFrames(getState())
    })),
    setDashboard: (dashboard) => set(dashboard)
}));

export default Dashboard