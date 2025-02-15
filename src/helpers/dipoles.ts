import Store from "../stores/store";

export const getLeft = (i: number, j: number) => {
  const { spins } = Store.getState().simulation;
  const settings = Store.getState().settings;

  if (j == 0) {
    if (
      settings.boundariesConditions ==
        "Anti-periodic Boundaries (both directions)" ||
      settings.boundariesConditions ==
        "Anti-periodic Boundaries (one directions)"
    )
      return -spins[i][settings.latticeSize - 1];
    if (settings.boundariesConditions == "Isolated Boundaries") return 0;
    else return spins[i][settings.latticeSize - 1];
  } else {
    return spins[i][j - 1];
  }
};

export const getRight = (i: number, j: number) => {
  const { spins } = Store.getState().simulation;
  const settings = Store.getState().settings;

  if (j == settings.latticeSize - 1) {
    if (
      settings.boundariesConditions ==
        "Anti-periodic Boundaries (both directions)" ||
      settings.boundariesConditions ==
        "Anti-periodic Boundaries (one directions)"
    )
      return -spins[i][0];
    if (settings.boundariesConditions == "Isolated Boundaries") return 0;
    else return spins[i][0];
  } else {
    return spins[i][j + 1];
  }
};

export const getTop = (i: number, j: number) => {
  const { spins } = Store.getState().simulation;
  const settings = Store.getState().settings;

  if (i == 0) {
    if (
      settings.boundariesConditions ==
      "Anti-periodic Boundaries (both directions)"
    )
      return -spins[settings.latticeSize - 1][j];
    if (
      settings.boundariesConditions ==
      "Anti-periodic Boundaries (one directions)"
    )
      return spins[settings.latticeSize - 1][j];
    if (settings.boundariesConditions == "Isolated Boundaries") return 0;
    else return spins[settings.latticeSize - 1][j];
  } else {
    return spins[i - 1][j];
  }
};

export const getBottom = (i: number, j: number) => {
  const { spins } = Store.getState().simulation;
  const settings = Store.getState().settings;

  if (i == settings.latticeSize - 1) {
    if (
      settings.boundariesConditions ==
      "Anti-periodic Boundaries (both directions)"
    )
      return -spins[0][j];
    if (
      settings.boundariesConditions ==
      "Anti-periodic Boundaries (one directions)"
    )
      return spins[0][j];
    if (settings.boundariesConditions == "Isolated Boundaries") return 0;
    else return spins[0][j];
  } else {
    return spins[i + 1][j];
  }
};
