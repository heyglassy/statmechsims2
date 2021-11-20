import { line } from "d3-shape";
import { useEffect, useRef } from "react";

const TestArray: Array<[number, number]> = [
  [1, 1],
  [2, 2],
  [3, 3],
  [4, 4],
  [5, 5],
  [6, 6],
  [7, 7],
  [8, 8],
  [9, 9],
];

const Graphs = () => {
  let graphCanvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (graphCanvas.current != null) {
      let context = graphCanvas.current.getContext("2d");
      let graphline = line();
      graphline.x();

      graphline.context(context);
      context?.beginPath();

      graphline(TestArray);

      context?.fill();
      context?.stroke();
    }
  }, []);

  return (
    <div className="mx-3 mb-3">
      <h1 className="text-2xl font-bold">Graphs</h1>
      <div className="bg-black my-1 w-full h-px"></div>
      <canvas ref={graphCanvas} className="m-3 w-4/5 h-80 bg-white"></canvas>
    </div>
  );
};

export default Graphs;
