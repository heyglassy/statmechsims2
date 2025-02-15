import { color } from "../helpers/store";
import { getBottom, getLeft, getRight, getTop } from "../helpers/dipoles";
import { getCouplingConstant } from "../helpers/coupling-constant";
import Store from "../stores/store";
import { deltaUforKawasakiforM } from "./kawasaki-non-local";

const KawasakiLocal = () => {
  //energy change with local magnetic field
  const {
    latticeSize,
    stepsPerFrame,
    magneticField,
    magnetism,
    boundariesConditions,
  } = Store.getState().settings;
  const { localMagnetic, temperature, nearestNeighs } =
    Store.getState().simulation;
  const CouplingConstant = getCouplingConstant(magnetism);

  let {
    spins,
    energy,
    magnetism: simulationMagnetism,
  } = Store.getState().simulation;

  const deltaUforKawasaki = (
    i1: number,
    j1: number,
    i2: number,
    j2: number
  ) => {
    let thisS = spins[i1][j1];
    let thatS = spins[i2][j2];

    let left1 = getLeft(i1, j1);
    let right1 = getRight(i1, j1);
    let top1 = getTop(i1, j1);
    let bottom1 = getBottom(i1, j1);

    let left2 = getLeft(i2, j2);
    let right2 = getRight(i2, j2);
    let top2 = getTop(i2, j2);
    let bottom2 = getBottom(i2, j2);

    if (
      (j2 == 0 && j1 == latticeSize - 1 && i2 == i1) ||
      (j2 == latticeSize - 1 && j1 == 0 && i2 == i1) ||
      (i2 == 0 && i1 == latticeSize - 1 && j2 == j1) ||
      (i2 == latticeSize - 1 && i1 == 0 && j2 == j1)
    ) {
      if (
        boundariesConditions === "Periodic Boundaries" ||
        boundariesConditions === "Anti-periodic Boundaries (both directions)" ||
        boundariesConditions === "Anti-periodic Boundaries (one directions)" ||
        boundariesConditions === "Plus-Minus Boundaries (one direction)"
      ) {
        return (
          2.0 * CouplingConstant * thisS * (bottom1 + top1 + left1 + right1) +
          2.0 * CouplingConstant * thatS * (bottom2 + top2 + left2 + right2) +
          4.0 * CouplingConstant +
          2.0 * thisS * (magneticField! + localMagnetic[i1][j1]) +
          2.0 * thatS * (magneticField! + localMagnetic[i2][j2])
        );
      } else if (boundariesConditions === "Isolated Boundaries") {
        return (
          2.0 * CouplingConstant * thisS * (bottom1 + top1 + left1 + right1) +
          2.0 * CouplingConstant * thatS * (bottom2 + top2 + left2 + right2) +
          2.0 * thisS * (magneticField! + localMagnetic[i1][j1]) +
          2.0 * thatS * (magneticField! + localMagnetic[i2][j2])
        );
      }
    } else if (
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
        2.0 * thisS * (magneticField! + localMagnetic[i1][j1]) +
        2.0 * thatS * (magneticField! + localMagnetic[i2][j2])
      );
    } else {
      return (
        2.0 * CouplingConstant * thisS * (bottom1 + top1 + left1 + right1) +
        2.0 * CouplingConstant * thatS * (bottom2 + top2 + left2 + right2) +
        2.0 * thisS * (magneticField! + localMagnetic[i1][j1]) +
        2.0 * thatS * (magneticField! + localMagnetic[i2][j2])
      );
    }
  };

  const model = () => {
    let i1 = Math.floor(Math.random() * latticeSize);
    let j1 = Math.floor(Math.random() * latticeSize);
    let dictkey = [i1, j1];
    let tryit = nearestNeighs[dictkey]; // nearestneighs is defined below this function, Inherited from previous model, FIX
    let randtry = tryit[Math.floor(Math.random() * 4)];
    let i2 = randtry[0];
    let j2 = randtry[1];

    if (spins[i1][j1] != spins[i2][j2]) {
      let _EdiffforM = deltaUforKawasakiforM(i1, j1, i2, j2, spins);
      let _Ediff = deltaUforKawasaki(i1, j1, i2, j2);

      if (temperature == 0) {
        //to avoid dividing by zero
        if (_EdiffforM < 0.0 || (_EdiffforM == 0 && Math.random() < 0.5)) {
          //always flip if deltaU is negative
          spins[i1][j1] *= -1;
          spins[i2][j2] *= -1;

          color(i1, j1);
          color(i2, j2);

          energy += _Ediff!;
          simulationMagnetism += 2 * spins[i1][j1] + 2 * spins[i2][j2];
        }
      } else if (
        _EdiffforM <= 0.0 ||
        Math.random() < Math.exp(-_EdiffforM / temperature)
      ) {
        spins[i1][j1] *= -1;
        spins[i2][j2] *= -1;

        color(i1, j1);
        color(i2, j2);

        energy += _Ediff!;
        simulationMagnetism += 2 * spins[i1][j1] + 2 * spins[i2][j2];
      }
    }
  };

  for (let a = 0; a < stepsPerFrame!; a++) {
    model();
  }

  return {
    spins,
    localMagnetic,
    temperature,
    energy,
    magnetism: simulationMagnetism,
  };
};

export default KawasakiLocal;
