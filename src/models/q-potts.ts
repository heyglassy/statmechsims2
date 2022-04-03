import create from "zustand";
import { Store } from "../stores/store";
import { color2 } from "../helpers/color";
import { temperatureInc } from "../helpers/runner";
import Settings from "../stores/settings";
import Simulation from "../stores/simulation";
import Dashboard from "../stores/dashboard";
import produce from "immer";

const qpotts = () => {
  // const { settings, spin, dashboard, incSteps, setSpin, setDashboard } =
  //   create(Store).getState();

  //TODO: Fix initial state

  const settings = Settings.getState();
  const dashboard = Dashboard.getState()
  const simulation = Simulation.getState()

  const model = () => {
    simulation.set(produce(simulation, (draft) => {

      const N = settings.latticeSize * settings.latticeSize;

      const get_index = (x: number, y: number) => {
        x = (x + settings.latticeSize) % settings.latticeSize;
        y = (y + settings.latticeSize) % settings.latticeSize;
        return x + y * settings.latticeSize;
      };

      const get_coordinate = (i: number) => {
        return [i % settings.latticeSize, Math.floor(i / settings.latticeSize)];
      };

      const tc = () => {
        return 1.0 / Math.log(Math.sqrt(settings.qpotts) + 1.0);
      };

      const single_flip = (i: number, w: number, wh: number) => {
        let sum, x, p;
        let prob = new Float64Array(settings.qpotts);
        const [a, b] = get_coordinate(i);

        prob.fill(1.0);
        prob[draft.spin[get_index(a + 1, b)]] *= w;
        prob[draft.spin[get_index(a, b + 1)]] *= w;
        prob[draft.spin[get_index(a - 1, b)]] *= w;
        prob[draft.spin[get_index(a, b - 1)]] *= w;
        prob[0] *= wh;

        sum = prob.reduce((a, b) => {
          return a + b;
        }, 0.0);
        x = Math.random() * sum;
        p = 0.0;

        for (let g = 0; g < settings.qpotts; g++) {
          p += prob[g];
          if (x < p) {
            draft.spin[i] = g;
            break;
          }
        }
      };

      const beta = 1.0 / (dashboard.temperature * tc());
      const w = Math.exp(beta);
      const wh = Math.exp(beta * settings.magneticField!);

      for (let j = 0; j < N; j++) {
        single_flip(j, w, wh);

        let [x, y] = get_coordinate(j);
        const c = (360 / settings.qpotts) * simulation.spin[j];
        color2(x, y, c);
      }

    }))
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
