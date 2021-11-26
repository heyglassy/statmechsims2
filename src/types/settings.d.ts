import { dashboard } from "./dashboard";

export = Settings;
export as namespace Settigns;
declare namespace Settings {
  type settings = {
    freePlay: boolean;
    simulation: boolean;
    initialTemp?: number;
    minTemp?: number;
    maxTemp?: number;
    tempStep?: number;
    fixedTemp: boolean;
    equilibriationDelay?: number;
    numberOfCycles?: number;
    latticeSize: number;
    stepsPerFrame?: number;
    moleRatio: {
      up: number;
      down: number;
    };
    magneticField?: number;
    localMagneticField?: number;
    magnetism: string;
    boundariesConditions: string;
    geometicPattern: string;
    fixedSpin: boolean;
    proportionSpin: {
      positive?: number;
      negative?: number;
    };
    nanotubeSimulation: {
      width?: number;
      diameter?: number;
      height: number;
      spin: Boolean;
    };
  };
}
