import create from "zustand";
import TSStore from "../types/ts_store";

/**
 * This function colors the canvas for Metropolis and both Kawasaki models.
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

/**
 * This function colors the canvas for XY and Qpotts models.
 */

export const color2 = (i: number, j: number, c: number) => {
  const { context, width } = create(TSStore).getState();

  context!.fillStyle = `hsl(${c}, 100%, 50%)`;
  context!.fillRect(i * width, j * width, width, width);
};
