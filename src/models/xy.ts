import create from "zustand";
import TSStore from "../types/ts_store";

const xy = () => {
  let {
    settings,
    spins,
    dashboard,
    context,
    setDashboard,
    incSteps,
    incFrames,
    incCycles,
    endSimulation,
    updatePayload,
    setSpins,
    canvas,
  } = create(TSStore).getState();

  let model = () => {
    let wrap = "none";
    let CouplingStrength = 1;
    let width = 600 / settings.latticeSize;

    function mod(a, b) {
      var notMod = a % b;
      if (notMod < 0) notMod += b;
      return notMod;
    }

    function rad2deg(angrad) {
      var angdeg = ((angrad / (2 * Math.PI)) * 360) % 360;
      if (angdeg < 0) angdeg += 360;
      return Math.floor(angdeg);
    }

    function proind(arr, i, j) {
      var ni = i;
      var nj = j;
      if (!(0 <= ni && ni < arr.length)) {
        ni = mod(ni, arr.length);
        nj = arr[0].length - 1 - nj;
      }
      if (!(0 <= nj && nj < arr[0].length)) {
        nj = mod(nj, arr[0].length);
        ni = arr.length - 1 - ni;
      }
      return arr[ni][nj];
    }

    function torind(arr, i, j) {
      return arr[mod(i, arr.length)][mod(j, arr[0].length)];
    }

    let newphases = new Array(settings.latticeSize);
    for (var i = 0; i < settings.latticeSize; i++) {
      newphases[i] = new Array(settings.latticeSize);
      for (var j = 0; j < settings.latticeSize; j++) {
        var f = 0;
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
            f += Math.sin(spins[i][j] - torind(spins, i - 1, j));
            f += Math.sin(spins[i][j] - torind(spins, i + 1, j));
            f += Math.sin(spins[i][j] - torind(spins, i, j - 1));
            f += Math.sin(spins[i][j] - torind(spins, i, j + 1));
            break;
          case "pro":
            f += Math.sin(spins[i][j] - proind(spins, i - 1, j));
            f += Math.sin(spins[i][j] - proind(spins, i + 1, j));
            f += Math.sin(spins[i][j] - proind(spins, i, j - 1));
            f += Math.sin(spins[i][j] - proind(spins, i, j + 1));
            break;
          default:
            console.log("prohibited value 'wrap': " + wrap);
        }

        f *= CouplingStrength;
        f += dashboard.temperature * (2 * Math.random() - 1);
        f += settings.magneticField! * Math.sin(spins[i][j]);

        newphases[i][j] = spins[i][j] - f;
        var c = rad2deg(newphases[i][j]);
        context!.fillStyle = `hsl(${c}, 100%, 50%)`;
        context!.fillRect(i * width, j * width, width, width);
      }
    }
    setSpins(newphases);
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
        window.requestAnimationFrame(xy);
      }, 60);
    }
    if (settings.freePlay) {
      setDashboard({
        temperature: settings.initialTemp!,
      });
      setTimeout(() => {
        window.requestAnimationFrame(xy);
      }, 60);
    }
  }
};

export default xy;
