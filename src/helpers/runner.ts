import produce from "immer";
import { omit } from "lodash";
import Store from "../stores/store";

export const runner = (timestamp: number) => {
  const {
    simulation,
    settings: { stepsPerFrame, tempStep, initialTemp, finalTemp },
    graphs,
    dashboard,
    canvas,
  } = Store.getState();

  simulation.set({
    ...simulation.algo(),
    temperature: simulation.temperature + tempStep!,
    loopCount: simulation.loopCount + stepsPerFrame!,
    payloads: simulation.payloads.concat(omit(dashboard, ["set", "reset"])),
    frames: simulation.frames.concat(canvas.current!.toDataURL()),
  });

  if (simulation.calcStats) {
    const { Ecurrent, Mcurrent } = simulation.calcStats();
    simulation.set({
      totalEnergy: Ecurrent + simulation.totalEnergy,
      totalMagnetism: Mcurrent + simulation.totalMagnetism,
    });

    graphs.update({ x: simulation.temperature, y: Mcurrent / stepsPerFrame! });
    const avgEng = simulation.totalEnergy / simulation.loopCount;
    const avgMag = simulation.totalMagnetism / simulation.loopCount;

    dashboard.set({
      energy: Ecurrent / stepsPerFrame!,
      magnetization: Mcurrent / stepsPerFrame!,
      temperature: simulation.temperature,
      averageEnergy: avgEng,
      averageMagnetization: avgMag,
      sigmaEnergy:
        (Ecurrent * Ecurrent) / simulation.loopCount - avgEng * avgEng,
      sigmaMagnetization:
        (Mcurrent * Mcurrent) / simulation.loopCount - avgMag * avgMag,
      steps: simulation.loopCount,
      framesInfo: {
        ...dashboard.framesInfo,
        savedFrames: dashboard.framesInfo.savedFrames + 1,
      },
    });
  }

  if (
    (tempStep! < 0 && simulation.temperature < finalTemp!) ||
    (tempStep! > 0 && simulation.temperature > finalTemp!)
  ) {
    dashboard.set(
      produce(dashboard, (draft) => {
        draft.cycles.currentCycle++;
      })
    );
    simulation.set({
      temperature: initialTemp!,
    });
  }

  if (dashboard.cycles.currentCycle > dashboard.cycles.totalCycles) {
    simulation.set({ running: false });
  }

  simulation.running && window.requestAnimationFrame(runner);
};
