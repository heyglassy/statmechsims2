import { useRouter } from "next/router";
import React, { Dispatch, SetStateAction } from "react";
import useStore from "../stores/hooks";
import { trpc } from "../utils/trpc";

interface Props {
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const EndSimulation: React.FC<Props> = ({ setOpen }) => {
  const router = useRouter();
  const dashboard = useStore().dashboard;
  const simulation = useStore().simulation;
  const settings = useStore().settings;

  const submitImage = trpc.useMutation(["imageupload"]);
  const submitData = trpc.useMutation(["dataupload"]);

  return (
    <div className="bg-gray-200 absolute inset-y-auto inset-x-1/3 h-3/5 w-1/3 p-6 rounded-md drop-shadow-2xl">
      <h1 className="text-2xl font-bold">Experiment Finished</h1>
      <h1>
        Frame {dashboard.framesInfo.savedFrames} of{" "}
        {dashboard.framesInfo.totalFrames} collected.
      </h1>
      <div className="flex flex-row justify-evenly mt-10">
        {simulation.frames.length > 0 ? (
          <button
            className="rounded bg-blue-500 text-white w-36 h-12"
            onClick={() => {
              const date = new Date().toISOString();
              submitData.mutate({
                pathname: router.pathname,
                settings: settings,
                data: simulation.payloads,
                date: date,
              });

              simulation.frames.forEach((image, index) => {
                submitImage.mutateAsync({
                  image: image,
                  pathname: router.pathname,
                  index: index,
                  date: date,
                });
              });
              // graph.clear();
              // initDashboard();
              setOpen(false);
              simulation.set({ running: false });
            }}
          >
            Save to Database
          </button>
        ) : null}
        <button
          className="rounded bg-gray-500 text-white w-36 h-12"
          onClick={() => {
            setOpen(false);
          }}
        >
          Discard
        </button>
      </div>
    </div>
  );
};

export default EndSimulation;
