import Sidebar from "../../components/Sidebar"
import { useRouter } from "next/router";
import { useSimulation } from "../../stores/hooks";
import produce from "immer";
import Canvas from "../../components/Canvas";
import { useEffect } from "react";

const Model = () => {
  const router = useRouter();
  // const simulation = useSimulation();
  const { set } = useSimulation()

  if (router.query) {
    // simulation.set(produce(simulation, (draft) => {
    //   draft.currentUrl = router.asPath;
    // }))
    // simulation.set({ ...simulation, currentUrl: router.asPath })
  }

  useEffect(() => {
    if (router.query) {
      // simulation.set(produce(simulation, (draft) => {
      //   draft.currentUrl = router.asPath;
      // }))
      // simulation.set({ ...simulation, currentUrl: router.asPath })
      set({ currentUrl: router.asPath })
    }
  }, [set, router.query, router.asPath])

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