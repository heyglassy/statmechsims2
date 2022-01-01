import create from "zustand";
import TSStore from "../types/ts_store";
import { color } from "./color";
import { getBottom, getLeft, getRight, getTop } from "./dipoles";
import { temperatureInc } from "./runner";

const KawasakiLocal = () => {
  let {
    settings,
    spins,
    dashboard,
    nearestneighs,
    setDashboard,
    updateGraph,
    incSteps,
    localMagnetic,
    setSpins,
  } = create(TSStore).getState();

  let CouplingConstant: number;
  if (settings.magnetism! == "Ferromagnetic") {
    CouplingConstant = 1;
  } else {
    CouplingConstant = -1;
  }

  //energy change with local magnetic field
  function deltaUforKawasakiforM(i1: any, j1: any, i2: any, j2: any) {
    var thisS = spins[i1][j1];
    var thatS = spins[i2][j2];

    const left1 = getLeft(i1, j1);
    const right1 = getRight(i1, j1);
    const top1 = getTop(i1, j1);
    const bottom1 = getBottom(i1, j1);

    const left2 = getLeft(i1, j1);
    const right2 = getRight(i1, j1);
    const top2 = getTop(i1, j1);
    const bottom2 = getBottom(i1, j1);

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

  let ComputeEforKawasaki = () => {
    let Ecurrent = 0.0;
    let Mcurrent = 0.0;
    for (var i = 0; i < settings.latticeSize; i++) {
      for (var j = 0; j < settings.latticeSize; j++) {
        const right = getRight(i, j);
        const left = getLeft(i, j);
        const top = getTop(i, j);
        const bottom = getBottom(i, j);
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

  let model = () => {
    var i1 = Math.floor(Math.random() * settings.latticeSize);
    var j1 = Math.floor(Math.random() * settings.latticeSize);
    var dictkey = [i1, j1];
    var tryit = nearestneighs[dictkey]; // nearestneighs is defined below this function, Inherited from previous model, FIX
    var randtry = tryit[Math.floor(Math.random() * 4)];
    var i2 = randtry[0];
    var j2 = randtry[1];

    if (spins[i1][j1] != spins[i2][j2]) {
      let _EdiffforM = deltaUforKawasakiforM(i1, j1, i2, j2);
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

  setSpins(spins);

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
      window.requestAnimationFrame(KawasakiLocal);
    }
    if (settings.freePlay) {
      let { Ecurrent, Mcurrent } = ComputeEforKawasaki();
      setDashboard({
        ...dashboard,
        energy: Ecurrent / 1000,
        magnetization: Mcurrent / 10000,
        temperature: settings.initialTemp!,
      });
      updateGraph({ x: dashboard.temperature, y: dashboard.magnetization });
      window.requestAnimationFrame(KawasakiLocal);
    }
  }
};

/* Used in Kawasaki Local */

// energy change for kawasaki without local magnetic field
export default KawasakiLocal;
