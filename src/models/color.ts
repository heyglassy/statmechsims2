import create from "zustand";
import TSStore from "../types/ts_store";

/**
 * This function colors the canvas for Metropolis and both Kawasaki models.
 */

export const color = (i: number, j: number) => {
  const { context, width, spins, settings, color, localMagnetic } =
    create(TSStore).getState();

  if (localMagnetic[i][j] > 0.0001) {
    context!.fillStyle == "red";
  } else if (localMagnetic[i][j] < -0.0001) {
    context!.fillStyle == "yellow";
  } else {
    if (settings.magnetism == "biparite" && i % 2 == j % 2) {
      if (spins[i][j] == 1) context!.fillStyle = color[1];
      else context!.fillStyle = color[0];
    } else {
      if (spins[i][j] == 1) context!.fillStyle = color[0];
      else context!.fillStyle = color[1];
    }
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
