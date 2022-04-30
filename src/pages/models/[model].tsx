import Sidebar from "../../components/Sidebar"
import { useRouter } from "next/router";
import Canvas from "../../components/Canvas";
import { useEffect } from "react";
import useStore from "../../stores/hooks";
import DataSidebar from "../../components/DataSidebar";
import Graphs from "../../components/Graph";
import { Models } from "../../helpers/models";

const Model = () => {
  const router = useRouter();
  const { simulation: { set } } = useStore()

  //TODO SIMPLIFY
  useEffect(() => {
    if (router.query) {
      const modelInfo = Models.find((model) => model.url == router.asPath)!
      if (modelInfo) {
        set({ currentUrl: router.asPath, calcStats: modelInfo.calcStats, algo: modelInfo.algo })
      }
    }
  }, [set, router.query, router.asPath])

  return (
    <div className="w-screen flex">
      <Sidebar />
      <Canvas />
      <div className="flex flex-col">
        <DataSidebar />
        <Graphs />
      </div>
    </div>
  )
}

export default Model

  // if (router.query) {
  //   // simulation.set(produce(simulation, (draft) => {
  //   //   draft.currentUrl = router.asPath;
  //   // }))
  //   // simulation.set({ ...simulation, currentUrl: router.asPath })
  // }

      // simulation.set(produce(simulation, (draft) => {
      //   draft.currentUrl = router.asPath;
      // }))
      // set({ ...simulation, currentUrl: router.asPath })
