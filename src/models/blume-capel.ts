import create from "zustand";
import { Store } from "../stores/store";
import { temperatureInc } from "../helpers/runner";
import Canvas from "../stores/canvas";

export const colorBEG = (i: number, j: number, spins: Array<Array<number>>) => {
  // let { context, width } = create(Store).getState();
  const { context, width } = Canvas.getState()

  if (spins[i][j] == 1) {
    context!.fillStyle = "#FE0105"; // purple
  }
  if (spins[i][j] == 0) {
    context!.fillStyle = "#000102"; // ehite
  }
  if (spins[i][j] == -1) {
    context!.fillStyle = "#FEE901"; //red
  }
  context!.fillRect(i * width, j * width, width, width);
};

const BlumeCapel = (timemstamp: number) => {
  let {
    settings,
    spins,
    dashboard,
    setDashboard,
    updateGraph,
    localMagnetic,
    incSteps,
    setSpins,
  } = create(Store).getState();

  let CouplingConstant: number;
  if (settings.magnetism! == "Ferromagnetic") {
    CouplingConstant = 1;
  } else {
    CouplingConstant = -1;
  }
  let newSpins = spins;

  //energy change with local magnetic field
  const deltaUforBEGforM = (i1: number, j1: number, i2: number, j2: number) => {
    let thisS = newSpins[i1][j1];
    let thatS = newSpins[i2][j2];
    let left1 = getLeftBEM(i1, j1);
    let right1 = getRightBEM(i1, j1);
    let top1 = getTopBEM(i1, j1);
    let bottom1 = getBottomBEM(i1, j1);
    let left2 = getLeftBEM(i2, j2);
    let right2 = getRightBEM(i2, j2);
    let top2 = getTopBEM(i2, j2);
    let bottom2 = getBottomBEM(i2, j2);
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
        2.0 * thatS * (settings.magneticField! + localMagnetic[i2][j2]) // 0 is BfieldM
      );
    } else
      return (
        2.0 * CouplingConstant * thisS * (bottom1 + top1 + left1 + right1) +
        2.0 * CouplingConstant * thatS * (bottom2 + top2 + left2 + right2) +
        2.0 * thisS * (settings.magneticField! + localMagnetic[i1][j1]) +
        2.0 * thatS * (settings.magneticField! + localMagnetic[i2][j2])
      );
  };

  //computes total energy from scratch when using the BC algorithm
  const ComputeEforBEG = () => {
    let Ecurrent = 0.0;
    let Mcurrent = 0.0;
    for (let i = 0; i < settings.latticeSize; i++) {
      for (let j = 0; j < settings.latticeSize; j++) {
        let right = getRightBEM(i, j);
        let left = getLeftBEM(i, j);
        let top = getTopBEM(i, j);
        let bottom = getBottomBEM(i, j);
        let thisSS = spins[i][j];
        Ecurrent =
          Ecurrent -
          0.5 * CouplingConstant * thisSS * (right + left + top + bottom) -
          thisSS * settings.magneticField!;
        Mcurrent += thisSS;
      }
    }
    return { Ecurrent, Mcurrent };
  };

  //returns the dipole to the left of s[i][j] taking into account boundary conditions
  function getLeftBEM(i: number, j: number) {
    if (j == 0) {
      return newSpins[i][settings.latticeSize - 1];
    } else {
      return newSpins[i][j - 1];
    }
  }

  function getRightBEM(i: number, j: number) {
    if (j == settings.latticeSize - 1) {
      return newSpins[i][0];
    } else {
      return newSpins[i][j + 1];
    }
  }

  //dipole above s[i][j] with boundary conditions
  function getTopBEM(i: number, j: number) {
    if (i == 0) {
      return newSpins[settings.latticeSize - 1][j];
    } else {
      return newSpins[i - 1][j];
    }
  }

  //dipole below with boundary conditions
  function getBottomBEM(i: number, j: number) {
    if (i == settings.latticeSize - 1) {
      return newSpins[0][j];
    } else {
      return newSpins[i + 1][j];
    }
  }

  const model = () => {
    let i1 = Math.floor(Math.random() * settings.latticeSize);
    let j1 = Math.floor(Math.random() * settings.latticeSize);
    let i2 = Math.floor(Math.random() * settings.latticeSize);
    let j2 = Math.floor(Math.random() * settings.latticeSize);
    if (newSpins[i1][j1] != newSpins[i2][j2]) {
      let thisS = newSpins[i1][j1];
      let thatS = newSpins[i2][j2];
      let EdiffforM = deltaUforBEGforM(i1, j1, i2, j2);
      if (dashboard.temperature == 0) {
        //to avoid dividing by zero
        if (EdiffforM < 0.0 || (EdiffforM == 0 && Math.random() < 0.5)) {
          //always flip if deltaU is negative
          newSpins[i1][j1] = thatS;
          newSpins[i2][j2] = thisS;
          colorBEG(i1, j1, newSpins);
          colorBEG(i2, j2, newSpins);
        }
      } else if (
        EdiffforM <= 0.0 ||
        Math.random() < Math.exp(-EdiffforM / dashboard.temperature)
      ) {
        newSpins[i1][j1] = thatS;
        newSpins[i2][j2] = thisS;
        colorBEG(i1, j1, newSpins);
        colorBEG(i2, j2, newSpins);
      }
    }
  };

  if (settings.freePlay || settings.simulation) {
    for (let a = 0; a < settings.stepsPerFrame!; a++) {
      model();
    }
    if (settings.simulation) {
      // this code runs the model

      let { Ecurrent, Mcurrent } = ComputeEforBEG();
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
      window.requestAnimationFrame(BlumeCapel);
    }
    if (settings.freePlay) {
      const { Ecurrent, Mcurrent } = ComputeEforBEG();

      console.log(dashboard.temperature)

      setDashboard({
        ...dashboard,
        energy: Ecurrent / settings.stepsPerFrame!,
        magnetization: Mcurrent / settings.stepsPerFrame!,
        temperature: dashboard.temperature!,
      });

      if (settings.freePlayIncrement) {
        incSteps();
        temperatureInc();
      }

      updateGraph({ x: dashboard.temperature, y: dashboard.magnetization });
      window.requestAnimationFrame(BlumeCapel);
    }
  }
  setSpins(newSpins);
};

export default BlumeCapel;
