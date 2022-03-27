import create from "zustand";
import { Store, colorStore } from "../stores/store";

/**
 * This function colors the canvas for Metropolis and both Kawasaki models.
 */

export const color = (i: number, j: number) => {
  const { context, width, spins, settings, localMagnetic } =
    create(Store).getState();

  const { primaryColor, secondaryColor } = create(colorStore).getState();

  if (localMagnetic[i][j] > 0.0001) {
    context!.fillStyle == "purple";
  } else if (localMagnetic[i][j] < -0.0001) {
    context!.fillStyle == "green";
  } else {
    if (settings.magnetism == "Biparite" && i % 2 == j % 2) {
      if (spins[i][j] == 1) context!.fillStyle = primaryColor;
      else context!.fillStyle = secondaryColor;
    } else {
      if (spins[i][j] == 1) context!.fillStyle = secondaryColor;
      else context!.fillStyle = primaryColor;
    }
  }
  context!.fillRect(i * width, j * width, width, width);
};

/**
 * This function colors the canvas for XY and Qpotts models.
 */

export const color2 = (i: number, j: number, c: number) => {
  const { context, width } = create(Store).getState();

  context!.fillStyle = `hsl(${c}, 100%, 50%)`;
  context!.fillRect(i * width, j * width, width, width);
};
