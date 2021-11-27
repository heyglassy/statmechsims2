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
      className="w-650 h-650 bg-white ml-5 mt-5"
      width="500px"
      height="500px"
      ref={canvas}
    ></canvas>
  );
};

export default Canvas;
