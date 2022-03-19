import create from "zustand";
import TSStore from "../state/store";
import { color2 } from "./color";

let wrap = "none";

const mod = (a: number, b: number) => {
  let notMod = a % b;
  if (notMod < 0) notMod += b;
  return notMod;
};

const rad2deg = (angrad: number) => {
  let angdeg = ((angrad / (2 * Math.PI)) * 360) % 360;
  if (angdeg < 0) angrad += 360;
  return Math.floor(angdeg);
};

const proind = (arr: Array<Array<number>>, i: number, j: number) => {
  let ni = i;
  let nj = j;
  if (!(0 <= ni && ni < arr.length)) {
    ni = mod(ni, arr.length);
    nj = arr[0].length - 1 - nj;
  }
  if (!(0 <= nj && nj < arr[0].length)) {
    nj = mod(nj, arr[0].length);
    ni = arr.length - 1 - ni;
  }
  return arr[ni][nj];
};

const torind = (arr: Array<Array<number>>, i: number, j: number) => {
  return arr[mod(i, arr.length)][mod(j, arr[0].length)];
};

const model = () => {
  const { settings, spins, setSpins, dashboard } = create(TSStore).getState();
  let newphases = new Array(settings.latticeSize);
  for (let i = 0; i < settings.latticeSize; i++) {
    newphases[i] = new Array(settings.latticeSize);
    for (let j = 0; j < settings.latticeSize; j++) {
      let f = 0;

      switch (wrap) {
        case "none":
          f += i > 0 ? Math.sin(spins[i][j] - spins[i - 1][j]) : 0;
          f +=
            i < settings.latticeSize - 1
              ? Math.sin(spins[i][j] - spins[i + 1][j])
              : 0;
          f += j > 0 ? Math.sin(spins[i][j] - spins[i][j - 1]) : 0;
          f +=
            j < settings.latticeSize - 1
              ? Math.sin(spins[i][j] - spins[i][j + 1])
              : 0;
          break;
        case "tor":
          f += Math.sin(newphases[i][j] - torind(newphases, i - 1, j));
          f += Math.sin(newphases[i][j] - torind(newphases, i + 1, j));
          f += Math.sin(newphases[i][j] - torind(newphases, i, j - 1));
          f += Math.sin(newphases[i][j] - torind(newphases, i, j + 1));
          break;
        case "pro":
          f += Math.sin(newphases[i][j] - proind(newphases, i - 1, j));
          f += Math.sin(newphases[i][j] - proind(newphases, i + 1, j));
          f += Math.sin(newphases[i][j] - proind(newphases, i, j - 1));
          f += Math.sin(newphases[i][j] - proind(newphases, i, j + 1));
          break;
      }

      f *= settings.couplingStrength;
      f += dashboard.temperature * (2 * Math.random() - 1);
      f += settings.magneticField! * Math.sin(spins[i][j]);

      newphases[i][j] = spins[i][j] - f;
      const c = rad2deg(newphases[i][j]);
      color2(i, j, c);
    }
  }
  setSpins(newphases);
};

const xy = () => {
  const {
    settings,
    dashboard,
    updatePayload,
    incFrames,
    endSimulation,
    incCycles,
    incSteps,
    canvas,
    setDashboard,
  } = create(TSStore).getState();

  model();

  if (settings.freePlay || settings.simulation) {
    if (settings.simulation) {
      if (
        dashboard.steps % settings.stepsPerFrame! == 0 &&
        dashboard.steps != 0
      ) {
        // this code updaetes the dashboard and resets values to continue the experiment
        let frame = canvas!.toDataURL();
        updatePayload(frame);
        dashboard.frames.savedFrames++;
        incFrames(); // This increments the temperature as well.
        if (dashboard.temperature == settings.finalTemp!) {
          if (dashboard.cycles.currentCycle == dashboard.cycles.totalCycles) {
            endSimulation();
          } else {
            incCycles(); // This also resets temperature to start the next cycle.
          }
        }
      }
      incSteps();
      window.requestAnimationFrame(xy);
    }
    if (settings.freePlay) {
      setDashboard({
        ...dashboard,
        temperature: settings.initialTemp!,
      });
      window.requestAnimationFrame(xy);
    }
  }
};

export default xy;
