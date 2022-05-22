import { Optional } from "./utils";

export interface canvas {
  primaryColor: string;
  secondaryColor: string;
  width: number;
  current: HTMLCanvasElement | null;
  context: CanvasRenderingContext2D | null;
  set: (update: Optional<canvas>) => void;
  init: (newCanvas: HTMLCanvasElement) => void;
}
