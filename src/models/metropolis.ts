import type { settings } from "../types/settings";
import create from "zustand";
import TSStore from "../types/ts_store";

const metropolis = (timestamp: number) => {
  let {
    settings,
    spins,
    context,
    dashboard,
    setDashboard,
    updateGraph,
    incSteps,
    incFrames,
    incCycles,
    endSimulation,
    updatePayload,
    canvas,
    frame,
    payloads,
  } = create(TSStore).getState();

  let width = 600 / settings.latticeSize;

  const deltaUofM = (
    i: number,
    j: number,
    spins: Array<Array<number>>,
    settings: settings
  ) => {
    let left = getLeft(i, j, spins);
    let right = getRight(i, j, spins);
    let top = getTop(i, j, spins);
    let bottom = getBottom(i, j, spins);
    let spin = spins[i][j];
    return (
      2.0 * 1 * spin * (top + bottom + left + right) +
      2.0 * spin * settings.magneticField! +
      0
    ); // 0 is BfieldM (set by sidebar, check v1)
  };

  const getLeft = (i: number, j: number, spins: Array<Array<number>>) => {
    if (j == 0) {
      // TODO: Add different boundary settings
      return spins[i][settings.latticeSize - 1];
    } else {
      return spins[i][j - 1];
    }
  };

  const getRight = (i: number, j: number, spins: Array<Array<number>>) => {
    if (j == settings.latticeSize - 1) {
      // TODO: Add different boundary settings
      return spins[i][0];
    } else {
      return spins[i][j + 1];
    }
  };

  const getTop = (i: number, j: number, spins: Array<Array<number>>) => {
    if (i == 0) {
      // TODO: Add different boundary settings
      return spins[settings.latticeSize - 1][j];
    } else {
      return spins[i - 1][j];
    }
  };

  const getBottom = (i: number, j: number, spins: Array<Array<number>>) => {
    if (i == settings.latticeSize - 1) {
      return spins[0][j];
    } else {
      return spins[i + 1][j];
    }
  };

  function ComputeEforMetropolis() {
    let Ecurrent = 0.0;
    let Mcurrent = 0.0;
    let CouplingConstant;
    if (settings.magnetism! == "Ferromagnetic") {
      CouplingConstant = 1;
    } else {
      CouplingConstant = -1;
    }

    for (var i = 0; i < settings.latticeSize; i++) {
      for (var j = 0; j < settings.latticeSize; j++) {
        var right = getRight(i, j, spins);
        var bottom = getBottom(i, j, spins);
        var thisS = spins[i][j];
        Ecurrent =
          Ecurrent -
          CouplingConstant * thisS * (right + bottom) -
          thisS * settings.magneticField!;
        Mcurrent += thisS;
      }
    }
    return { Ecurrent, Mcurrent };
  }

  let model = () => {
    let i = Math.floor(Math.random() * settings.latticeSize);
    let j = Math.floor(Math.random() * settings.latticeSize);
    let curr_spins = spins[i][j];
    let _EdiffforM = deltaUofM(i, j, spins, settings);

    if (dashboard.temperature == 0) {
      if (_EdiffforM < 0.0 || (_EdiffforM == 0 && Math.random() < 0.5)) {
        spins[i][j] = curr_spins * -1;
        if (spins[i][j] == 1) context!.fillStyle = "black";
        else context!.fillStyle = "white";
        context!.fillRect(i * width, j * width, width, width);
      }
    } else if (
      _EdiffforM < 0.0 ||
      Math.random() < Math.exp(-_EdiffforM / dashboard.temperature!)
    ) {
      spins[i][j] = curr_spins * -1;
      if (spins[i][j] == 1) context!.fillStyle = "white";
      else context!.fillStyle = "black";
      context!.fillRect(i * width, j * width, width, width);
    }
  };

  console.log(payloads);
  console.log(frame);
  if (settings.freePlay || settings.simulation) {
    if (settings.simulation) {
      if (settings.initialTemp == settings.maxTemp) {
        // this code runs the model
        for (let a = 0; a < settings.stepsPerFrame!; a++) {
          // for (let a = 0; a < 1000; a++) {
          model();
        }
      } else {
        for (let a = 0; a < settings.stepsPerFrame!; a++) {
          model();
        }
      }

      if (
        dashboard.steps % settings.stepsPerFrame! == 0 &&
        dashboard.steps != 0
      ) {
        // this code updaetes the dashboard and resets values to continue the experiment
        let frame = canvas!.toDataURL();
        updatePayload({ settings: settings, data: dashboard, frames: frame });
        console.log(payloads);
        incFrames(); // This increments the temperature as well.
        if (dashboard.temperature == settings.maxTemp!) {
          if (dashboard.cycles.currentCycle == dashboard.cycles.totalCycles) {
            endSimulation();
          } else {
            incCycles(); // This also resets temperature to start the next cycle.
          }
        }
      }
      let { Ecurrent, Mcurrent } = ComputeEforMetropolis();
      const sigmaEnergy = Math.sqrt(
        (dashboard.energy * dashboard.energy) /
          (dashboard.frames.savedFrames + 1) -
          dashboard.averageEnergy * dashboard.averageEnergy
      );

      const sigmaMagnetisation = Math.sqrt(
        (dashboard.magnetization * dashboard.magnetization) /
          (dashboard.frames.savedFrames + 1) -
          dashboard.averageMagnetization * dashboard.averageMagnetization
      );
      setDashboard({
        energy: Ecurrent / 10000,
        magnetization: Mcurrent / 10000,
        totalMagnetization: dashboard.totalMagnetization + Mcurrent / 10000,
        averageEnergy: dashboard.totalEnergy / dashboard.steps,
        averageMagnetization: dashboard.totalMagnetization / dashboard.steps,
        totalEnergy: dashboard.totalEnergy + Ecurrent / 10000,
        sigmaEnergy: isNaN(sigmaEnergy) ? null : sigmaEnergy,
        sigmaMagnetisation: isNaN(sigmaMagnetisation)
          ? null
          : sigmaMagnetisation,
      });
      updateGraph({ x: dashboard.temperature, y: dashboard.magnetization });
      incSteps();
      window.requestAnimationFrame(metropolis);
    }
    if (settings.freePlay) {
      for (let a = 0; a < settings.stepsPerFrame!; a++) {
        model();
      }
      let { Ecurrent, Mcurrent } = ComputeEforMetropolis();
      setDashboard({
        magnetization: Mcurrent / 10000,
        temperature: settings.initialTemp!,
      });
      updateGraph({ x: dashboard.temperature, y: dashboard.magnetization });
      window.requestAnimationFrame(metropolis);
    }
  }
};

export default metropolis;
