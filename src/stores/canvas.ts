import { canvas } from "../types/canvas";
import create from "zustand/vanilla";
import Settings from "./settings";

const settings = Settings.getState()

const Canvas = create<canvas>((set) => ({
    primaryColor: "white",
    secondaryColor: "#3772FF",
    width: 0,
    current: null,
    context: null,
    init: (newCanvas) => set({
        current: newCanvas,
        context: newCanvas.getContext("2d"),
        width: 600 / settings.latticeSize,
    }),
    set: (canvas: canvas) => set(canvas),
}));

export default Canvas;