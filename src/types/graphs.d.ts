export type plotPoint = { x: number; y: number }; // x = temperature y = magnetization

export interface graphs {
    current: Chart<"scatter", never[], unknown>;
    plotPoint: plotPoint
    graphData: Array<plotPoint>;
    set: (update: Optional<graphs>) => void;
    update: (plotPoint: plotPoint) => void;
}