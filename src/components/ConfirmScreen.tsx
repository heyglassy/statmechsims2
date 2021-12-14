import Store from "../types/store";
import runner from "../models/runner";
import { useRouter } from "next/router";
import { boolean } from "zod";
import type { Dispatch, SetStateAction } from "react";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const ConfirmScreen = ({ open, setOpen }: Props) => {
  const { settings, setSettings, initDashboard, graph } = Store(
    (state) => state
  );

  const router = useRouter();

  return (
    <div className="bg-white absolute inset-y-auto inset-x-1/3 h-3/5 w-1/3 p-12">
      <h1>Initial Temperature: {settings.initialTemp}</h1>
      <h1>Min Temperature: {settings.minTemp}</h1>
      <h1>Temperature Step: {settings.tempStep}</h1>
      <h1>Cycle {settings.numberOfCycles}</h1>
      <h1>Total Frames</h1>
      <h1>Equilibriation Delay: {settings.equilibriationDelay}</h1>
      <h1>Lattice Size {settings.latticeSize}</h1>
      <h1>
        Mole Ratio: {settings.moleRatio.up} up & {settings.moleRatio.down} down
      </h1>
      <h1>Magnetic Field: {settings.magneticField}</h1>
      <h1>Local Magnetic Field {settings.localMagneticField}</h1>
      <h1>Magnetism: {settings.magnetism}</h1>
      <h1>Boundaries {settings.boundariesConditions}</h1>
      <h1>Pattern: {settings.geometicPattern}</h1>
      <div className="flex flex-col items-start">
        {settings.initialTemp! > settings.maxTemp! ? (
          <h1 className="text-orange-500 mt-2 bold">
            Max temperature must be greater than min temperature.
          </h1>
        ) : (
          <button
            className="bg-green-500 rounded mt-2 w-32 h-8"
            onClick={() => {
              setSettings({ ...settings, simulation: !settings.simulation });
              if (!settings.simulation) {
                initDashboard();
                graph.clear();
              }
              runner(router.pathname);
              setOpen(!open);
            }}
          >
            Confirm & Run
          </button>
        )}
        <button
          className="bg-red-300 rounded mt-2 w-32 h-8"
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
