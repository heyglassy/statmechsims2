import Sidebar from "../../components/Sidebar";
import { useRouter } from "next/router";
import Canvas from "../../components/Canvas";
import { useEffect } from "react";
import useStore from "../../stores/hooks";
import DataSidebar from "../../components/DataSidebar";
import Graphs from "../../components/Graph";
import { Models } from "../../helpers/models";

const Model = () => {
  const router = useRouter();
  const { set } = useStore((state) => state.simulation);

  useEffect(() => {
    const modelInfo = Models.find((model) => model.url == router.asPath)!;
    modelInfo &&
      set({
        currentUrl: router.asPath,
        calcStats: modelInfo.calcStats,
        algo: modelInfo.algo,
      });
  }, [set, router.query, router.asPath]);

  return (
    <div className="w-screen flex">
      <Sidebar />
      <Canvas />
      <div className="flex flex-col">
        <DataSidebar />
        <Graphs />
      </div>
    </div>
  );
};

export default Model;
