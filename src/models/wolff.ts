import produce from "immer";
import create from "zustand";
// import { colorStore, Store } from "../stores/store";
import { temperatureInc } from "../helpers/runner";
import Canvas from "../stores/canvas";
import Dashboard from "../stores/dashboard";
import Settings from "../stores/settings";
import Simulation from "../stores/simulation";

const wolff = () => {
  // let {
  //   settings,
  //   spin,
  //   context,
  //   dashboard,
  //   spinBefore,
  //   clusteredChildren,
  //   setDashboard,
  //   incSteps,
  // } = create(Store).getState();

  const settings = Settings.getState();
  const simulation = Simulation.getState()
  const dashboard = Dashboard.getState()

  // const { primaryColor, secondaryColor } = create(colorStore).getState();
  const { context, primaryColor, secondaryColor } = Canvas.getState();

  let sizeSquaredW = settings.latticeSize * settings.latticeSize;
  let width = 600 / settings.latticeSize;

  function draw() {
    context!.fillStyle = secondaryColor;
    for (let i = 0; i < settings.latticeSize; ++i) {
      for (let j = 0; j < settings.latticeSize; ++j) {
        const idx = i * settings.latticeSize + j;
        if (simulation.spin[idx] == 1 && simulation.spinBefore[idx] != 1) {
          context!.fillStyle = secondaryColor;
          context!.fillRect(j * width, i * width, width, width);
        }
        if (simulation.spin[idx] == -1 && simulation.spinBefore[idx] != -1) {
          context!.fillStyle = primaryColor;
          context!.fillRect(j * width, i * width, width, width);
        }
      }
    }
    // for (let i = 0; i < sizeSquaredW; ++i) {
    // spinBefore[i] = spin[i];
    simulation.set(produce(simulation, (draft) => {
      draft.spinBefore = simulation.spin
    }));
    // }
  }

  const model = () => {

    simulation.set(produce(simulation, (draft) => {


      let prob = 1.0 - Math.exp(-2.0 / dashboard.temperature);
      let InnerLoopCountLocal = 0;

      makeCluster(prob);
      while (InnerLoopCountLocal < sizeSquaredW / width) {
        let updateCluster = simulation.clusteredChildren[randomInt(0, sizeSquaredW)];
        for (let i = 0; i < sizeSquaredW; ++i) {
          if (draft.clusteredChildren[i] == updateCluster) {
            draft.spin[i] = -simulation.spin[i];
            InnerLoopCountLocal++;
          }
        }
      }

      function parentOf(child: any) {
        let parent = simulation.clusteredChildren[child];
        while (child != parent) {
          child = parent;
          parent = simulation.clusteredChildren[child];
        }
        return child;
      }

      function connect(i: any, j: any) {
        let ri = parentOf(i);
        let rj = parentOf(j);
        let root = ri < rj ? ri : rj;
        let child = i;
        while (child != root) {
          let parent = simulation.clusteredChildren[child];
          draft.clusteredChildren[child] = root;
          child = parent;
        }
        child = j;
        while (child != root) {
          let parent = simulation.clusteredChildren[child];
          draft.clusteredChildren[child] = root;
          child = parent;
        }
      }

      function makeCluster(prob: any) {
        for (let i = 0; i < sizeSquaredW; ++i) draft.clusteredChildren[i] = i;
        for (let i = 0; i < sizeSquaredW; ++i) {
          // horizontal bonds
          let j = (i + 1) % sizeSquaredW;
          if (draft.spin[i] == simulation.spin[j] && Math.random() < prob) connect(i, j);
        }
        for (let i = 0; i < sizeSquaredW; ++i) {
          // vartical bonds
          let j = (i + settings.latticeSize) % sizeSquaredW;
          if (draft.spin[i] == simulation.spin[j] && Math.random() < prob) connect(i, j);
        }
        for (let i = 0; i < sizeSquaredW; ++i) {
          draft.clusteredChildren[i] = parentOf(i);
        }
      }

      function randomInt(min: number, max: number) {
        return Math.floor(Math.random() * (max - min)) + min;
      }
    }))
  }

  model();
  draw();

  // if (settings.freePlay || settings.simulation) {
  //   if (settings.simulation) {
  //     temperatureInc();

  //     incSteps();
  //     setTimeout(() => {
  //       window.requestAnimationFrame(wolff);
  //     }, 60);
  //   }

  //   if (settings.freePlay) {
  //     setDashboard({
  //       ...dashboard,
  //       temperature: settings.initialTemp!,
  //     });
  //     setTimeout(() => {
  //       window.requestAnimationFrame(wolff);
  //     }, 60);
  //   }
  // }
};

export default wolff;
