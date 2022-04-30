import { dashboard } from "../types/dashboard";
import { GetState, SetState } from "zustand";
import { MyState } from "./store2";

const calculateTotalFrames = (initialTemp: number, tempStep: number, finalTemp: number, numberOfCycles: number) => {
    let diff;
    if (finalTemp !== 0) {
        diff = (finalTemp! - initialTemp!) / tempStep!
    } else {
        diff = 1
    }
    return diff * numberOfCycles!
}

const Dashboard = ((set: SetState<MyState>, get: GetState<MyState>): dashboard => ({
    framesInfo: {
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
    reset: () => set({}),
    // init: () => set(dashboard => produce(dashboard, state => {
    //     state.temperature = get().initialTemp!;
    //     state.cycles.totalCycles = get().numberOfCycles!
    //     state.frames.totalFrames = calculateTotalFrames(get().initialTemp!, get().tempStep!, get().finalTemp!, get().numberOfCycles!)
    // })),
    set: (update) => set({ dashboard: { ...get().dashboard, ...update } }),
}));

export default Dashboard