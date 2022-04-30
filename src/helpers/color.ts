import Store2 from "../stores/store2";

/**
 * This function colors the canvas for Metropolis and both Kawasaki models.
 */

export const color = (i: number, j: number) => {
  const { settings, simulation: { localMagnetic, spins }, canvas: { context, width, primaryColor, secondaryColor }
  } = Store2.getState()

  if (localMagnetic[i][j] > 0.0001 && localMagnetic[i][j] < 1000) {
    context!.fillStyle == "purple";
  } else if (localMagnetic[i][j] < -0.0001 && localMagnetic[i][j] > -1000) {
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
  const { canvas: { context, width } } = Store2.getState()

  context!.fillStyle = `hsl(${c}, 100%, 50%)`;
  context!.fillRect(i * width, j * width, width, width);
};
