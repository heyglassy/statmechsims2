import { Optional } from "./utils";

interface framesInfo {
  savedFrames: number;
  totalFrames: number;
}

interface cycles {
  currentCycle: number;
  totalCycles: number;
}

export interface dashboard {
  framesInfo: framesInfo;
  cycles: cycles;
  steps: number;
  temperature: number;
  energy: number;
  totalEnergy: number;
  averageEnergy: number;
  sigmaEnergy: number | null;
  magnetization: number;
  totalMagnetization: number;
  averageMagnetization: number;
  sigmaMagnetization: number;
  reset: () => void;
  set: (update: Optional<dashboard>) => void;
}
