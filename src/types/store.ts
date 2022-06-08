import { canvas } from "./canvas";
import { dashboard } from "./dashboard";
import { graphs } from "./graphs";
import { settings } from "./settings";
import { simulation } from "./simulation";

export type MyState = {
  canvas: canvas;
  settings: settings;
  dashboard: dashboard;
  graphs: graphs;
  simulation: simulation;
};
