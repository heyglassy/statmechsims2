import produce from "immer";
import { color } from "../helpers/color";
import { getBottom, getLeft, getRight, getTop } from "../helpers/dipoles";
import Settings from "../stores/settings";
import Simulation from "../stores/simulation";

const metropolis = (timestamp: number) => {
  // let {
  //   settings,
  //   spins,
  //   dashboard,
  //   setDashboard,
  //   updateGraph,
  //   incSteps,
  //   localMagnetic,
  // } = create(Store).getState();

  const { magneticField, magnetism, latticeSize } = Settings.getState();
  let { spins, set, localMagnetic, temperature, running, freePlay } = Simulation.getState();

  let CouplingConstant: number;
  if (magnetism! == "Ferromagnetic") {
    CouplingConstant = 1;
  } else {
    CouplingConstant = -1;
  }

  const deltaUofM = (i: number, j: number) => {
    const left = getLeft(i, j);
    const right = getRight(i, j);
    const top = getTop(i, j);
    const bottom = getBottom(i, j);
    let spin = spins[i][j];
    return (
      2.0 * CouplingConstant * spin * (top + bottom + left + right) +
      2.0 * spin * (magneticField! + localMagnetic[i][j])
    );
  };

  const ComputeEforMetropolis = () => {
    let Ecurrent = 0.0;
    let Mcurrent = 0.0;

    for (let i = 0; i < latticeSize; i++) {
      for (let j = 0; j < latticeSize; j++) {
        const right = getRight(i, j);
        const bottom = getBottom(i, j);
        let thisS = spins[i][j];
        Ecurrent =
          Ecurrent -
          CouplingConstant * thisS * (right + bottom) -
          thisS * magneticField!;
        Mcurrent += thisS;
      }
    }
    return { Ecurrent, Mcurrent };
  }

  const model = () => {
    const i = Math.floor(Math.random() * latticeSize);
    const j = Math.floor(Math.random() * latticeSize);
    const _EdiffforM = deltaUofM(i, j);

    // simulation.set(produce(simulation, (draft) => {
    // if (simulation.temperature == 0) {
    //   if (_EdiffforM < 0.0 || (_EdiffforM == 0 && Math.random() < 0.5)) {
    //     draft.spins[i][j] *= -1;
    //     color(i, j);
    //   }
    // } else if (
    //   _EdiffforM < 0.0 ||
    //   Math.random() < Math.exp(-_EdiffforM / simulation.temperature!)
    // ) {
    //   draft.spins[i][j] *= -1;
    //   color(i, j);
    // }
    // }))
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

    set({ spins, temperature, localMagnetic });
  }


  if (freePlay || running) {
    // for (let a = 0; a < settings.stepsPerFrame!; a++) {
    // console.log("aaa", freePlay)
    model();
    // }
    if (running) {
      // this code runs the model
      let { Ecurrent, Mcurrent } = ComputeEforMetropolis();
      // console.log(Ecurrent)

      // const sigmaEnergy = Math.sqrt(
      //   (dashboard.energy * dashboard.energy) /
      //   (dashboard.frames.savedFrames + 1) -
      //   dashboard.averageEnergy * dashboard.averageEnergy
      // );

      // const sigmaMagnetisation = Math.sqrt(
      //   (dashboard.magnetization * dashboard.magnetization) /
      //   (dashboard.frames.savedFrames + 1) -
      //   dashboard.averageMagnetization * dashboard.averageMagnetization
      // );

      // setDashboard({
      //   ...dashboard,
      //   energy: Ecurrent / 10000,
      //   magnetization: Mcurrent / 10000,
      //   totalMagnetization: dashboard.totalMagnetization + Mcurrent / 10000,
      //   averageEnergy: dashboard.totalEnergy / dashboard.steps,
      //   averageMagnetization: dashboard.totalMagnetization / dashboard.steps,
      //   totalEnergy: dashboard.totalEnergy + Ecurrent / 10000,
      //   sigmaEnergy: isNaN(sigmaEnergy) ? null : sigmaEnergy,
      //   sigmaMagnetisation: isNaN(sigmaMagnetisation)
      //     ? null
      //     : sigmaMagnetisation,
      // });

      // temperatureInc();

      // updateGraph({ x: dashboard.temperature, y: dashboard.magnetization });
      // incSteps();
      // window.requestAnimationFrame(metropolis);
    }

    if (freePlay) {
      const { Ecurrent, Mcurrent } = ComputeEforMetropolis();
      // console.log(Ecurrent, Mcurrent);

      // setDashboard({
      //   ...dashboard,
      //   energy: Ecurrent / settings.stepsPerFrame!,
      //   magnetization: Mcurrent / settings.stepsPerFrame!,
      //   temperature: dashboard.temperature!,
      // });
      // updateGraph({ x: dashboard.temperature, y: dashboard.magnetization });
    }
    // window.requestAnimationFrame(metropolis);
  }
};

export default metropolis;