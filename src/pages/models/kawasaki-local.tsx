import { ReactElement } from "react";
import Layout from "../../components/Layouts";
import Sidebar from "../../components/Sidebar";
import Canvas from "../../components/Canvas";
import DataSidebar from "../../components/DataSidebar";
import Graph from "../../components/Graph";

export default function KawasakiLocal() {
  return (
    <div className="w-screen bg-red-500 flex">
      <Sidebar />
      <Canvas />
      <div className="flex flex-col">
        <DataSidebar />
        <Graph />
      </div>
    </div>
  );
}

KawasakiLocal.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
