import { useEffect } from "react";
import {
  Chart,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  ScatterController,
  ScriptableContext,
  Title,
} from "chart.js";
import useStore from "../stores/hooks";
import { plotPoint } from "../types/graphs";

// jX jY
// Fix Blume Capel, Wolff
// xy axis (1 -1, 0, 5)

export const newChart = () => {
  const pointColor = (ctx: ScriptableContext<"line">) => {
    if (ctx.dataset.data.length > 0 && ctx.dataIndex!) {
      let point: plotPoint = ctx.dataset.data[ctx.dataIndex] as plotPoint;
      return point.y > 0 ? "#3772FF" : "black";
    }
  };

  Chart.register(
    LineController,
    LineElement,
    LinearScale,
    Title,
    ScatterController,
    PointElement
  );

  const chart = new Chart("temp_vs_mag_graph", {
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
        x: {
          beginAtZero: true,
          min: 0,
          max: 5,
        },
        y: {
          beginAtZero: true,
          min: -1,
          max: 1,
        },
      },
    },
  });

  return chart;
};

const Graphs = () => {
  const { set, destroy } = useStore((store) => store.graphs);

  useEffect(() => {
    destroy();
    const chart = newChart();
    set({ current: chart });
  });

  return (
    <div className="mx-3 mb-3 w-5/6">
      <div>
        <div className="flex flex-row">
          <h1 className="text-2xl text-white font-bold">Graphs</h1>
          {/* <select>
            <option>Magnetization</option>
            <option>Magnetic susceptibility</option>
          </select> */}
        </div>
      </div>
      <div className="bg-white my-1 w-full h-px"></div>
      <canvas id="temp_vs_mag_graph" className="m-3 bg-white"></canvas>
    </div>
  );
};

export default Graphs;
