import create from "zustand";
import { Store } from "../stores/store";
import { color } from "../helpers/color";
import { getBottom, getLeft, getRight, getTop } from "../helpers/dipoles";
import { temperatureInc } from "../helpers/runner";

const KawasakiNonLocal = () => {
  let {
    settings,
    spins,
    dashboard,
    setDashboard,
    updateGraph,
    incSteps,
    localMagnetic,
  } = create(Store).getState();

  let CouplingConstant: number;
  if (settings.magnetism! == "Ferromagnetic") {
    CouplingConstant = 1;
  } else {
    CouplingConstant = -1;
  }

  function deltaUforKawasakiforM(
    i1: number,
    j1: number,
    i2: number,
    j2: number
  ) {
    var thisS = spins[i1][j1];
    var thatS = spins[i2][j2];

    const left1 = getLeft(i1, j1);
    const right1 = getRight(i1, j1);
    const top1 = getTop(i1, j1);
    const bottom1 = getBottom(i1, j1);

    const left2 = getLeft(i2, j2);
    const right2 = getRight(i2, j2);
    const top2 = getTop(i2, j2);
    const bottom2 = getBottom(i2, j2);

    if (
      (j2 == j1 + 1 && i2 == i1) ||
      (j1 == j2 + 1 && i1 == i2) ||
      (j2 == j1 - 1 && i2 == i1) ||
      (j1 == j2 - 1 && i1 == i2) ||
      (j2 == j1 && i2 == i1 + 1) ||
      (j1 == j2 && i1 == i2 + 1) ||
      (j2 == j1 && i2 == i1 - 1) ||
      (j1 == j2 && i1 == i2 - 1)
    ) {
      return (
        2.0 * CouplingConstant * thisS * (bottom1 + top1 + left1 + right1) +
        2.0 * CouplingConstant * thatS * (bottom2 + top2 + left2 + right2) +
        4.0 * CouplingConstant +
        2.0 * thisS * (settings.magneticField! + localMagnetic[i1][j1]) +
        2.0 * thatS * (settings.magneticField! + localMagnetic[i2][j2])
      );
    } else {
      return (
        2.0 * CouplingConstant * thisS * (bottom1 + top1 + left1 + right1) +
        2.0 * CouplingConstant * thatS * (bottom2 + top2 + left2 + right2) +
        2.0 * thisS * (settings.magneticField! + localMagnetic[i1][j1]) +
        2.0 * thatS * (settings.magneticField! + localMagnetic[i2][j2])
      );
    }
  }

  const model = () => {
    var i1 = Math.floor(Math.random() * settings.latticeSize);
    var j1 = Math.floor(Math.random() * settings.latticeSize);
    var i2 = Math.floor(Math.random() * settings.latticeSize);
    var j2 = Math.floor(Math.random() * settings.latticeSize);
    if (spins[i1][j1] != spins[i2][j2]) {
      // s is a closure; it is the 2D array 'grid' that is mapped to the canvas
      var _EdiffforM = deltaUforKawasakiforM(i1, j1, i2, j2);
      if (dashboard.temperature == 0) {
        //to avoid dividing by zero
        if (_EdiffforM < 0.0 || (_EdiffforM == 0 && Math.random() < 0.5)) {
          //always flip if deltaU is negative
          spins[i1][j1] *= -1;
          spins[i2][j2] *= -1;
          color(i1, j1);
          color(i2, j2);
        }
      } else if (
        _EdiffforM <= 0.0 ||
        Math.random() < Math.exp(-_EdiffforM / dashboard.temperature)
      ) {
        spins[i1][j1] *= -1;
        spins[i2][j2] *= -1;
        color(i1, j1);
        color(i2, j2);
      }
    }
  };

  let ComputeEforKawasaki = () => {
    let Ecurrent = 0.0;
    let Mcurrent = 0.0;
    for (var i = 0; i < settings.latticeSize; i++) {
      for (var j = 0; j < settings.latticeSize; j++) {
        var right = getRight(i, j);
        var left = getLeft(i, j);
        var top = getTop(i, j);
        var bottom = getBottom(i, j);
        var thisS = spins[i][j];
        Ecurrent =
          Ecurrent -
          0.5 * CouplingConstant * thisS * (right + left + top + bottom) -
          thisS * settings.magneticField!;
        Mcurrent += thisS;
      }
    }
    return { Ecurrent, Mcurrent };
  };
  // energyo change for kawaskai without local magnetic field
  if (settings.freePlay || settings.simulation) {
    for (let a = 0; a < settings.stepsPerFrame!; a++) {
      model();
    }
    if (settings.simulation) {
      let { Ecurrent, Mcurrent } = ComputeEforKawasaki();

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
      window.requestAnimationFrame(KawasakiNonLocal);
    }
    if (settings.freePlay) {
      let { Ecurrent, Mcurrent } = ComputeEforKawasaki();
      setDashboard({
        ...dashboard,
        energy: Ecurrent / 10000,
        magnetization: Mcurrent / 10000,
        temperature: settings.initialTemp!,
      });
      updateGraph({ x: dashboard.temperature, y: dashboard.magnetization });
      window.requestAnimationFrame(KawasakiNonLocal);
    }
  }
};

export default KawasakiNonLocal;
