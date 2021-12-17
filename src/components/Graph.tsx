import { useEffect } from "react";
import Store from "../types/store";
import Chart from "chart.js/auto";

const Graphs = () => {
  const { setGraph, graph } = Store();

  useEffect(() => {
    graph.destroy();
    let chart = new Chart("temp_vs_mag_graph", {
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
    });
    setGraph(chart);
  }, []);

  return (
    <div className="mx-3 mb-3 w-5/6">
      <h1 className="text-2xl text-white font-bold">Graphs</h1>
      <div className="bg-white my-1 w-full h-px"></div>
      <canvas id="temp_vs_mag_graph" className="m-3 bg-white"></canvas>
    </div>
  );
};

export default Graphs;
