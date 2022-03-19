import create from "zustand";
import Store from "../store/store";
import { color } from "./color";

const boundarySetup = () => {
  const { settings, spins, localMagnetic, setLocalMagnetic } =
    create(Store).getState();

  if (
    settings.boundariesConditions == "Plus-Minus Boundaries (one direction)"
  ) {
    for (let i = 0; i < settings.latticeSize; i++) {
      spins[i][0] = 1;
      localMagnetic[i][0] = 100;
      color(i, 0);

      spins[i][settings.latticeSize - 1] = -1;
      localMagnetic[i][settings.latticeSize - 1] = -100;
      color(i, settings.latticeSize - 1);
    }
  } else if (settings.boundariesConditions == "Skewed Plus Minus Boundaries") {
    for (let j = 0; j < settings.latticeSize; j++) {
      spins[0][j] = 1;
      localMagnetic[0][j] = 100;
      color(0, j);

      spins[settings.latticeSize - 1][j] = -1;
      localMagnetic[settings.latticeSize - 1][j] = -100;
      color(settings.latticeSize - 1, j);
    }
    for (let i = 0; i < settings.latticeSize; i++) {
      spins[i][0] = 1;
      localMagnetic[i][0] = 100;
      color(i, 0);

      spins[i][settings.latticeSize - 1] = -1;
      localMagnetic[i][settings.latticeSize - 1] = -100;
      color(i, settings.latticeSize - 1);
    }
  } else if (
    settings.boundariesConditions == "Plus Boundaries (both directions)"
  ) {
    for (let j = 0; j < settings.latticeSize; j++) {
      spins[0][j] = 1;
      localMagnetic[0][j] = 100;
      color(0, j);

      spins[settings.latticeSize - 1][j] = 1;
      localMagnetic[settings.latticeSize - 1][j] = 100;
      color(settings.latticeSize - 1, j);
    }
    for (let i = 0; i < settings.latticeSize; i++) {
      spins[i][0] = 1;
      localMagnetic[i][0] = 100;
      color(i, 0);

      spins[i][settings.latticeSize - 1] = 1;
      localMagnetic[i][settings.latticeSize - 1] = 100;
      color(i, settings.latticeSize - 1);
    }
  } else if (
    settings.boundariesConditions == "Minus Boundaries (both directions)"
  ) {
    for (let j = 0; j < settings.latticeSize; j++) {
      spins[0][j] = -1;
      localMagnetic[0][j] = -100;
      color(0, j);

      spins[settings.latticeSize - 1][j] = -1;
      localMagnetic[settings.latticeSize - 1][j] = -100;
      color(settings.latticeSize - 1, j);
    }
    for (let i = 0; i < settings.latticeSize; i++) {
      spins[i][0] = -1;
      localMagnetic[i][0] = -100;
      color(i, 0);

      spins[i][settings.latticeSize - 1] = -1;
      localMagnetic[i][settings.latticeSize - 1] = -100;
      color(i, settings.latticeSize - 1);
    }
  }

  setLocalMagnetic(localMagnetic);
};

export default boundarySetup;
