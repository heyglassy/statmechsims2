import { useRouter } from "next/router";
import Store from "../types/store";
import { trpc } from "../utils/trpc";

const EndSimulation = () => {
  const { dashboard, settings, payloads, frames, graph, initDashboard } = Store(
    (state) => state
  );
  const submitImage = trpc.useMutation(["imageupload"]);
  const submitData = trpc.useMutation(["dataupload"]);
  const router = useRouter();

  return (
    <div className="bg-gray-200 absolute inset-y-auto inset-x-1/3 h-3/5 w-1/3 p-6 rounded-md drop-shadow-2xl">
      <h1 className="text-2xl font-bold">Experiment Finished</h1>
      <h1>
        Frame {dashboard.frames.savedFrames} of {dashboard.frames.totalFrames}{" "}
        collected.
      </h1>
      <div className="flex flex-row justify-evenly mt-10">
        {frames.length > 0 ? (
          <button
            className="rounded bg-blue-500 text-white w-36 h-12"
            onClick={() => {
              const date = new Date().toISOString();
              submitData.mutate({
                pathname: router.pathname,
                settings: settings,
                data: payloads,
                date: date,
              });
              frames.forEach((image, index) => {
                submitImage.mutateAsync({
                  image: image,
                  pathname: router.pathname,
                  index: index,
                  date: date,
                });
              });
              graph.clear();
              initDashboard();
            }}
          >
            Save to Database
          </button>
        ) : null}
        <button
          className="rounded bg-gray-500 text-white w-36 h-12"
          onClick={() => {
            graph.clear();
            initDashboard();
          }}
        >
          Discard
        </button>
      </div>
    </div>
  );
};

export default EndSimulation;
