import { useEffect, useRef } from "react";

const Canvas = () => {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    let context = canvas.current?.getContext("2d");
  }, []);

  return (
    <canvas className="w-675 h-675 bg-white ml-5 mt-5" ref={canvas}></canvas>
  );
};

export default Canvas;
