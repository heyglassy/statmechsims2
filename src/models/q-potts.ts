import type { settings } from "../types/settings";
import create from "zustand";
import TSStore from "../types/ts_store";

const qpotts = (timestamp: number) => {
  let {
    settings,
    context,
    dashboard,
    setDashboard,
    incSteps,
    incFrames,
    incCycles,
    endSimulation,
    updatePayload,
    canvas,
  } = create(TSStore).getState();

  let width = 600 / settings.latticeSize;
  let Size = settings.latticeSize;
  const N = Size * Size;
  const q_min = 2;
  const q_max = 10;
  let _length = 4;
  let pottsSpin = new Int8Array(N);

  let NN0: any, NN1: any, NN2: any, NN3: any;
  NN0 = new Int32Array(N);
  NN1 = new Int32Array(N);
  NN2 = new Int32Array(N);
  NN3 = new Int32Array(N);

  pottsSpin.forEach((val, idx) => {
    pottsSpin[idx] =
      Math.floor(Math.random() * settings.qpotts) % settings.qpotts;

    let [x, y] = get_coordinate(idx);
    NN0[idx] = get_index(x + 1, y);
    NN1[idx] = get_index(x, y + 1);
    NN2[idx] = get_index(x - 1, y);
    NN3[idx] = get_index(x, y - 1);
  });

  function single_flip(i: any, w: any, wh: any) {
    let sum, x, p;
    let prob = new Float64Array(settings.qpotts);

    prob.fill(1.0);
    prob[pottsSpin[NN0[i]]] *= w;
    prob[pottsSpin[NN1[i]]] *= w;
    prob[pottsSpin[NN2[i]]] *= w;
    prob[pottsSpin[NN3[i]]] *= w;
    prob[0] *= wh;

    sum = prob.reduce((a, b) => {
      return a + b;
    }, 0.0);
    x = Math.random() * sum;
    p = 0.0;

    for (let g = 0; g < settings.qpotts; g++) {
      p += prob[g];
      if (x < p) {
        pottsSpin[i] = g;
        break;
      }
    }
  }

  function tc() {
    return 1.0 / Math.log(Math.sqrt(settings.qpotts) + 1.0);
  }

  function get_index(x: any, y: any) {
    x = (x + Size) % Size;
    y = (y + Size) % Size;
    return x + y * Size;
  }

  function get_coordinate(i: any) {
    return [i % Size, Math.floor(i / Size)];
  }

  function potts() {
    const beta = 1.0 / (dashboard.temperature * tc());
    const w = Math.exp(beta);
    const wh = Math.exp(beta * settings.magneticField!);

    for (let j = 0; j < N; j++) {
      single_flip(j, w, wh);

      let [x, y] = get_coordinate(j);
      context!.fillRect(x * width, y * width, width, width);

      let c = (360 / settings.qpotts) * pottsSpin[j];
      context!.fillStyle = `hsl(${c}, 100%, 50%)`;
    }
  }
  potts();
  if (settings.freePlay || settings.simulation) {
    if (settings.simulation) {
      if (
        dashboard.steps % settings.stepsPerFrame! == 0 &&
        dashboard.steps != 0
      ) {
        // this code updaetes the dashboard and resets values to continue the experiment
        let frame = canvas!.toDataURL();
        updatePayload({ settings: settings, data: dashboard, frames: frame });
        incFrames(); // This increments the temperature as well.
        if (dashboard.temperature == settings.maxTemp!) {
          if (dashboard.cycles.currentCycle == dashboard.cycles.totalCycles) {
            endSimulation();
          } else {
            incCycles(); // This also resets temperature to start the next cycle.
          }
        }
      }
      incSteps();
      setTimeout(() => {
        window.requestAnimationFrame(qpotts);
      }, 60);
    }
    if (settings.freePlay) {
      setDashboard({
        temperature: settings.initialTemp!,
      });
      setTimeout(() => {
        window.requestAnimationFrame(qpotts);
      }, 60);
    }
  }
};

export default qpotts;
