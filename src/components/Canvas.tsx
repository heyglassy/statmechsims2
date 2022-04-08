import { useEffect, useRef } from "react";
import { useCanvas, useSettings, useSimulation } from "../stores/hooks";
import { setSpin, setup } from "../helpers/setup";
import { useRouter } from "next/router";
import produce from "immer";
import initSpins from "../helpers/initializers/spins";

const Canvas = () => {
  const router = useRouter();
  const newCanvas = useRef<HTMLCanvasElement>(null);
  const settings = useSettings()
  const simulation = useSimulation()
  const canvas = useCanvas()

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
    // simulation.set(produce(simulation, (draft) => {
    //   draft.freePlay = false;
    // }))
    simulation.set({ freePlay: false })
    const context = newCanvas.current?.getContext("2d", { alpha: false });

    if (context != null || context != undefined) {
      // initSpins();
      // setContext(newCanvas.current!);
      // setup(router.asPath);

      initSpins()
      canvas.init(newCanvas.current!)
      setup(router.asPath);

      newCanvas.current!.onmousedown = coords;
      newCanvas.current!.onmouseup = mouseUp;
      newCanvas.current!.onmousemove = mousemove;
      // canvas.current!.onmousedown = coords;
      // canvas.current!.onmouseup = mouseUp;
      // canvas.current!.onmousemove = mousemove;

    }
  }, [settings.latticeSize, router.asPath]);

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
