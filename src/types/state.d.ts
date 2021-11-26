import type { graph, graphs, plotPoint } from "./graphs";
import type { settings } from "./settings";

export = State;
export as namespace State;
declare namespace State {
  type state = {
    settings: settings;
    dashboard: dashboard;
    spins: Array<Array<number>>;
    context?: CanvasRenderingContext2D;
    graphData: graphData;
    graph: graph;
    setSettings: (newSettings: settings) => void;
    resetSettings: () => void;
    initSpins: () => void;
    setContext: (context: CanvasRenderingContext2D) => void;
    resetDashboard: () => void;
    initDashboard: () => void;
    setDashboard: (newDashboard: dashboard) => void;
    incSteps: () => void;
    incCycles: () => void;
    incFrames: () => void;
    endSimulation: () => void;
    updateGraph: (plotPoint: plotPoint) => void;
  };
}
