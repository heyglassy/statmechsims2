import useStore, { useSettings } from "../stores/hooks";
import { runner } from "../helpers/runner";
import { useRouter } from "next/router";
import type { Dispatch, SetStateAction } from "react";
import { newChart } from "./Graph";
import produce from "immer";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const ConfirmScreen = ({ open, setOpen }: Props) => {
  // const { settings, setSettings, initDashboard, graph, setGraph } = useStore(
  //   (state) => state
  // );
  const settings = useSettings()
  const router = useRouter();

  const checkTemp = (): JSX.Element => {
    if (settings.tempStep! < 0 && settings.initialTemp! < settings.finalTemp!) {
      return (
        <h1 className="text-orange-500 mt-2 font-bold">
          When temperature step is less than 0, final temperature must be less
          than starting temperature
        </h1>
      );
    } else if (
      settings.tempStep! > 0 &&
      settings.initialTemp! > settings.finalTemp!
    ) {
      return (
        <h1 className="text-orange-500 mt-2 font-bold">
          When temperature step is greater than 0, final temperature must be
          greater than starting temperature
        </h1>
      );
    }
    return (
      <button
        className="bg-green-500 text-white rounded mt-4 w-32 h-8"
        onClick={() => {
          settings.set(produce(settings, (draft) => {
            draft.simulation = true;
          }))
          // setSettings({ ...settings, simulation: true });
          // if (!settings.simulation) {
          //   initDashboard();
          //   const chart = newChart(graph);
          //   setGraph(chart);
          // }
          // runner(router.asPath);
          setOpen(!open);
        }}
      >
        Confirm & Run
      </button>
    );
  };

  return (
    <div className="bg-gray-200 absolute inset-y-auto inset-x-1/3 h-full flex flex-col justify-evenly w-1/3 p-6 rounded-md drop-shadow-2xl">
      <h1 className="text-2xl font-bold">Confirm Simulation Settings</h1>
      <p>Initial Temperature: {settings.initialTemp}</p>
      <p>Final Temperature: {settings.finalTemp}</p>
      <p>Temperature Step: {settings.tempStep}</p>
      <p>Cycle {settings.numberOfCycles}</p>
      <p>Total Frames</p>
      <p>Equilibriation Delay: {settings.equilibriationDelay}</p>
      <p>Lattice Size {settings.latticeSize}</p>
      <p>Magnetic Field: {settings.magneticField}</p>
      <p>Local Magnetic Field {settings.localMagneticField}</p>
      <p>Magnetism: {settings.magnetism}</p>
      <p>Boundaries {settings.boundariesConditions}</p>
      <p>Pattern: {settings.geometicPattern}</p>
      <div className="flex flex-col items-start">
        {checkTemp()}
        <button
          className="bg-red-400 rounded mt-2 w-32 h-8 text-white"
          onClick={() => {
            setOpen(!open);
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ConfirmScreen;
