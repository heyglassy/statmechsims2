import metropolis from "./metropolis";
import TSStore from "../types/ts_store";
import create from "zustand";
import qpotts from "./q-potts";
import KawasakiLocal from "./kawasaki-local";
import KawasakiNonLocal from "./kawasaki-non-local";
import wolff from "./wolff";
import BlumeCapel from "./blume-capel";
import xy from "./xy";
import transverse from "./transverse-field-ising";

export const runner = (pathname: string) => {
  let algo: any;
  switch (pathname) {
    case "/models/blume-capel":
      algo = BlumeCapel;
      break;
    case "/models/kawasaki-local":
      algo = KawasakiLocal;
      break;
    case "/models/kawasaki-non-local":
      algo = KawasakiNonLocal;
      break;
    case "/models/metropolis":
      algo = metropolis;
      break;
    case "/models/q-potts":
      algo = qpotts;
      break;
    case "/models/transverse-field-ising":
      algo = transverse;
      break;
    case "/models/wolff":
      algo = wolff;
      break;
    case "/models/xy":
      algo = xy;
      break;
  }

  const { settings } = create(TSStore).getState();
  if (settings.simulation && !settings.freePlay) {
    window.requestAnimationFrame(algo);
  } else if (settings.freePlay && !settings.simulation) {
    window.requestAnimationFrame(algo);
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
  } = create(TSStore).getState();

  if (dashboard.steps % settings.stepsPerFrame! === 0 && dashboard.steps > 0) {
    // this code updaetes the dashboard and resets values to continue the experiment
    let frame = canvas!.toDataURL();
    updatePayload(frame);
    dashboard.frames.savedFrames++;
    incFrames(); // This increments the temperature as well.

    if (dashboard.temperature == settings.maxTemp!) {
      if (dashboard.cycles.currentCycle == dashboard.cycles.totalCycles) {
        endSimulation();
      } else {
        incCycles(); // This also resets temperature to start the next cycle.
      }
    }
  }
};
