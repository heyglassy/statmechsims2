export type graph = Chart<"scatter", never[], unknown>;
export type graphData = Array<plotPoint>;
export type plotPoint = { x: number; y: number }; // x = temperature y = magnetization