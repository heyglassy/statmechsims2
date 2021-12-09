import create from "zustand";
import TSStore from "../types/ts_store";

const qpotts = () => {
  const {
    settings,
    spin,
    context,
    dashboard,
    canvas,
    updatePayload,
    incFrames,
    endSimulation,
    incCycles,
    incSteps,
    setDashboard,
  } = create(TSStore).getState();
  const N = settings.latticeSize * settings.latticeSize;
  const width = 600 / settings.latticeSize;

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
      context!.fillRect(x * width, y * width, width, width);

      const c = (360 / settings.qpotts) * spin[j];
      context!.fillStyle = `hsl(${c}, 100%, 50%)`;
    }
  };

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
