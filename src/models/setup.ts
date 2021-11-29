import TSStore from "../types/ts_store";
import create from "zustand";
import qpotts from "./q-potts";
import wolff from "./wolff";

const setup = (model: string) => {
  let { settings, context, spins, setWall, setNearestNeighs, setSpins } =
    create(TSStore).getState();
  let width = 600 / settings.latticeSize;

  if (
    model == "/models/metropolis" ||
    model == "/models/kawasaki-local" ||
    model == "/models/kawasaki-non-local"
  ) {
    for (let a = 0; a < settings.latticeSize; a++) {
      for (let j = 0; j < settings.latticeSize; j++) {
        if (spins[a][j] == 1) context!.fillStyle = "white";
        else context!.fillStyle = "black";
        context!.fillRect(a * width, j * width, width, width);
      }
    }
    if (
      model == "/models/kawasaki-local" ||
      model == "/models/kawasaki-non-local"
    ) {
      let nearestneighs = new Object();
      for (var m = 0; m < settings.latticeSize; m++) {
        for (var n = 0; n < settings.latticeSize; n++) {
          var pair = [];
          var indexNeighs = [];
          for (var zz = 0; zz < 4; zz++) {
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
      setNearestNeighs(nearestneighs);
    }
  } else if (model == "/models/blume-capel") {
    let local_spins = new Array(settings.latticeSize);
    for (let i = 0; i < settings.latticeSize; i++) {
      local_spins[i] = new Array(settings.latticeSize);
      for (var j = 0; j < settings.latticeSize; j++) {
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

    setSpins(local_spins);

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
    let color = ["#FFD700", "#00008B"];
    let w = 600 / 125;
    let y = 600;
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
    setWall(wall);
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
        var c = Math.random() * 360;
        context!.fillStyle = `hsl(${c}, 100%, 50%)`;
        context!.fillRect(i * width, j * width, width, width);
      }
    }
    setSpins(s);
  }
};

export default setup;
