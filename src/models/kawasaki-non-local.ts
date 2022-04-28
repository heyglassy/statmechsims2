import { color } from "../helpers/color";
import { getCouplingConstant } from "../helpers/coupling-constant";
import { getBottom, getLeft, getRight, getTop } from "../helpers/dipoles";
import Store2 from "../types/store2";

export const ComputeEforKawasaki = () => {
  const { magneticField, latticeSize, magnetism } = Store2.getState().settings;
  const { spins } = Store2.getState().simulation

  let Ecurrent = 0.0;
  let Mcurrent = 0.0;

  for (let i = 0; i < latticeSize; i++) {
    for (let j = 0; j < latticeSize; j++) {
      let right = getRight(i, j);
      let left = getLeft(i, j);
      let top = getTop(i, j);
      let bottom = getBottom(i, j);
      let thisS = spins[i][j];
      Ecurrent =
        Ecurrent -
        0.5 * getCouplingConstant(magnetism) * thisS * (right + left + top + bottom) -
        thisS * magneticField!;
      Mcurrent += thisS;
    }
  }
  return { Ecurrent, Mcurrent };
};

export const deltaUforKawasakiforM = (
  i1: number,
  j1: number,
  i2: number,
  j2: number,
  spins: number[][]
) => {
  const { magneticField, magnetism } = Store2.getState().settings;
  const { localMagnetic } = Store2.getState().simulation
  const CouplingConstant = getCouplingConstant(magnetism)


  let thisS = spins[i1][j1];
  let thatS = spins[i2][j2];

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
}

const deltaUforKawasaki = (i1: number, j1: number, i2: number, j2: number, spins: number[][]) => {

  const { latticeSize, magneticField, magnetism, boundariesConditions } = Store2.getState().settings;
  const { localMagnetic } = Store2.getState().simulation
  const CouplingConstant = getCouplingConstant(magnetism);

  let thisS = spins[i1][j1];
  let thatS = spins[i2][j2];

  let left1 = getLeft(i1, j1)
  let right1 = getRight(i1, j1)
  let top1 = getTop(i1, j1);
  let bottom1 = getBottom(i1, j1);

  let left2 = getLeft(i2, j2)
  let right2 = getRight(i2, j2)
  let top2 = getTop(i2, j2);
  let bottom2 = getBottom(i2, j2);


  if (
    i1 === i2 && (
      (j1 === latticeSize - 1 && j2 === 0) || (j1 === 0 && j2 === latticeSize - 1)
    ) ||
    j1 === j2 && (
      (i1 === latticeSize - 1 && i2 === 0) || (i1 === 0 && i2 === latticeSize - 1)
    )
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
        2.0 * thisS * (magneticField! + localMagnetic[i2][j2])
      )
    } else if (boundariesConditions === "Isolated Boundaries") {
      return (
        2.0 * CouplingConstant * thisS * (bottom1 + top1 + left1 + right1) +
        2.0 * CouplingConstant * thatS * (bottom2 + top2 + left2 + right2) +
        2.0 * thisS * (magneticField! + localMagnetic[i1][j1]) +
        2.0 * thisS * (magneticField! + localMagnetic[i2][j2])
      )
    }
  } else if (
    i1 === i2 && (
      (j1 + 1 === j2) || (j1 === j2 + 1) || (j1 - 1 === j2) || (j1 === j2 - 1)
    ) ||
    j1 === j2 && (
      (i1 + 1 === i2) || (i1 === i2 + 1) || (i1 - 1 === i2) || (i1 === i2 - 1)
    )
  ) {
    return (
      2.0 * CouplingConstant * thisS * (bottom1 + top1 + left1 + right1) +
      2.0 * CouplingConstant * thatS * (bottom2 + top2 + left2 + right2) +
      4.0 * CouplingConstant +
      2.0 * thisS * (magneticField! + localMagnetic[i1][j1]) +
      2.0 * thisS * (magneticField! + localMagnetic[i2][j2])
    )
  } else {
    console.log("?????")
    return (
      2.0 * CouplingConstant * thisS * (bottom1 + top1 + left1 + right1) +
      2.0 * CouplingConstant * thatS * (bottom2 + top2 + left2 + right2) +
      2.0 * thisS * (magneticField! + localMagnetic[i1][j1]) +
      2.0 * thisS * (magneticField! + localMagnetic[i2][j2])
    )
  }
}


const KawasakiNonLocal = () => {
  // const { latticeSize, stepsPerFrame } = Store2.getState().settings;
  // const { localMagnetic, temperature } = Store2.getState().simulation

  // let { spins } = Store2.getState().simulation


  const { latticeSize, stepsPerFrame, boundariesConditions, magnetism, magneticField } = Store2.getState().settings;
  const { localMagnetic, temperature, } = Store2.getState().simulation
  const CouplingConstant = getCouplingConstant(magnetism)

  let { spins, energy, magnetism: simulationMagnetism } = Store2.getState().simulation

  // const deltaUforKawasaki = (i1: number, j1: number, i2: number, j2: number) => {
  //   let thisS = spins[i1][j1];
  //   let thatS = spins[i2][j2];

  //   let left1 = getLeft(i1, j1);
  //   let right1 = getRight(i1, j1);
  //   let top1 = getTop(i1, j1);
  //   let bottom1 = getBottom(i1, j1);

  //   let left2 = getLeft(i2, j2);
  //   let right2 = getRight(i2, j2);
  //   let top2 = getTop(i2, j2);
  //   let bottom2 = getBottom(i2, j2);

  //   if (
  //     (j2 == 0 && j1 == latticeSize - 1 && i2 == i1) ||
  //     (j2 == latticeSize - 1 && j1 == 0 && i2 == i1) ||
  //     (i2 == 0 && i1 == latticeSize - 1 && j2 == j1) ||
  //     (i2 == latticeSize - 1 && i1 == 0 && j2 == j1)
  //   ) {
  //     if (boundariesConditions === "Periodic Boundaries" ||
  //       boundariesConditions === "Anti-periodic Boundaries (both directions)" ||
  //       boundariesConditions === "Anti-periodic Boundaries (one directions)" ||
  //       boundariesConditions === "Plus-Minus Boundaries (one direction)"
  //     ) {
  //       return (
  //         2.0 * CouplingConstant * thisS * (bottom1 + top1 + left1 + right1) +
  //         2.0 * CouplingConstant * thatS * (bottom2 + top2 + left2 + right2) +
  //         4.0 * CouplingConstant +
  //         2.0 * thisS * (magneticField! + localMagnetic[i1][j1]) +
  //         2.0 * thatS * (magneticField! + localMagnetic[i2][j2])
  //       )
  //     }
  //     else if (boundariesConditions === "Isolated Boundaries") {
  //       return (
  //         2.0 * CouplingConstant * thisS * (bottom1 + top1 + left1 + right1) +
  //         2.0 * CouplingConstant * thatS * (bottom2 + top2 + left2 + right2) +
  //         2.0 * thisS * (magneticField! + localMagnetic[i1][j1]) +
  //         2.0 * thatS * (magneticField! + localMagnetic[i2][j2])
  //       );
  //     }
  //   } else if (
  //     (j2 == j1 + 1 && i2 == i1) ||
  //     (j1 == j2 + 1 && i1 == i2) ||
  //     (j2 == j1 - 1 && i2 == i1) ||
  //     (j1 == j2 - 1 && i1 == i2) ||
  //     (j2 == j1 && i2 == i1 + 1) ||
  //     (j1 == j2 && i1 == i2 + 1) ||
  //     (j2 == j1 && i2 == i1 - 1) ||
  //     (j1 == j2 && i1 == i2 - 1)
  //   ) {
  //     return (
  //       2.0 * CouplingConstant * thisS * (bottom1 + top1 + left1 + right1) +
  //       2.0 * CouplingConstant * thatS * (bottom2 + top2 + left2 + right2) +
  //       4.0 * CouplingConstant +
  //       2.0 * thisS * (magneticField! + localMagnetic[i1][j1]) +
  //       2.0 * thatS * (magneticField! + localMagnetic[i2][j2])
  //     );
  //   }
  //   else {
  //     return (
  //       2.0 * CouplingConstant * thisS * (bottom1 + top1 + left1 + right1) +
  //       2.0 * CouplingConstant * thatS * (bottom2 + top2 + left2 + right2) +
  //       2.0 * thisS * (magneticField! + localMagnetic[i1][j1]) +
  //       2.0 * thatS * (magneticField! + localMagnetic[i2][j2])
  //     );
  //   }
  // }

  const model = () => {
    let i1 = Math.floor(Math.random() * latticeSize);
    let j1 = Math.floor(Math.random() * latticeSize);
    let i2 = Math.floor(Math.random() * latticeSize);
    let j2 = Math.floor(Math.random() * latticeSize);

    if (spins[i1][j1] !== spins[i2][j2]) {
      // s is a closure; it is the 2D array 'grid' that is mapped to the canvas
      let _EdiffforM = deltaUforKawasakiforM(i1, j1, i2, j2, spins);
      let _Ediff = deltaUforKawasaki(i1, i2, j1, j2, spins)
      //to avoid dividing by zero
      if (temperature == 0 && (_EdiffforM < 0.0 || (_EdiffforM == 0 && Math.random() < 0.5))) {
        //always flip if deltaU is negativee
        spins[i1][j1] *= -1;
        spins[i2][j2] *= -1;

        color(i1, j1);
        color(i2, j2);

        energy += _Ediff!;
        simulationMagnetism += ((2 * spins[i1][j1]) + (2 * spins[i2][j2]))
      } else if (
        _EdiffforM <= 0.0 ||
        Math.random() < Math.exp(-_EdiffforM / temperature)
      ) {
        spins[i1][j1] *= -1;
        spins[i2][j2] *= -1;

        color(i1, j1);
        color(i2, j2);

        energy += _Ediff!;
        simulationMagnetism += ((2 * spins[i1][j1]) + (2 * spins[i2][j2]))
      }
    }
  };

  for (let a = 0; a < stepsPerFrame!; a++) {
    model();
  }


  return { spins, localMagnetic, temperature, energy, magnetism: simulationMagnetism }
}

export default KawasakiNonLocal;



//   if (settings.simulation) {
//     let { Ecurrent, Mcurrent } = ComputeEforKawasaki();

//     const sigmaEnergy = Math.sqrt(
//       (dashboard.energy * dashboard.energy) /
//       (dashboard.frames.savedFrames + 1) -
//       dashboard.averageEnergy * dashboard.averageEnergy
//     );

//     const sigmaMagnetisation = Math.sqrt(
//       (dashboard.magnetization * dashboard.magnetization) /
//       (dashboard.frames.savedFrames + 1) -
//       dashboard.averageMagnetization * dashboard.averageMagnetization
//     );

//     setDashboard({
//       ...dashboard,
//       energy: Ecurrent / 10000,
//       magnetization: Mcurrent / 10000,
//       totalMagnetization: dashboard.totalMagnetization + Mcurrent / 10000,
//       averageEnergy: dashboard.totalEnergy / dashboard.steps,
//       averageMagnetization: dashboard.totalMagnetization / dashboard.steps,
//       totalEnergy: dashboard.totalEnergy + Ecurrent / 10000,
//       sigmaEnergy: isNaN(sigmaEnergy) ? null : sigmaEnergy,
//       sigmaMagnetisation: isNaN(sigmaMagnetisation)
//         ? null
//         : sigmaMagnetisation,
//     });

//     temperatureInc();

//     updateGraph({ x: dashboard.temperature, y: dashboard.magnetization });
//     incSteps();
//     window.requestAnimationFrame(KawasakiNonLocal);
//   }
//   if (settings.freePlay) {
//     let { Ecurrent, Mcurrent } = ComputeEforKawasaki();
//     setDashboard({
//       ...dashboard,
//       energy: Ecurrent / 10000,
//       magnetization: Mcurrent / 10000,
//       temperature: settings.initialTemp!,
//     });
//     updateGraph({ x: dashboard.temperature, y: dashboard.magnetization });
//     window.requestAnimationFrame(KawasakiNonLocal);
//   }
// }
// };

