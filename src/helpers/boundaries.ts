import Store2 from "../stores/store";
import { color } from "./store";

const boundarySetup = () => {
  const settings = Store2.getState().settings
  let { localMagnetic, spins, set } = Store2.getState().simulation

  if (
    settings.boundariesConditions == "Plus-Minus Boundaries (one direction)"
  ) {
    for (let i = 0; i < settings.latticeSize; i++) {
      spins[i][0] = 1;
      localMagnetic[i][0] = 1000;

      spins[i][settings.latticeSize - 1] = -1;
      localMagnetic[i][settings.latticeSize - 1] = -1000;
    }
  } else if (settings.boundariesConditions == "Skewed Plus Minus Boundaries") {
    for (let j = 0; j < settings.latticeSize; j++) {
      spins[0][j] = 1;
      localMagnetic[0][j] = 100;

      spins[settings.latticeSize - 1][j] = -1;
      localMagnetic[settings.latticeSize - 1][j] = -1000;
    }
    for (let i = 0; i < settings.latticeSize; i++) {
      spins[i][0] = 1;
      localMagnetic[i][0] = 1000;

      spins[i][settings.latticeSize - 1] = -1;
      localMagnetic[i][settings.latticeSize - 1] = -1000;
    }
  } else if (
    settings.boundariesConditions == "Plus Boundaries (both directions)"
  ) {
    for (let j = 0; j < settings.latticeSize; j++) {
      spins[0][j] = 1;
      localMagnetic[0][j] = 1000;

      spins[settings.latticeSize - 1][j] = 1;
      localMagnetic[settings.latticeSize - 1][j] = 1000;
    }
    for (let i = 0; i < settings.latticeSize; i++) {
      spins[i][0] = 1;
      localMagnetic[i][0] = 1000;

      spins[i][settings.latticeSize - 1] = 1;
      localMagnetic[i][settings.latticeSize - 1] = 1000;
    }
  } else if (
    settings.boundariesConditions == "Minus Boundaries (both directions)"
  ) {
    for (let j = 0; j < settings.latticeSize; j++) {
      spins[0][j] = -1;
      localMagnetic[0][j] = -1000;

      spins[settings.latticeSize - 1][j] = -1;
      localMagnetic[settings.latticeSize - 1][j] = -1000;
    }
    for (let i = 0; i < settings.latticeSize; i++) {
      spins[i][0] = -1;
      localMagnetic[i][0] = -1000;

      spins[i][settings.latticeSize - 1] = -1;
      localMagnetic[i][settings.latticeSize - 1] = -1000;
    }
  }

  set({ localMagnetic, spins })

  for (let i = 0; i < settings.latticeSize; i++) {
    for (let j = 0; j < settings.latticeSize; j++) {
      color(i, j)
    }
  }
};

export default boundarySetup;
