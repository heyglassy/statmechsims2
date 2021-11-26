import { useEffect } from "react";
import Store from "../types/store";

const Graphs = () => {
  let { graphData } = Store();

  useEffect(() => {
    console.log(graphData);
  }, []);

  return (
    <div className="mx-3 mb-3">
      <h1 className="text-2xl font-bold">Graphs</h1>
      <div className="bg-black my-1 w-full h-px"></div>
      <canvas id="temp_vs_mag_graph" className="m-3 bg-white"></canvas>
    </div>
  );
};

export default Graphs;
