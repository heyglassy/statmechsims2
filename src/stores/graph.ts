import { graphs } from "../types/graphs";
import Chart from "chart.js/auto";
import { MyState } from "../types/store2";
import { GetState, SetState } from "zustand";

const Graphs = ((set: SetState<MyState>, get: GetState<MyState>): graphs => ({
    current: new Chart("temp_vs_mag_graph", {
        type: "scatter",
        data: {
            datasets: [
                {
                    label: "Temperature vs Magnetization",
                    data: [],
                    borderWidth: 1,
                },
            ],
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        },
    }),
    graphData: [],
    plotPoint: { x: 1, y: 1 },
    set: (update) => set({ graphs: { ...get().graphs, ...update } }),
    update: (plotPoint) => set(({ graphs: graphs }) => {
        graphs.plotPoint = plotPoint;
        graphs.current.data.datasets[0].data.push(plotPoint);
        graphs.current.data.datasets[1].data.pop();
        graphs.current.data.datasets[1].data.push(plotPoint);
        graphs.current.update("none");
        graphs.graphData.concat(plotPoint);
    }),
}));

export default Graphs