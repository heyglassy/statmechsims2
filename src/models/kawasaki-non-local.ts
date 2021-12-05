import create from "zustand";
import TSStore from "../types/ts_store";

const KawasakiNonLocal = () => {
  let {
    settings,
    spins,
    context,
    dashboard,
    nearestneighs,
    setDashboard,
    updateGraph,
    incSteps,
    incFrames,
    incCycles,
    endSimulation,
    updatePayload,
    canvas,
  } = create(TSStore).getState();
  let CouplingConstant = 1; // subject to change with added sidebar items
  let width = 600 / settings.latticeSize;

  let colorSquare = (i: number, j: number) => {
    if (spins[i][j] == 1) context!.fillStyle = "black";
    else context!.fillStyle = "white";
    context!.fillRect(i * width, j * width, width, width);
  };

  const getLeft = (i: number, j: number) => {
    if (j == 0) {
      // TODO: Add different boundary settings
      return spins[i][settings.latticeSize - 1];
    } else {
      return spins[i][j - 1];
    }
  };

  const getRight = (i: number, j: number) => {
    if (j == settings.latticeSize - 1) {
      // TODO: Add different boundary settings
      return spins[i][0];
    } else {
      return spins[i][j + 1];
    }
  };

  const getTop = (i: number, j: number) => {
    if (i == 0) {
      // TODO: Add different boundary settings
      return spins[settings.latticeSize - 1][j];
    } else {
      return spins[i - 1][j];
    }
  };

  const getBottom = (i: number, j: number) => {
    if (i == settings.latticeSize - 1) {
      return spins[0][j];
    } else {
      return spins[i + 1][j];
    }
  };

  //   function deltaUforKawasaki(i1: any, j1: any, i2: any, j2: any) {
  //     var thisS = spins[i1][j1];
  //     var thatS = spins[i2][j2];

  //     var left1 = getLeft(i1, j1);
  //     var right1 = getRight(i1, j1);
  //     var top1 = getTop(i1, j1);
  //     var bottom1 = getBottom(i1, j1);

  //     var left2 = getLeft(i2, j2);
  //     var right2 = getRight(i2, j2);
  //     var top2 = getTop(i2, j2);
  //     var bottom2 = getBottom(i2, j2);

  //     if (
  //       (j2 == 0 && j1 == settings.latticeSize - 1 && i2 == i1) ||
  //       (j2 == settings.latticeSize - 1 && j1 == 0 && i2 == i1) ||
  //       (i2 == 0 && i1 == settings.latticeSize - 1 && j2 == j1) ||
  //       (i2 == settings.latticeSize - 1 && i1 == 0 && j2 == j1)
  //     ) {
  //       //   if (pbc || ApbcBothDirections || ApbcOneDirection || PlusMinus)
  //       //     return (
  //       //       2.0 * CouplingConstant * thisS * (bottom1 + top1 + left1 + right1) +
  //       //       2.0 * CouplingConstant * thatS * (bottom2 + top2 + left2 + right2) +
  //       //       4.0 * CouplingConstant +
  //       //       2.0 * thisS * (Bfield + BfieldM[i1][j1]) +
  //       //       2.0 * thatS * (Bfield + BfieldM[i2][j2])
  //       //     );
  //       //   else if (FreeBound)
  //       //     return (
  //       //       2.0 * CouplingConstant * thisS * (bottom1 + top1 + left1 + right1) +
  //       //       2.0 * CouplingConstant * thatS * (bottom2 + top2 + left2 + right2) +
  //       //       2.0 * thisS * (Bfield + BfieldM[i1][j1]) +
  //       //       2.0 * thatS * (Bfield + BfieldM[i2][2])
  //       //     );
  //       if (
  //         (j2 == j1 + 1 && i2 == i1) ||
  //         (j1 == j2 + 1 && i1 == i2) ||
  //         (j2 == j1 - 1 && i2 == i1) ||
  //         (j1 == j2 - 1 && i1 == i2) ||
  //         (j2 == j1 && i2 == i1 + 1) ||
  //         (j1 == j2 && i1 == i2 + 1) ||
  //         (j2 == j1 && i2 == i1 - 1) ||
  //         (j1 == j2 && i1 == i2 - 1)
  //       )
  //         return (
  //           2.0 * CouplingConstant * thisS * (bottom1 + top1 + left1 + right1) +
  //           2.0 * CouplingConstant * thatS * (bottom2 + top2 + left2 + right2) +
  //           4.0 * CouplingConstant +
  //           2.0 * thisS * (settings.magneticField! + 0) +
  //           2.0 * thatS * (settings.magneticField! + 0)
  //         );
  //       else
  //         return (
  //           2.0 * CouplingConstant * thisS * (bottom1 + top1 + left1 + right1) +
  //           2.0 * CouplingConstant * thatS * (bottom2 + top2 + left2 + right2) +
  //           2.0 * thisS * (settings.magneticField! + 0) +
  //           2.0 * thatS * (settings.magneticField! + 0)
  //         );
  //     }

  //     //energy change with local magnetic field
  //   }

  function deltaUforKawasakiforM(
    i1: number,
    j1: number,
    i2: number,
    j2: number
  ) {
    var thisS = spins[i1][j1];
    var thatS = spins[i2][j2];

    var left1 = getLeft(i1, j1);
    var right1 = getRight(i1, j1);
    var top1 = getTop(i1, j1);
    var bottom1 = getBottom(i1, j1);

    var left2 = getLeft(i2, j2);
    var right2 = getRight(i2, j2);
    var top2 = getTop(i2, j2);
    var bottom2 = getBottom(i2, j2);

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
        2.0 * thisS * (settings.magneticField! + 0) +
        2.0 * thatS * (settings.magneticField! + 0)
      );
    } else {
      return (
        2.0 * CouplingConstant * thisS * (bottom1 + top1 + left1 + right1) +
        2.0 * CouplingConstant * thatS * (bottom2 + top2 + left2 + right2) +
        2.0 * thisS * (settings.magneticField! + 0) +
        2.0 * thatS * (settings.magneticField! + 0)
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
      var thisS = spins[i1][j1];
      var thatS = spins[i2][j2];
      var _EdiffforM = deltaUforKawasakiforM(i1, j1, i2, j2);
      if (dashboard.temperature == 0) {
        //to avoid dividing by zero
        if (_EdiffforM < 0.0 || (_EdiffforM == 0 && Math.random() < 0.5)) {
          //always flip if deltaU is negative
          thisS *= -1;
          spins[i1][j1] = thisS;
          thatS *= -1;
          spins[i2][j2] = thatS;
          colorSquare(i1, j1);
          colorSquare(i2, j2);
        }
      } else if (
        _EdiffforM <= 0.0 ||
        Math.random() < Math.exp(-_EdiffforM / dashboard.temperature)
      ) {
        thisS *= -1;
        spins[i1][j1] = thisS;
        thatS *= -1;
        spins[i2][j2] = thatS;
        colorSquare(i1, j1);
        colorSquare(i2, j2);
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
        incFrames(); // This increments the temperature as well.
        if (dashboard.temperature == settings.maxTemp!) {
          if (dashboard.cycles.currentCycle == dashboard.cycles.totalCycles) {
            endSimulation();
          } else {
            incCycles(); // This also resets temperature to start the next cycle.
          }
        }
      }

      let { Ecurrent, Mcurrent } = ComputeEforKawasaki();
      setDashboard({
        energy: Ecurrent / 10000,
        magnetization: Mcurrent / 10000,
        totalMagnetization: dashboard.totalMagnetization + Mcurrent / 10000,
        averageEnergy: dashboard.totalEnergy / dashboard.steps,
        averageMagnetization: dashboard.totalMagnetization / dashboard.steps,
        totalEnergy: dashboard.totalEnergy + Ecurrent / 10000,
        sigmaEnergy: Math.sqrt(
          (dashboard.energy * dashboard.energy) /
            (dashboard.frames.savedFrames + 1) -
            dashboard.averageEnergy * dashboard.averageEnergy
        ),
        sigmaMagnetisation: Math.sqrt(
          (dashboard.magnetization * dashboard.magnetization) /
            (dashboard.frames.savedFrames + 1) -
            dashboard.averageMagnetization * dashboard.averageMagnetization
        ),
      });
      updateGraph({ x: dashboard.temperature, y: dashboard.magnetization });
      incSteps();
      window.requestAnimationFrame(KawasakiNonLocal);
    }
    if (settings.freePlay) {
      for (let a = 0; a < settings.stepsPerFrame!; a++) {
        model();
      }
      let { Ecurrent, Mcurrent } = ComputeEforKawasaki();
      setDashboard({
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
