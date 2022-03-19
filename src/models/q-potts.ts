import create from "zustand";
import Store from "../store/store";
import { color2 } from "../helpers/color";
import { temperatureInc } from "../helpers/runner";

const qpotts = () => {
  const { settings, spin, dashboard, incSteps, setSpin, setDashboard } =
    create(Store).getState();
  const N = settings.latticeSize * settings.latticeSize;

  const get_index = (x: number, y: number) => {
    x = (x + settings.latticeSize) % settings.latticeSize;
    y = (y + settings.latticeSize) % settings.latticeSize;
    return x + y * settings.latticeSize;
  };

  const get_coordinate = (i: number) => {
    return [i % settings.latticeSize, Math.floor(i / settings.latticeSize)];
  };

  const single_flip = (i: number, w: number, wh: number) => {
    let sum, x, p;
    let prob = new Float64Array(settings.qpotts);
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

    for (let g = 0; g < settings.qpotts; g++) {
      p += prob[g];
      if (x < p) {
        spin[i] = g;
        break;
      }
    }
  };

  const tc = () => {
    return 1.0 / Math.log(Math.sqrt(settings.qpotts) + 1.0);
  };

  const model = () => {
    const beta = 1.0 / (dashboard.temperature * tc());
    const w = Math.exp(beta);
    const wh = Math.exp(beta * settings.magneticField!);

    for (let j = 0; j < N; j++) {
      single_flip(j, w, wh);

      let [x, y] = get_coordinate(j);
      const c = (360 / settings.qpotts) * spin[j];
      color2(x, y, c);
    }
  };

  setSpin(spin);
  model();

  if (settings.freePlay || settings.simulation) {
    if (settings.simulation) {
      temperatureInc();

      incSteps();
      window.requestAnimationFrame(qpotts);
    }

    if (settings.freePlay) {
      setDashboard({
        ...dashboard,
        temperature: settings.initialTemp!,
      });
      window.requestAnimationFrame(qpotts);
    }
  }
};

export default qpotts;
