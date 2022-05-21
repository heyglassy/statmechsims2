import { graphs } from "../types/graphs";
import { GetState, SetState } from "zustand";
import { MyState } from "../types/store";
import { Optional } from "../types/utils";

const Graphs = (set: SetState<MyState>, get: GetState<MyState>): graphs => ({
  graphData: [],
  plotPoint: { x: 1, y: 1 },
  set: (update: Optional<graphs>) =>
    set({ graphs: { ...get().graphs, ...update } }),
  update: (plotPoint) =>
    set(({ graphs: graphs }) => {
      graphs.plotPoint = plotPoint;
      graphs.current?.data.datasets[0].data.push(plotPoint);
      graphs.current?.data.datasets[1].data.pop();
      graphs.current?.data.datasets[1].data.push(plotPoint);
      graphs.current?.update("none");
      graphs.graphData.concat(plotPoint);
    }),
});

export default Graphs;
