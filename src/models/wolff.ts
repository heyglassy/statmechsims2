import create from "zustand";
import TSStore from "../types/ts_store";

const wolff = () => {
  let {
    settings,
    spin,
    context,
    dashboard,
    spinBefore,
    clusteredChildren,
    setDashboard,
    incSteps,
    incFrames,
    incCycles,
    endSimulation,
    updatePayload,
    canvas,
  } = create(TSStore).getState();

  let sizeSquaredW = settings.latticeSize * settings.latticeSize;
  let width = 600 / settings.latticeSize;

  function draw() {
    context!.fillStyle = "#ffff00";
    for (var i = 0; i < settings.latticeSize; ++i) {
      for (var j = 0; j < settings.latticeSize; ++j) {
        var idx = i * settings.latticeSize + j;
        if (spin[idx] == 1 && spinBefore[idx] != 1) {
          context!.fillStyle = "#ffff00";
          context!.fillRect(j * width, i * width, width, width);
        }
        if (spin[idx] == -1 && spinBefore[idx] != -1) {
          context!.fillStyle = "#0000ff";
          context!.fillRect(j * width, i * width, width, width);
        }
      }
    }
    for (var i = 0; i < sizeSquaredW; ++i) {
      spinBefore[i] = spin[i];
    }
  }

  const model = () => {
    var prob = 1.0 - Math.exp(-2.0 / dashboard.temperature);
    var InnerLoopCountLocal = 0;

    makeCluster(prob);
    while (InnerLoopCountLocal < sizeSquaredW / width) {
      var updateCluster = clusteredChildren[randomInt(0, sizeSquaredW)];
      for (var i = 0; i < sizeSquaredW; ++i) {
        if (clusteredChildren[i] == updateCluster) {
          spin[i] = -spin[i];
          InnerLoopCountLocal++;
        }
      }
    }
  };

  function parentOf(child: any) {
    var parent = clusteredChildren[child];
    while (child != parent) {
      child = parent;
      parent = clusteredChildren[child];
    }
    return child;
  }

  function connect(i: any, j: any) {
    var ri = parentOf(i);
    var rj = parentOf(j);
    var root = ri < rj ? ri : rj;
    var child = i;
    while (child != root) {
      var parent = clusteredChildren[child];
      clusteredChildren[child] = root;
      child = parent;
    }
    var child = j;
    while (child != root) {
      var parent = clusteredChildren[child];
      clusteredChildren[child] = root;
      child = parent;
    }
  }

  function makeCluster(prob: any) {
    for (var i = 0; i < sizeSquaredW; ++i) clusteredChildren[i] = i;
    for (var i = 0; i < sizeSquaredW; ++i) {
      // horizontal bonds
      var j = (i + 1) % sizeSquaredW;
      if (spin[i] == spin[j] && Math.random() < prob) connect(i, j);
    }
    for (var i = 0; i < sizeSquaredW; ++i) {
      // vartical bonds
      var j = (i + settings.latticeSize) % sizeSquaredW;
      if (spin[i] == spin[j] && Math.random() < prob) connect(i, j);
    }
    for (var i = 0; i < sizeSquaredW; ++i) {
      clusteredChildren[i] = parentOf(i);
    }
  }

  function randomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  model();
  draw();

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
        window.requestAnimationFrame(wolff);
      }, 60);
    }
    if (settings.freePlay) {
      setDashboard({
        temperature: settings.initialTemp!,
      });
      setTimeout(() => {
        window.requestAnimationFrame(wolff);
      }, 60);
    }
  }
};

export default wolff;
