import { useEffect, useRef } from "react";
import { useStore } from "../stores/hooks";
import { setSpin, setup } from "../helpers/setup";
import { useRouter } from "next/router";

const Canvas = () => {
  const router = useRouter();
  const canvas = useRef<HTMLCanvasElement>(null);
  let { initSpins, setContext, settings, setSettings } = useStore(
    (state) => state
  );

  let mousedown = false;

  const findCoords = (event: MouseEvent) => {
    let x = 0;
    let y = 0;

    if (event.offsetX < 600 / settings.latticeSize!) x = 0;
    else if (event.offsetX > 600) x = settings.latticeSize - 1;
    else {
      x =
        (event.offsetX - 600 / settings.latticeSize!) /
        (600 / settings.latticeSize!);
    }

    if (event.offsetY < 600 / settings.latticeSize) y = 0;
    else if (event.offsetY > 600) y = settings.latticeSize - 1;
    else {
      y =
        (event.offsetY - 600 / settings.latticeSize!) /
        (600 / settings.latticeSize!);
    }

    return { x, y };
  };

  const coords = (event: MouseEvent) => {
    mousedown = true;

    const { x, y } = findCoords(event);
    const i = Math.floor(x);
    const j = Math.floor(y);

    setSpin(i, j, router.asPath);
  };

  const mouseUp = (event: MouseEvent) => {
    mousedown = false;
  };

  const mousemove = (event: MouseEvent) => {
    if (mousedown) {
      const { x, y } = findCoords(event);
      const i = Math.floor(x);
      const j = Math.floor(y);

      setSpin(i, j, router.asPath);
    }
  };

  useEffect(() => {
    setSettings({ ...settings, freePlay: false });
    const context = canvas.current?.getContext("2d", { alpha: false });

    if (context != null || context != undefined) {
      initSpins();
      setContext(canvas.current!);
      setup(router.asPath);
      canvas.current!.onmousedown = coords;
      canvas.current!.onmouseup = mouseUp;
      canvas.current!.onmousemove = mousemove;
    }
  }, [settings.latticeSize, router.asPath]);

  return (
    <canvas
      className=" w-600 h-600 bg-white ml-5 mt-5"
      width="600px"
      height="600px"
      ref={canvas}
    ></canvas>
  );
};

export default Canvas;
