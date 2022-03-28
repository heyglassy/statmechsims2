export interface graphs {
    current: Chart<"scatter", never[], unknown>;
    plotPoint: { x: number; y: number }; // x = temperature y = magnetization
    graphData: Array<plotPoint>;
}