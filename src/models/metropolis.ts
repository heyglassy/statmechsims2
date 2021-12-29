import type { settings } from "../types/settings";
import create from "zustand";
import TSStore from "../types/ts_store";
import { color } from "./color";
import { getBottom, getLeft, getRight, getTop } from "./dipoles";
import { temperatureInc } from "./runner";

const metropolis = (timestamp: number) => {
  let {
    settings,
    spins,
    dashboard,
    setDashboard,
    updateGraph,
    incSteps,
    incFrames,
    incCycles,
    endSimulation,
    updatePayload,
    canvas,
  } = create(TSStore).getState();

  let CouplingConstant: number;
  if (settings.magnetism! == "Ferromagnetic") {
    CouplingConstant = 1;
  } else {
    CouplingConstant = -1;
  }

  const deltaUofM = (
    i: number,
    j: number,
    spins: Array<Array<number>>,
    settings: settings
  ) => {
    const left = getLeft(i, j);
    const right = getRight(i, j);
    const top = getTop(i, j);
    const bottom = getBottom(i, j);
    let spin = spins[i][j];
    return (
      2.0 * CouplingConstant * spin * (top + bottom + left + right) +
      2.0 * spin * settings.magneticField! +
      0
    ); // 0 is BfieldM (set by sidebar, check v1)
  };

  function ComputeEforMetropolis() {
    let Ecurrent = 0.0;
    let Mcurrent = 0.0;

    for (var i = 0; i < settings.latticeSize; i++) {
      for (var j = 0; j < settings.latticeSize; j++) {
        const right = getRight(i, j);
        const bottom = getBottom(i, j);
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
    let _EdiffforM = deltaUofM(i, j, spins, settings);

    if (dashboard.temperature == 0) {
      if (_EdiffforM < 0.0 || (_EdiffforM == 0 && Math.random() < 0.5)) {
        spins[i][j] *= -1;
        color(i, j);
      }
    } else if (
      _EdiffforM < 0.0 ||
      Math.random() < Math.exp(-_EdiffforM / dashboard.temperature!)
    ) {
      spins[i][j] *= -1;
      color(i, j);
    }
  };

  if (settings.freePlay || settings.simulation) {
    for (let a = 0; a < settings.stepsPerFrame!; a++) {
      model();
    }
    if (settings.simulation) {
      // this code runs the model
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
        ...dashboard,
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

      temperatureInc();

      updateGraph({ x: dashboard.temperature, y: dashboard.magnetization });
      incSteps();
      window.requestAnimationFrame(metropolis);
    }

    if (settings.freePlay) {
      let { Ecurrent, Mcurrent } = ComputeEforMetropolis();
      setDashboard({
        ...dashboard,
        magnetization: Mcurrent / 10000,
        temperature: settings.initialTemp!,
      });
      updateGraph({ x: dashboard.temperature, y: dashboard.magnetization });
      window.requestAnimationFrame(metropolis);
    }
  }
};

export default metropolis;
