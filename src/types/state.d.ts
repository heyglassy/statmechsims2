import { dashboard } from "./dashboard";
import type { graph, graphs, plotPoint } from "./graphs";
import type { payload } from "./payload";
import type { settings } from "./settings";

export = State;
export as namespace State;
declare namespace State {
  type state = {
    spinBefore: Array<any>;
    clusteredChildren: Array<any>;
    localMagnetic: Array<Array<number>>;
    spin: Array<any>;
    settings: settings;
    dashboard: dashboard;
    nearestneighs: Object;
    spins: Array<Array<number>>;
    wall: Array<Array<number>>;
    context: CanvasRenderingContext2D | null;
    canvas: HTMLCanvasElement | null;
    graphData: graphData;
    graph: graph;
    frames: Array<string>;
    width: number;
    payloads: Array<dashboard>;
    setLocalMagnetic: (localMagnetic: Array<Array<number>>) => void;
    setGraph: (graph: any) => void;
    setNearestNeighs: (newneighs: Object) => void;
    setSettings: (newSettings: settings) => void;
    resetSettings: () => void;
    initSpins: () => void;
    setSpins: (spins: Array<Array<number>>) => void;
    setWall: (wall: wall) => void;
    setContext: (canvs: HTMLCanvasElement) => void;
    resetDashboard: () => void;
    initDashboard: () => void;
    setDashboard: (newDashboard: dashboard) => void;
    incSteps: () => void;
    incCycles: () => void;
    incFrames: () => void;
    endSimulation: () => void;
    updateGraph: (plotPoint: plotPoint) => void;
    updatePayload: (frame: string) => void;
  };
}
