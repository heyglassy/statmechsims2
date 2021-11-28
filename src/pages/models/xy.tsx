import { ReactElement } from "react";
import Layout from "../../components/Layouts";
import Sidebar from "../../components/Sidebar";
import Canvas from "../../components/Canvas";
import DataSidebar from "../../components/DataSidebar";
import Graph from "../../components/Graph";

export default function XY() {
  return (
    <div className="w-screen flex">
      <Sidebar />
      <Canvas />
      <div className="flex flex-col">
        <DataSidebar />
        <Graph />
      </div>
    </div>
  );
}

XY.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
