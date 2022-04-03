import create from "zustand/vanilla";
import type { settings } from "../types/settings";

const Settings = create<settings>((set) => ({
    freePlay: false,
    freePlayIncrement: false,
    simulation: false,
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
    boundariesConditions: "Ferromagnetic",
    geometicPattern: "Ferromagnetic",
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
    set: (settings) => set(settings),
}));

export default Settings;