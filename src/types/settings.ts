import { Optional } from "./utils";

export interface settings {
  initialTemp: number | null;
  finalTemp: number | null;
  tempStep: number | null;
  fixedTemp: boolean;
  qpotts: number;
  equilibriationDelay: number | null;
  numberOfCycles: number | null;
  latticeSize: number;
  stepsPerFrame: number | null;
  couplingStrength: number;
  magneticField: number | null;
  localMagneticField: number | null;
  magnetism: string;
  boundariesConditions: string;
  geometicPattern: string;
  fixedSpin: boolean;
  proportionSpin: {
    positive: number | null;
    negative: number | null;
  };
  nanotubeSimulation: {
    width: number | null;
    diameter: number | null;
    height: number | null;
    spin: boolean;
  };
  reset: () => void;
  set: (update: Optional<settings>) => void;
}
