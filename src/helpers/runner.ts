import produce from "immer";
import Store2 from "../stores/store2";

export const runner = (timestamp: number) => {
  const { simulation, settings: { stepsPerFrame, tempStep, initialTemp, finalTemp }, graphs, dashboard } = Store2.getState();

  simulation.set({ ...simulation.algo(), temperature: simulation.temperature + tempStep!, loopCount: simulation.loopCount + stepsPerFrame! })

  if (simulation.calcStats) {
    const { Ecurrent, Mcurrent } = simulation.calcStats()
    simulation.set({ totalEnergy: Ecurrent + simulation.totalEnergy, totalMagnetism: Mcurrent + simulation.totalMagnetism })

    graphs.update({ x: simulation.temperature, y: Mcurrent / stepsPerFrame! });
    const avgEng = simulation.totalEnergy / simulation.loopCount
    const avgMag = simulation.totalMagnetism / simulation.loopCount

    dashboard.set({
      energy: Ecurrent / stepsPerFrame!,
      magnetization: Mcurrent / stepsPerFrame!,
      temperature: simulation.temperature,
      averageEnergy: avgEng,
      averageMagnetization: avgMag,
      sigmaEnergy: ((Ecurrent * Ecurrent) / simulation.loopCount) - avgEng * avgEng,
      sigmaMagnetisation: ((Mcurrent * Mcurrent) / simulation.loopCount) - avgMag * avgMag,
      steps: simulation.loopCount,
      framesInfo: { ...dashboard.framesInfo, savedFrames: dashboard.framesInfo.savedFrames + 1 }
    });
  }

  if ((tempStep! < 0 && simulation.temperature < finalTemp!) || tempStep! > 0 && simulation.temperature > finalTemp!) {
    dashboard.set(produce(dashboard, (draft) => {
      draft.cycles.currentCycle++
    }))
    simulation.set({ temperature: initialTemp! })
  }

  if (dashboard.cycles.currentCycle > dashboard.cycles.totalCycles) {
    simulation.set({ running: false })
  }

  simulation.running && window.requestAnimationFrame(runner)
}

// export const runner = (pathname: string) => {
//   const algo = alogPicker(pathname);
//   const { settings } = create(Store).getState();
//   if (settings.simulation && !settings.freePlay) { // this stuff should be handled in the switches themselves not in the runner.
//     algo!(Date.now());
//   } else if (settings.freePlay && !settings.simulation) {
//     algo!(Date.now());
//   }
// };

// incSteps: () => {
//   set((store: store) => ({
//     dashboard: {
//       ...store.dashboard,
//       steps: store.dashboard.steps + 1,
//     },
//   }));
// },

// export const temperatureInc = () => {
//   const {
//     settings,
//     canvas,
//     dashboard,
//     incFrames,
//     updatePayload,
//     incCycles,
//     endSimulation,
//   } = create(Store).getState();

//   if (settings.freePlayIncrement && settings.freePlay) {
//     if (
//       dashboard.steps % settings.stepsPerFrame! === 0 &&
//       dashboard.steps > 0
//     ) {
//       incFrames(); // This increments the temperature as well.
//     }
//   } else {
//     if (
//       dashboard.steps % settings.stepsPerFrame! === 0 &&
//       dashboard.steps > 0
//     ) {
//       // this code updaetes the dashboard and resets values to continue the experiment
//       let frame = canvas!.toDataURL();
//       updatePayload(frame);
//       dashboard.frames.savedFrames++;
//       incFrames(); // This increments the temperature as well.

//       if (
//         settings.tempStep! > 0
//           ? dashboard.temperature > settings.finalTemp!
//           : dashboard.temperature < settings.finalTemp!
//       ) {
//         if (dashboard.cycles.currentCycle == dashboard.cycles.totalCycles) {
//           endSimulation();
//         } else {
//           incCycles(); // This also resets temperature to start the next cycle.
//         }
//       }
//     }
//   }
// };
