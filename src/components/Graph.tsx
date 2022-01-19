import { useEffect } from "react";
import Store from "../types/store";
import { Chart, ScriptableContext } from "chart.js";
import { plotPoint } from "../types/graphs";

const pointColor = (ctx: ScriptableContext<"line">) => {
  if (ctx.dataset.data.length > 0 && ctx.dataIndex!) {
    let point: plotPoint = ctx.dataset.data[ctx.dataIndex] as plotPoint;
    return point.y > 0 ? "#3772FF" : "black";
  }
};

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
            backgroundColor: pointColor,
          },
          {
            label: "Cursor",
            data: [],
            borderWidth: 3,
            backgroundColor: "white",
            pointRadius: 20,
            pointBorderColor: "green",
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
