import { useCallback, useEffect, useRef } from "react";
import { setSpin, setup } from "../helpers/setup";
import { useRouter } from "next/router";
import initSpins from "../helpers/initializers/spins";
import useStore from "../stores/hooks";

// TODO: Rename mouse events for consistency

const Canvas = () => {
  const { latticeSize } = useStore((state) => state.settings);
  const { init } = useStore((state) => state.canvas);
  const { asPath } = useRouter();

  const currentCanvas = useRef<HTMLCanvasElement>(null);
  const mousedown = useRef<Boolean>(false);

  const findCoords = useCallback(
    (event: MouseEvent) => {
      let x = 0;
      let y = 0;

      if (event.offsetX < 600 / latticeSize!) x = 0;
      else if (event.offsetX > 600) x = latticeSize - 1;
      else {
        x = (event.offsetX - 600 / latticeSize!) / (600 / latticeSize!);
      }

      if (event.offsetY < 600 / latticeSize) y = 0;
      else if (event.offsetY > 600) y = latticeSize - 1;
      else {
        y = (event.offsetY - 600 / latticeSize!) / (600 / latticeSize!);
      }

      return { x, y };
    },
    [latticeSize]
  );

  const coords = useCallback(
    (event: MouseEvent) => {
      mousedown.current = true;

      const { x, y } = findCoords(event);
      const i = Math.floor(x);
      const j = Math.floor(y);

      setSpin(i, j, asPath);
    },
    [asPath, findCoords, mousedown]
  );

  const mouseup = useCallback(() => {
    mousedown.current = false;
  }, [mousedown]);

  const mousemove = useCallback(
    (event: MouseEvent) => {
      if (mousedown) {
        const { x, y } = findCoords(event);
        const i = Math.floor(x);
        const j = Math.floor(y);

        setSpin(i, j, asPath);
      }
    },
    [asPath, findCoords, mousedown]
  );

  useEffect(() => {
    const context = currentCanvas.current!.getContext("2d", { alpha: false });

    if (context != null || context != undefined) {
      initSpins();
      init(currentCanvas.current!);
      setup(asPath);
    }
  }, [
    latticeSize,
    asPath,
    currentCanvas,
    init,
    coords,
    mouseup,
    mousemove,
    mousedown,
  ]);

  return (
    <canvas
      className=" w-600 h-600 bg-white ml-5 mt-5"
      width="600px"
      height="600px"
      ref={currentCanvas}
    ></canvas>
  );
};

export default Canvas;
