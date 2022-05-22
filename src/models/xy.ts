import { color2 } from "../helpers/store";
import Store from "../stores/store";

const wrap = "none"; // TODO: Add TOR and PRO XY model features

const mod = (a: number, b: number) => {
  let notMod = a % b;
  if (notMod < 0) notMod += b;
  return notMod;
};

const rad2deg = (angrad: number) => {
  let angdeg = ((angrad / (2 * Math.PI)) * 360) % 360;
  if (angdeg < 0) angrad += 360;
  return Math.floor(angdeg);
};

const proind = (arr: Array<Array<number>>, i: number, j: number) => {
  let ni = i;
  let nj = j;
  if (!(0 <= ni && ni < arr.length)) {
    ni = mod(ni, arr.length);
    nj = arr[0].length - 1 - nj;
  }
  if (!(0 <= nj && nj < arr[0].length)) {
    nj = mod(nj, arr[0].length);
    ni = arr.length - 1 - ni;
  }
  return arr[ni][nj];
};

const torind = (arr: Array<Array<number>>, i: number, j: number) => {
  return arr[mod(i, arr.length)][mod(j, arr[0].length)];
};

const xy = () => {
  const { magneticField, latticeSize, couplingStrength } =
    Store.getState().settings;
  const { temperature } = Store.getState().simulation;

  let { spins } = Store.getState().simulation;

  //TODO: Fix initial state

  // const { settings, spins, setSpins, dashboard } = create(Store).getState();
  let newphases = new Array(latticeSize);
  for (let i = 0; i < latticeSize; i++) {
    newphases[i] = new Array(latticeSize);
    for (let j = 0; j < latticeSize; j++) {
      let f = 0;

      switch (wrap) {
        case "none":
          f += i > 0 ? Math.sin(spins[i][j] - spins[i - 1][j]) : 0;
          f +=
            i < latticeSize - 1 ? Math.sin(spins[i][j] - spins[i + 1][j]) : 0;
          f += j > 0 ? Math.sin(spins[i][j] - spins[i][j - 1]) : 0;
          f +=
            j < latticeSize - 1 ? Math.sin(spins[i][j] - spins[i][j + 1]) : 0;
          break;
        case "tor":
          f += Math.sin(newphases[i][j] - torind(newphases, i - 1, j));
          f += Math.sin(newphases[i][j] - torind(newphases, i + 1, j));
          f += Math.sin(newphases[i][j] - torind(newphases, i, j - 1));
          f += Math.sin(newphases[i][j] - torind(newphases, i, j + 1));
          break;
        case "pro":
          f += Math.sin(newphases[i][j] - proind(newphases, i - 1, j));
          f += Math.sin(newphases[i][j] - proind(newphases, i + 1, j));
          f += Math.sin(newphases[i][j] - proind(newphases, i, j - 1));
          f += Math.sin(newphases[i][j] - proind(newphases, i, j + 1));
          break;
      }

      f *= couplingStrength;
      f += temperature * (2 * Math.random() - 1);
      f += magneticField! * Math.sin(spins[i][j]);

      newphases[i][j] = spins[i][j] - f;
      const c = rad2deg(newphases[i][j]);
      color2(i, j, c);
    }
  }
  // setSpins(newphases);

  return { spins: newphases };
};

export default xy;
