export = Graphs;
export as namespace Graphs;
declare namespace Graphs {
  type graph = Chart<"scatter", never[], unknown>;
  type graphData = Array<plotPoint>;
  type plotPoint = { x: number; y: number }; // x = temperature y = magnetization
}
