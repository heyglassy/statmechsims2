import Canvas from "../../components/Canvas"
import DataSidebar from "../../components/DataSidebar"
import Sidebar from "../../components/Sidebar"
import Graph from "../../components/Graph";

const Model = () => {
  return (
    <div className="w-screen flex">
      <Sidebar />
      <Canvas />
      <div className="flex flex-col">
        <DataSidebar />
        <Graph />
      </div>
    </div>
  )
}

export default Model