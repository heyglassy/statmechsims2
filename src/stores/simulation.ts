import create from "zustand/vanilla"
import { simulation } from "../types/simulation"
import Settings from "./settings";

const settings = Settings.getState()

const Simulation = create<simulation>((set) => ({
    localMagnetic: [],
    spin: [],
    spinBefore: [],
    nearestNeighs: {},
    clusteredChildren: [],
    wall: [],
    running: false,
    freePlay: false,
    freePlayIncrememt: false,
    frames: [],
    spins: [],
    set: (simulation) => set(simulation),
}));

export default Simulation
