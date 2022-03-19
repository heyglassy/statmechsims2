import useStore from "../state/useStore";
import { runner } from "../models/runner";
import { useRouter } from "next/router";
import type { Dispatch, SetStateAction } from "react";
import { newChart } from "./Graph";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const ConfirmScreen = ({ open, setOpen }: Props) => {
  const { settings, setSettings, initDashboard, graph, setGraph } = useStore(
    (state) => state
  );
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
          setSettings({ ...settings, simulation: true });
          if (!settings.simulation) {
            initDashboard();
            const chart = newChart(graph);
            setGraph(chart);
          }
          runner(router.pathname);
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
      <h1>Initial Temperature: {settings.initialTemp}</h1>
      <h1>Final Temperature: {settings.finalTemp}</h1>
      <h1>Temperature Step: {settings.tempStep}</h1>
      <h1>Cycle {settings.numberOfCycles}</h1>
      <h1>Total Frames</h1>
      <h1>Equilibriation Delay: {settings.equilibriationDelay}</h1>
      <h1>Lattice Size {settings.latticeSize}</h1>
      <h1>Magnetic Field: {settings.magneticField}</h1>
      <h1>Local Magnetic Field {settings.localMagneticField}</h1>
      <h1>Magnetism: {settings.magnetism}</h1>
      <h1>Boundaries {settings.boundariesConditions}</h1>
      <h1>Pattern: {settings.geometicPattern}</h1>
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
