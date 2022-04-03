import Sidebar from "../../components/Sidebar"
import { useRouter } from "next/router";
import { useSimulation } from "../../stores/hooks";
import produce from "immer";
import Canvas from "../../components/Canvas";

const Model = () => {
  const router = useRouter();
  const simulation = useSimulation();

  if (router.query) {
    simulation.set(produce(simulation, (draft) => {
      draft.currentUrl = router.asPath;
    }))
  }

  return (
    <div className="w-screen flex">
      <Sidebar />
      <Canvas />
      <div className="flex flex-col">
        {/* <DataSidebar /> */}
        {/* <Graph /> */}
      </div>
    </div>
  )
}

export default Model