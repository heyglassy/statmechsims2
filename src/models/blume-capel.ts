import create from "zustand";
import { getCouplingConstant } from "../helpers/coupling-constant";
import Store2 from "../stores/store2";

export const colorBEG = (i: number, j: number, spins: Array<Array<number>>) => {
  let { context, width } = create(Store2).getState().canvas;

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

const getLeftBEM = (i: number, j: number, spins: number[][], latticeSize: number) => {
  if (j == 0) {
    return spins[i][latticeSize - 1];
  } else {
    return spins[i][j - 1];
  }
}

// const getRightBEM = (i: number, j: number) => {
const getRightBEM = (i: number, j: number, spins: number[][], latticeSize: number) => {
  if (j == latticeSize - 1) {
    return spins[i][0];
  } else {
    return spins[i][j + 1];
  }
}

//dipole above s[i][j] with boundary conditions
const getTopBEM = (i: number, j: number, spins: number[][], latticeSize: number) => {
  if (i == 0) {
    return spins[latticeSize - 1][j];
  } else {
    return spins[i - 1][j];
  }
}

//dipole below with boundary conditions
const getBottomBEM = (i: number, j: number, spins: number[][], latticeSize: number) => {
  if (i == latticeSize - 1) {
    return spins[0][j];
  } else {
    return spins[i + 1][j];
  }
}

export const ComputeEforBEG = () => {
  const { magneticField, latticeSize, magnetism } = Store2.getState().settings;
  const { spins } = Store2.getState().simulation
  const CouplingConstant = getCouplingConstant(magnetism);

  let Ecurrent = 0.0;
  let Mcurrent = 0.0;

  for (let i = 0; i < latticeSize; i++) {
    for (let j = 0; j < latticeSize; j++) {
      let right = getRightBEM(i, j, spins, latticeSize);
      let left = getLeftBEM(i, j, spins, latticeSize);
      let top = getTopBEM(i, j, spins, latticeSize);
      let bottom = getBottomBEM(i, j, spins, latticeSize);

      Ecurrent =
        Ecurrent -
        0.5 * CouplingConstant * spins[i][j] * (right + left + top + bottom) -
        spins[i][j] * magneticField!;
      Mcurrent += spins[i][j];
    }
  }

  return { Ecurrent, Mcurrent };
};

const BlumeCapel = () => {
  const { magneticField, latticeSize, magnetism, stepsPerFrame } = Store2.getState().settings;
  const { temperature, localMagnetic } = Store2.getState().simulation

  let { spins } = Store2.getState().simulation
  const CouplingConstant = getCouplingConstant(magnetism);

  //energy change with local magnetic field
  //computes total energy from scratch when using the BC algorithm
  //returns the dipole to the left of s[i][j] taking into account boundary conditions
  const model = () => {
    let i1 = Math.floor(Math.random() * latticeSize);
    let i2 = Math.floor(Math.random() * latticeSize);
    let j1 = Math.floor(Math.random() * latticeSize);
    let j2 = Math.floor(Math.random() * latticeSize);

    const deltaUforBEGforM = (i1: number, j1: number, i2: number, j2: number) => {
      let left1 = getLeftBEM(i1, j1, spins, latticeSize);
      let right1 = getRightBEM(i1, j1, spins, latticeSize);
      let top1 = getTopBEM(i1, j1, spins, latticeSize);
      let bottom1 = getBottomBEM(i1, j1, spins, latticeSize);

      let left2 = getLeftBEM(i2, j2, spins, latticeSize);
      let right2 = getRightBEM(i2, j2, spins, latticeSize);
      let top2 = getTopBEM(i2, j2, spins, latticeSize);
      let bottom2 = getBottomBEM(i2, j2, spins, latticeSize);

      if (((j2 == j1 + 1) && i2 == i1) || ((j1 == j2 + 1) && i1 == i2) || ((j2 == j1 - 1) && (i2 == i1))
        || (j1 == j2 - 1 && i1 == i2) || (j2 == j1 && i2 == i1 + 1) || (j1 == j2 && i1 == i2 + 1) ||
        (j2 == j1 && i2 == i1 - 1) || (j1 == j2 && i1 == i2 - 1)) {
        return 2.0 * CouplingConstant * spins[i1][j1] * (bottom1 + top1 + left1 + right1) + 2.0 * CouplingConstant * spins[i2][j2] * (bottom2 + top2 + left2 + right2) + 4.0 * CouplingConstant + 2.0 * spins[i1][j1] * (magneticField! + localMagnetic[i1][j1]) + 2.0 * spins[i2][j2] * (magneticField! + localMagnetic[i2][j2]);

      } else
        return 2.0 * CouplingConstant * spins[i1][j1] * (bottom1 + top1 + left1 + right1) + 2.0 * CouplingConstant * spins[i2][j2] * (bottom2 + top2 + left2 + right2) + 2.0 * spins[i1][j1] * (magneticField! + localMagnetic[i1][j1]) + 2.0 * spins[i2][j2] * (magneticField! + localMagnetic[i2][j2]);
    }

    if (spins[i1][j1] != spins[i2][j2]) {
      let thisS = spins[i1][j1];
      let thatS = spins[i2][j2];
      let EdiffforM = deltaUforBEGforM(i1, j1, i2, j2);
      if (temperature == 0) {
        //to avoid dividing by zero
        if (EdiffforM < 0.0 || (EdiffforM == 0 && Math.random() < 0.5)) {
          //always flip if deltaU is negative
          spins[i1][j1] = thatS;
          spins[i2][j2] = thisS;
          colorBEG(i1, j1, spins);
          colorBEG(i2, j2, spins);
        }
      } else if (
        EdiffforM <= 0.0 ||
        Math.random() < Math.exp(-EdiffforM / temperature)
      ) {
        spins[i1][j1] = thatS;
        spins[i2][j2] = thisS;
        colorBEG(i1, j1, spins);
        colorBEG(i2, j2, spins);
      }
    }
  };

  for (let a = 0; a < stepsPerFrame!; a++) {
    model();
  }

  return { spins, temperature, localMagnetic };
}

export default BlumeCapel;