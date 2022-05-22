import { Optional } from "./utils";

export interface dashboard {
  framesInfo: {
    savedFrames: number;
    totalFrames: number;
  };
  cycles: {
    currentCycle: number;
    totalCycles: number;
  };
  steps: number;
  temperature: number;
  energy: number;
  totalEnergy: number;
  averageEnergy: number;
  sigmaEnergy: number | null;
  magnetization: number;
  totalMagnetization: number;
  averageMagnetization: number;
  sigmaMagnetisation: number | null;
  reset: () => void;
  set: (update: Optional<dashboard>) => void;
}
