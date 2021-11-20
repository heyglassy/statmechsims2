export = Settings;
export as namespace Settigns;
declare namespace Settings {
  type nanotube = {
    width?: number;
    diameter?: number;
    height: number;
    spin: Boolean;
  };

  type proportion = {
    positive?: number;
    negative?: number;
  };

  type settings = {
    running: boolean;
    initialTemp?: number;
    minTemp?: number;
    maxTemp?: number;
    tempStep?: number;
    fixedTemp: boolean;
    equilibriationDelay?: number;
    numberOfCycles?: number;
    latticeSize?: number;
    stepsPerFrame?: number;
    moleRatio?: number;
    magneticField?: number;
    localMagneticField?: number;
    magnetism: string;
    boundariesConditions: string;
    geometicPattern: string;
    nanotubeSimulation: nanotube;
    fixedSpin: boolean;
    proportionSpin: proportion;
  };
}
