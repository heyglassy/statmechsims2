import { color2 } from "../helpers/store";
import Store from "../stores/store";

// This function is used to update the spin array in the simulation model. It
// takes a single index 'i' as an argument and updates the spin value at that
// index. It uses the 'temperature', 'magneticField', and 'latticeSize' values
// from the simulation settings to calculate the probability of a spin flipping
// to a particular state. It uses the 'spin' array from the simulation state to
// generate the spin state for the lattice. It uses the 'color2' function to
// update the color of the lattice.

const qpotts = () => {
  const { magneticField, latticeSize, qpotts } = Store.getState().settings;
  const { spin, temperature } = Store.getState().simulation;

  const model = () => {
    const N = latticeSize * latticeSize;

    const get_index = (x: number, y: number) => {
      x = (x + latticeSize) % latticeSize;
      y = (y + latticeSize) % latticeSize;
      return x + y * latticeSize;
    };

    const get_coordinate = (i: number) => {
      return [i % latticeSize, Math.floor(i / latticeSize)];
    };

    const tc = () => {
      return 1.0 / Math.log(Math.sqrt(qpotts) + 1.0);
    };

    const single_flip = (i: number, w: number, wh: number) => {
      let sum, x, p;
      let prob = new Float64Array(qpotts);
      const [a, b] = get_coordinate(i);

      prob.fill(1.0);
      prob[spin[get_index(a + 1, b)]] *= w;
      prob[spin[get_index(a, b + 1)]] *= w;
      prob[spin[get_index(a - 1, b)]] *= w;
      prob[spin[get_index(a, b - 1)]] *= w;
      prob[0] *= wh;

      sum = prob.reduce((a, b) => {
        return a + b;
      }, 0.0);
      x = Math.random() * sum;
      p = 0.0;

      for (let g = 0; g < qpotts; g++) {
        p += prob[g];
        if (x < p) {
          spin[i] = g;
          break;
        }
      }
    };

    const beta = 1.0 / (temperature * tc());
    const w = Math.exp(beta);
    const wh = Math.exp(beta * magneticField!);

    for (let j = 0; j < N; j++) {
      single_flip(j, w, wh);

      let [x, y] = get_coordinate(j);
      const c = (360 / qpotts) * spin[j];
      color2(x, y, c);
    }
  };

  model();
};

export default qpotts;
