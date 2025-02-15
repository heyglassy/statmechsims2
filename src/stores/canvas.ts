import { GetState, SetState } from "zustand";
import { canvas } from "../types/canvas";
import { Optional } from "../types/utils";

const Canvas = (set: SetState<any>, get: GetState<any>): canvas => ({
  primaryColor: "white",
  secondaryColor: "#3772FF",
  width: 0,
  current: null,
  context: null,
  init: (newCanvas) =>
    set({
      canvas: {
        ...get().canvas,
        current: newCanvas,
        context: newCanvas.getContext("2d"),
        width: 600 / get().settings.latticeSize,
      },
    }),
  set: (update: Optional<canvas>) =>
    set({
      canvas: {
        ...get().canvas,
        ...update,
      },
    }),
});

export default Canvas;
