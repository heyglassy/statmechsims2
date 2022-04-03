import metropolis from "../models/metropolis";
import { Store } from "../stores/store";
import create from "zustand";
import qpotts from "../models/q-potts";
import KawasakiLocal from "../models/kawasaki-local";
import KawasakiNonLocal from "../models/kawasaki-non-local";
import wolff from "../models/wolff";
import BlumeCapel from "../models/blume-capel";
import xy from "../models/xy";
import transverse from "../models/transverse-field-ising";

// export const alogPicker = (pathname: string) => {
//   let algo;
//   switch (pathname) {
//     case "/models/blume-capel":
//       algo = BlumeCapel;
//       break;
//     case "/models/kawasaki-local":
//       algo = KawasakiLocal;
//       break;
//     case "/models/kawasaki-non-local":
//       algo = KawasakiNonLocal;
//       break;
//     case "/models/metropolis":
//       algo = metropolis;
//       break;
//     case "/models/q-potts":
//       algo = qpotts;
//       break;
//     case "/models/transverse-field-ising":
//       algo = transverse;
//       break;
//     case "/models/wolff":
//       algo = wolff;
//       break;
//     case "/models/xy":
//       algo = xy;
//       break;
//   }
//   return algo;
// };

export const runner = (pathname: string) => {
  const algo = alogPicker(pathname);
  const { settings } = create(Store).getState();
  if (settings.simulation && !settings.freePlay) { // this stuff should be handled in the switches themselves not in the runner.
    algo!(Date.now());
  } else if (settings.freePlay && !settings.simulation) {
    algo!(Date.now());
  }
};

export const temperatureInc = () => {
  const {
    settings,
    canvas,
    dashboard,
    incFrames,
    updatePayload,
    incCycles,
    endSimulation,
  } = create(Store).getState();

  if (settings.freePlayIncrement && settings.freePlay) {
    if (
      dashboard.steps % settings.stepsPerFrame! === 0 &&
      dashboard.steps > 0
    ) {
      incFrames(); // This increments the temperature as well.
    }
  } else {
    if (
      dashboard.steps % settings.stepsPerFrame! === 0 &&
      dashboard.steps > 0
    ) {
      // this code updaetes the dashboard and resets values to continue the experiment
      let frame = canvas!.toDataURL();
      updatePayload(frame);
      dashboard.frames.savedFrames++;
      incFrames(); // This increments the temperature as well.

      if (
        settings.tempStep! > 0
          ? dashboard.temperature > settings.finalTemp!
          : dashboard.temperature < settings.finalTemp!
      ) {
        if (dashboard.cycles.currentCycle == dashboard.cycles.totalCycles) {
          endSimulation();
        } else {
          incCycles(); // This also resets temperature to start the next cycle.
        }
      }
    }
  }
};
