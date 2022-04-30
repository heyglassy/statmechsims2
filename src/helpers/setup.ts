import qpotts from "../models/q-potts";
import wolff from "../models/wolff";
import transverse from "../models/transverse-field-ising";
import { color, color2 } from "./store";
import { colorBEG } from "../models/blume-capel";
import Store2 from "../stores/store";

export const setup = (model: string) => {
  const { settings, simulation, canvas: { context, width } } = Store2.getState();

  if (
    model == "/models/metropolis" ||
    model == "/models/kawasaki-local" ||
    model == "/models/kawasaki-non-local"
  ) {
    for (let i = 0; i < settings.latticeSize; i++) {
      for (let j = 0; j < settings.latticeSize; j++) {
        color(i, j);
      }
    }
    if (
      model == "/models/kawasaki-local" ||
      model == "/models/kawasaki-non-local"
    ) {
      // let nearestneighs = new Array<Array<number>>(settings.latticeSize);
      // nearestneighs.fill(new Array<number>(settings.latticeSize).fill(0))
      let nearestneighs = new Object()
      for (let m = 0; m < settings.latticeSize; m++) {
        for (let n = 0; n < settings.latticeSize; n++) {
          let pair = [];
          let indexNeighs = [];
          for (let zz = 0; zz < 4; zz++) {
            if (zz == 0) {
              //look up
              if (m == 0) {
                pair = [settings.latticeSize - 1, n];
                indexNeighs.push(pair);
              } else {
                pair = [m - 1, n];
                indexNeighs.push(pair);
              }
            }

            if (zz == 1) {
              //look down
              if (m == settings.latticeSize - 1) {
                pair = [0, n];
                indexNeighs.push(pair);
              } else {
                pair = [m + 1, n];
                indexNeighs.push(pair);
              }
            }

            if (zz == 2) {
              //look left
              if (n == 0) {
                pair = [m, settings.latticeSize - 1];
                indexNeighs.push(pair);
              } else {
                pair = [m, n - 1];
                indexNeighs.push(pair);
              }
            }

            if (zz == 3) {
              //look right
              if (n == settings.latticeSize - 1) {
                pair = [m, 0];
                indexNeighs.push(pair);
              } else {
                pair = [m, n + 1];
                indexNeighs.push(pair);
              }
            }
            nearestneighs[[m, n]] = indexNeighs; // Inherited from previous model, TODO: FIX
          }
        }
      }
      simulation.set({ ...simulation, nearestNeighs: nearestneighs })
    }
  } else if (model == "/models/blume-capel") {
    let local_spins = new Array(settings.latticeSize);
    for (let i = 0; i < settings.latticeSize; i++) {
      local_spins[i] = new Array(settings.latticeSize);
      for (let j = 0; j < settings.latticeSize; j++) {
        let randy = Math.random();
        if (randy <= settings.proportionSpin.positive!) {
          local_spins[i][j] = 1;
        } else if (
          randy >= settings.proportionSpin.positive! &&
          randy <=
          settings.proportionSpin.negative! +
          settings.proportionSpin.positive!
        ) {
          local_spins[i][j] = -1;
        } else {
          local_spins[i][j] = 0;
        }
      }
    }

    simulation.set({ spins: local_spins })

    for (let a = 0; a < settings.latticeSize; a++) {
      for (let b = 0; b < settings.latticeSize; b++) {
        if (local_spins[a][b] == 1) {
          context!.fillStyle = "#FE0105"; // purple
        }
        if (local_spins[a][b] == 0) {
          context!.fillStyle = "#000102"; // ehite
        }
        if (local_spins[a][b] == -1) {
          context!.fillStyle = "#FEE901"; //red
        }
        context!.fillRect(a * width, b * width, width, width);
      }
    }
  } else if (model == "/models/transverse-field-ising") {
    let wall = new Array(125);
    let t_spin = new Array(125);

    for (let i = 0; i < 125; i++) {
      let exp_dist = (theta: number) => {
        if (theta > 0.0) {
          return Math.abs(Math.log(1.0 - Math.random()) * theta);
        } else {
          return Number.MAX_VALUE;
        }
      };
      let make_wall = () => {
        let width;
        let theta = 0.1 / 1;
        let pos = exp_dist(theta);
        let tempWall = new Array();
        while (pos < 1.0) {
          width = exp_dist(theta);
          tempWall.push(pos);
          pos += width;
        }
        return tempWall;
      };
      let newWall = make_wall();
      if (newWall.length % 2 > 0) newWall.pop();
      newWall.push(1.0);
      wall[i] = newWall;

      t_spin[i] = Math.random() < 0.5 ? 1 : -1;
    }
    simulation.set({ wall })
    window.requestAnimationFrame(transverse);
  } else if (model == "/models/q-potts") {
    window.requestAnimationFrame(qpotts);
  } else if (model == "/models/wolff") {
    window.requestAnimationFrame(wolff);
  } else if (model == "/models/xy") {
    let s = new Array(settings.latticeSize);
    for (let i = 0; i < settings.latticeSize; i++) {
      s[i] = new Array(settings.latticeSize);
      for (let j = 0; j < settings.latticeSize; j++) {
        s[i][j] = Math.random() * 2 * Math.PI;
        let c = Math.random() * 360;
        context!.fillStyle = `hsl(${c}, 100%, 50%)`;
        context!.fillRect(i * width, j * width, width, width);
      }
    }

    simulation.set({ spins: s })
  }
};

export const alignSpins = (model: string) => {

  const settings = Store2.getState().settings
  const { spin } = Store2.getState().simulation
  const simulation = Store2.getState().simulation
  const { context, width } = Store2.getState().canvas

  if (
    model == "/models/metropolis" ||
    model == "/models/kawasaki-local" ||
    model == "/models/kawasaki-non-local" ||
    model == "/models/wolff"
  ) {
    let random = Math.random();
    let local_spins = new Array(settings.latticeSize);
    for (let i = 0; i < settings.latticeSize; i++) {
      local_spins[i] = new Array(settings.latticeSize);
      for (let j = 0; j < settings.latticeSize; j++) {
        if (random > 0.5) {
          local_spins[i][j] = 1;
        } else {
          local_spins[i][j] = -1;
        }
      }
    }

    simulation.set({ spins: local_spins })

    for (let i = 0; i < settings.latticeSize; i++) {
      for (let j = 0; j < settings.latticeSize; j++) {
        color(i, j);
      }
    }

    if (
      model == "/models/kawasaki-local" ||
      model == "/models/kawasaki-non-local"
    ) {
      let nearestneighs = new Object();
      for (let m = 0; m < settings.latticeSize; m++) {
        for (let n = 0; n < settings.latticeSize; n++) {
          let pair = [];
          let indexNeighs = [];
          for (let zz = 0; zz < 4; zz++) {
            if (zz == 0) {
              //look up
              if (m == 0) {
                pair = [settings.latticeSize - 1, n];
                indexNeighs.push(pair);
              } else {
                pair = [m - 1, n];
                indexNeighs.push(pair);
              }
            }

            if (zz == 1) {
              //look down
              if (m == settings.latticeSize - 1) {
                pair = [0, n];
                indexNeighs.push(pair);
              } else {
                pair = [m + 1, n];
                indexNeighs.push(pair);
              }
            }

            if (zz == 2) {
              //look left
              if (n == 0) {
                pair = [m, settings.latticeSize - 1];
                indexNeighs.push(pair);
              } else {
                pair = [m, n - 1];
                indexNeighs.push(pair);
              }
            }

            if (zz == 3) {
              //look right
              if (n == settings.latticeSize - 1) {
                pair = [m, 0];
                indexNeighs.push(pair);
              } else {
                pair = [m, n + 1];
                indexNeighs.push(pair);
              }
            }
            nearestneighs[[m, n]] = indexNeighs; // Inherited from previous model, TODO: FIX
          }
        }
      }
      simulation.set({ nearestNeighs: nearestneighs })
    }

    return local_spins;
  } else if (model == "/models/blume-capel") {
    let local_spins = new Array(settings.latticeSize);
    let randy = Math.random();
    for (let i = 0; i < settings.latticeSize; i++) {
      local_spins[i] = new Array(settings.latticeSize);
      for (let j = 0; j < settings.latticeSize; j++) {
        if (randy <= settings.proportionSpin.positive!) {
          local_spins[i][j] = 1;
        } else if (
          randy >= settings.proportionSpin.positive! &&
          randy <=
          settings.proportionSpin.negative! +
          settings.proportionSpin.positive!
        ) {
          local_spins[i][j] = -1;
        } else {
          local_spins[i][j] = 0;
        }
      }
    }

    simulation.set({ spins: local_spins })

    for (let a = 0; a < settings.latticeSize; a++) {
      for (let b = 0; b < settings.latticeSize; b++) {
        if (local_spins[a][b] == 1) {
          context!.fillStyle = "#FE0105"; // purple
        }
        if (local_spins[a][b] == 0) {
          context!.fillStyle = "#000102"; // ehite
        }
        if (local_spins[a][b] == -1) {
          context!.fillStyle = "#FEE901"; //red
        }
        context!.fillRect(a * width, b * width, width, width);
      }
    }

    return local_spins;
  } else if (model == "/models/q-potts") {
    let random = Math.random();
    spin.fill(random * settings.qpotts);
    for (let i = 0; i < settings.latticeSize; i++) {
      for (let j = 0; j < settings.latticeSize; j++) {
        const c = (360 / settings.qpotts) * random * settings.qpotts;
        color2(i, j, c);
      }
    }
    simulation.set({ spin })
    return spin;
  } else if (model == "/models/xy") {
    let random = Math.random();
    let c = random * 360;
    let local_spins = new Array(settings.latticeSize);
    for (let i = 0; i < settings.latticeSize; i++) {
      local_spins[i] = new Array(settings.latticeSize);
      for (let j = 0; j < settings.latticeSize; j++) {
        local_spins[i][j] = random * 2 * Math.PI;
      }
    }
    simulation.set({ spins: local_spins })
    for (let i = 0; i < settings.latticeSize; i++) {
      for (let j = 0; j < settings.latticeSize; j++) {
        color2(i, j, c);
      }
    }

    return local_spins;
  }
};

export const nanotube = (model: string) => {
  const settings = Store2.getState().settings
  const { context, width } = Store2.getState().canvas

  let { spin, localMagnetic, set } = Store2.getState().simulation

  let nSpin;
  settings.nanotubeSimulation.spin ? (nSpin = 1) : (nSpin = -100);

  const color = nSpin == 1 ? "purple" : "green";

  const spins = alignSpins(model);

  let leftIndex =
    Math.round(settings.latticeSize / 2) -
    1 -
    (Math.round(settings.nanotubeSimulation.diameter! / 2) +
      (settings.nanotubeSimulation.width! - 1));

  let rightIndex =
    leftIndex +
    (settings.nanotubeSimulation.width! - 1) +
    (settings.nanotubeSimulation.diameter! + 1);

  let topIndex =
    Math.round(settings.latticeSize / 2) -
    1 -
    (Math.round(settings.nanotubeSimulation.height! / 2) - 1);

  let bottomIndex = topIndex + settings.nanotubeSimulation.height!;

  for (
    let i = leftIndex;
    i < leftIndex + settings.nanotubeSimulation.width!;
    i++
  ) {
    for (let j = topIndex; j < bottomIndex; j++) {
      spins![i][j] *= -1;
      spin[i] *= -1;
      localMagnetic[i][j] = 100 * nSpin;
      context!.fillStyle = color;
      context!.fillRect(i * width, j * width, width, width);
    }
  }

  for (
    let i = rightIndex;
    i < rightIndex + settings.nanotubeSimulation.width!;
    i++
  ) {
    for (let j = topIndex; j < bottomIndex; j++) {
      spins![i][j] *= -1;
      spin[i] *= -1;
      localMagnetic[i][j] = 100 * nSpin;
      context!.fillStyle = color;
      context!.fillRect(i * width, j * width, width, width);
    }
  }

  set({ spins, localMagnetic })
};

export const setSpin = (i: number, j: number, page: string) => {
  const settings = Store2.getState().settings
  let { spins, set, localMagnetic } = Store2.getState().simulation

  if (settings.localMagneticField! == 0.0) {
    spins[i][j] *= -1
  } else {
    if (spins[i][j] == 1 && settings.localMagneticField! < -0.1) {
      spins[i][j] *= -1;
    } else if (spins[i][j] == -1 && settings.localMagneticField! > 0.1) {
      spins[i][j] *= 1;
    }
  }

  if (page == "/models/blume-capel") {
    const spin = Math.floor(Math.random() * 3);
    if (spin == 2) {
      spins[i][j] = -1;
    }

    spins[i][j] = spin;
    colorBEG(i, j, spins);
  } else {
    color(i, j);
  }

  localMagnetic[i][j] = settings.localMagneticField!;
  set({ localMagnetic })
};
