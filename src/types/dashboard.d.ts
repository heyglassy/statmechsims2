export = Dashboard;
export as namespace Dashboard;
declare namespace Dashboard {
  type dashboard = {
    frames: {
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
    sigmaEnergy: number;
    magnetization: number;
    totalMagnetization: number;
    averageMagnetization: number;
    sigmaMagnetisation;
  };
}
