import { useEffect, useRef } from "react";
import Store from "../types/store";
import setup from "../models/setup";
import { useRouter } from "next/router";

const Canvas = () => {
  const canvas = useRef<HTMLCanvasElement>(null);
  let { initSpins, setContext, settings, setSettings } = Store(
    (state) => state
  );
  let router = useRouter();

  useEffect(() => {
    setSettings({ ...settings, freePlay: false });
    let context = canvas.current?.getContext("2d", { alpha: false });
    if (context != null || context != undefined) {
      initSpins();
      setContext(canvas.current!);
      setup(router.pathname);
    }
  }, [settings.latticeSize]);

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
