export type graph = Chart<"scatter", never[], unknown>;
export type plotPoint = { x: number; y: number }; // x = temperature y = magnetization
export type graphData = Array<plotPoint>;