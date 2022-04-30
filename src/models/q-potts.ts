import create from "zustand";
import { color2 } from "../helpers/store";
import { temperatureInc } from "../helpers/runner";
import Settings from "../stores/settings";
import Simulation from "../stores/simulation";
import Dashboard from "../stores/dashboard";
import produce from "immer";
import Store2 from "../stores/store";

const qpotts = () => {
  // const { settings, spin, dashboard, incSteps, setSpin, setDashboard } =
  //   create(Store).getState();

  //TODO: Fix initial state

  const { magneticField, latticeSize, magnetism, qpotts } = Store2.getState().settings;
  const { spin, temperature } = Store2.getState().simulation

  const model = () => {
    // simulation.set(produce(simulation, (draft) => {

    const N = latticeSize * latticeSize;

    const get_index = (x: number, y: number) => {
      x = (x + latticeSize) % latticeSize;
      y = (y + latticeSize) % latticeSize;
      return x + y * latticeSize;
    };

    const get_coordinate = (i: number) => {
      return [i % latticeSize, Math.floor(i / latticeSize)];
    };

    const tc = () => {
      return 1.0 / Math.log(Math.sqrt(qpotts) + 1.0);
    };

    const single_flip = (i: number, w: number, wh: number) => {
      let sum, x, p;
      let prob = new Float64Array(qpotts);
      const [a, b] = get_coordinate(i);

      prob.fill(1.0);
      prob[spin[get_index(a + 1, b)]] *= w;
      prob[spin[get_index(a, b + 1)]] *= w;
      prob[spin[get_index(a - 1, b)]] *= w;
      prob[spin[get_index(a, b - 1)]] *= w;
      prob[0] *= wh;

      sum = prob.reduce((a, b) => {
        return a + b;
      }, 0.0);
      x = Math.random() * sum;
      p = 0.0;

      for (let g = 0; g < qpotts; g++) {
        p += prob[g];
        if (x < p) {
          spin[i] = g;
          break;
        }
      }
    };

    const beta = 1.0 / (temperature * tc());
    const w = Math.exp(beta);
    const wh = Math.exp(beta * magneticField!);

    for (let j = 0; j < N; j++) {
      single_flip(j, w, wh);

      let [x, y] = get_coordinate(j);
      const c = (360 / qpotts) * spin[j];
      color2(x, y, c);
    }

    // }))
  }

  model();

  // if (settings.freePlay || settings.simulation) {
  //   if (settings.simulation) {
  //     temperatureInc();

  //     incSteps();
  //     window.requestAnimationFrame(qpotts);
  //   }

  //   if (settings.freePlay) {
  //     setDashboard({
  //       ...dashboard,
  //       temperature: settings.initialTemp!,
  //     });
  //     window.requestAnimationFrame(qpotts);
  //   }
  // }
};

export default qpotts;
