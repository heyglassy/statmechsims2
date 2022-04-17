import { graphs } from "../types/graphs";
import Chart from "chart.js/auto";
import { MyState } from "../types/store2";
import { SetState } from "zustand";

const Graphs = ((set: SetState<MyState>): graphs => ({
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
    graphData: [
        { x: 1, y: 1 },
        { x: 2, y: 2 },
    ],
    plotPoint: { x: 1, y: 1 },
}));

export default Graphs