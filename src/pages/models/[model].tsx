import Sidebar from "../../components/Sidebar"
import { useRouter } from "next/router";
import produce from "immer";
import Canvas from "../../components/Canvas";
import { useEffect } from "react";
import useStore from "../../stores/hooks";
import { simulation } from "../../types/simulation";

const Model = () => {
  const router = useRouter();
  // const simulation = useSimulation();
  const { simulation: { set } } = useStore()

  // const state = useStore()
  // console.log(state)

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
      // set({ ...simulation, currentUrl: router.asPath })
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