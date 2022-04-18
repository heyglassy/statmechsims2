import { GetState, SetState } from "zustand";
import { simulation } from "../types/simulation";
import { MyState, Optional } from "../types/store2";

const Simulation = ((set: SetState<MyState>, get: GetState<MyState>): simulation => ({
    currentUrl: "/model/metropolis",
    localMagnetic: [],
    spin: [],
    spins: [[], []],
    spinBefore: [],
    nearestNeighs: {},
    clusteredChildren: [],
    wall: [],
    running: false,
    freePlay: false,
    freePlayIncrememt: false,
    frames: [],
    temperature: 0,
    calcStats: () => { },
    algo: () => { },
    set: (update: Optional<simulation>) => set({ simulation: { ...get().simulation, ...update } }),
}));

export default Simulation
