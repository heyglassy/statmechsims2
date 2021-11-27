import TSStore from "../types/ts_store";
import create from "zustand";

const metropolisSetup = () => {
  let { settings, context, spins } = create(TSStore).getState();
  let width = 600 / settings.latticeSize;
  for (let a = 0; a < settings.latticeSize; a++) {
    for (let j = 0; j < settings.latticeSize; j++) {
      if (spins[a][j] == 1) context!.fillStyle = "yellow";
      else context!.fillStyle = "blue";
      context!.fillRect(a * width, j * width, width, width);
    }
  }
};

export { metropolisSetup };
