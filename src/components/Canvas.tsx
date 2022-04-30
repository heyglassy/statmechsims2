import { useEffect, useRef } from "react";
import { setSpin, setup } from "../helpers/setup";
import { useRouter } from "next/router";
import initSpins from "../helpers/initializers/spins";
import useStore from "../stores/hooks";

const Canvas = () => {
  const router = useRouter();
  const newCanvas = useRef<HTMLCanvasElement>(null);
  const { settings, canvas } = useStore();

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

  const mouseUp = () => {
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
    const context = newCanvas.current!.getContext("2d", { alpha: false });

    if (context != null || context != undefined) {
      initSpins()
      canvas.init(newCanvas.current!)
      setup(router.asPath);

      newCanvas.current!.onmousedown = coords;
      newCanvas.current!.onmouseup = mouseUp;
      newCanvas.current!.onmousemove = mousemove;
    }
  }, [settings.latticeSize, router.asPath, newCanvas]);

  return (
    <canvas
      className=" w-600 h-600 bg-white ml-5 mt-5"
      width="600px"
      height="600px"
      ref={newCanvas}
    ></canvas>
  );
};

export default Canvas;
