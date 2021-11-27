import { useEffect, useRef } from "react";
import Store from "../types/store";
import { metropolisSetup } from "../models/setup";

const Canvas = () => {
  const canvas = useRef<HTMLCanvasElement>(null);
  let { initSpins, setContext } = Store((state) => state);

  useEffect(() => {
    let context = canvas.current?.getContext("2d", { alpha: false });
    if (context != null || context != undefined) {
      initSpins();
      setContext(canvas.current!);
      metropolisSetup();
    }
  }, []);

  return (
    <canvas
      className="w-600 h-600 bg-white ml-5 mt-5"
      width="600px"
      height="600px"
      ref={canvas}
    ></canvas>
  );
};

export default Canvas;
