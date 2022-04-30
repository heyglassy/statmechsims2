import { color } from "../helpers/store";
import { getCouplingConstant } from "../helpers/coupling-constant";
import { getBottom, getLeft, getRight, getTop } from "../helpers/dipoles";
import Store2 from "../stores/store";

/*
jX jY = 1
anti ferromagnetic jx = -1, jy = -1
*/

export const ComputeEforMetropolis = () => {
  const { magneticField, latticeSize, magnetism } = Store2.getState().settings;
  const { spins } = Store2.getState().simulation
  const CouplingConstant = getCouplingConstant(magnetism);

  let Ecurrent = 0.0;
  let Mcurrent = 0.0;

  for (let i = 0; i < latticeSize; i++) {
    for (let j = 0; j < latticeSize; j++) {
      const right = getRight(i, j);
      const bottom = getBottom(i, j);

      Ecurrent =
        Ecurrent -
        CouplingConstant * spins[i][j] * (right + bottom) -
        spins[i][j] * magneticField!;
      Mcurrent += spins[i][j];
    }
  }
  return { Ecurrent, Mcurrent };
}

const metropolis = () => {
  const { magneticField, magnetism, latticeSize, stepsPerFrame } = Store2.getState().settings;
  const { localMagnetic, temperature } = Store2.getState().simulation
  const CouplingConstant = getCouplingConstant(magnetism);

  let { spins } = Store2.getState().simulation

  const deltaUofM = (i: number, j: number) => {
    const left = getLeft(i, j);
    const right = getRight(i, j);
    const top = getTop(i, j);
    const bottom = getBottom(i, j);
    const spin = spins[i][j];
    return (
      2.0 * CouplingConstant * spin * (top + bottom + left + right) +
      2.0 * spin * (magneticField! + localMagnetic[i][j])
    );
    // return (
    //  (jY * (top + bottom) + jX (left * right)) * CouplingConstant * spin * (top + bottom + left + right) +
    //   2.0 * spin * (magneticField! + localMagnetic[i][j])
    // );
  };

  const model = () => {
    const i = Math.floor(Math.random() * latticeSize);
    const j = Math.floor(Math.random() * latticeSize);
    const _EdiffforM = deltaUofM(i, j);

    if (temperature == 0) {
      if (_EdiffforM < 0.0 || (_EdiffforM == 0 && Math.random() < 0.5)) {
        spins[i][j] *= -1;
        color(i, j);
      }
    } else if (
      _EdiffforM < 0.0 ||
      Math.random() < Math.exp(-_EdiffforM / temperature!)
    ) {
      spins[i][j] *= -1;
      color(i, j);
    };
  }

  for (let a = 0; a < stepsPerFrame!; a++) {
    model();
  }

  return { spins, temperature, localMagnetic }
}
export default metropolis;