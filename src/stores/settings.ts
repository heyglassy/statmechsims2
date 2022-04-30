import { GetState, SetState } from "zustand";
import type { settings } from "../types/settings";
import { MyState } from "../types/store2";
import { Optional } from "../types/utils";

const Settings = ((set: SetState<MyState>, get: GetState<MyState>): settings => ({
    initialTemp: 2.27,
    finalTemp: 5,
    tempStep: 0.01,
    fixedTemp: false,
    qpotts: 5,
    equilibriationDelay: 0,
    numberOfCycles: 5,
    latticeSize: 100,
    stepsPerFrame: 10000,
    couplingStrength: 0.1,
    magneticField: 0,
    localMagneticField: 0,
    magnetism: "Ferromagnetic",
    boundariesConditions: "Periodic Boundaries",
    geometicPattern: "Random",
    fixedSpin: false,
    proportionSpin: {
        positive: 0.33,
        negative: 0.33,
    },
    nanotubeSimulation: {
        width: 2,
        height: 50,
        diameter: 15,
        spin: true,
    },
    reset: () => set({}, true),
    set: (update) => set({
        settings: {
            ...get().settings,
            ...update,
        }
    }),
}));

export default Settings;