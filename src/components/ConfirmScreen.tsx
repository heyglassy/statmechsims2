import useStore from "../stores/hooks";
import type { Dispatch, SetStateAction } from "react";
import React from "react";
import { runner } from "../helpers/runner";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const ConfirmScreen: React.FC<Props> = ({ open, setOpen }: Props) => {
  const settings = useStore(state => state.settings);
  const simulation = useStore(state => state.simulation);
  const set = useStore(state => state.dashboard).set

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
          simulation.set({ ...simulation, running: true })
          const totalFrames = (settings.finalTemp! - settings.initialTemp!) / settings.tempStep!;
          set({
            cycles: { totalCycles: settings.numberOfCycles!, currentCycle: 1 },
            framesInfo: { totalFrames, savedFrames: 1 }
          })
          runner(Date.now())
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
