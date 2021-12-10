import create from "zustand";
import TSStore from "../types/ts_store";

/**
 * This function colors the canvas for Metropolis and both Kawasaki models.
 * @param {i}
 * @param {j}
 * @return {null}
 */

export const color = (i: number, j: number) => {
  const { context, width, spins, settings } = create(TSStore).getState();

  if (settings.magnetism == "biparite" && i % 2 == j % 2) {
    if (spins[i][j] == 1) context!.fillStyle = "white";
    else context!.fillStyle = "black";
  } else {
    if (spins[i][j] == 1) context!.fillStyle = "black";
    else context!.fillStyle = "white";
  }
  context!.fillRect(i * width, j * width, width, width);
};
