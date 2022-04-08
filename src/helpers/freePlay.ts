import produce from "immer";
import Settings from "../stores/settings";
import Simulation from "../stores/simulation";
import { Models } from "./models";

const freePlay = (timestamp: number) => {
    const simulation = Simulation.getState();
    const initialTemp = Settings.getState().initialTemp;
    const stepsPerFrame = Settings.getState().stepsPerFrame;
    const model = Models.find(model => model.url === simulation.currentUrl)!.algo;
    // simulation.set(produce(simulation, draft => {
    //     draft.temperature = settings.initialTemp!
    // }));
    // console.log("FreePlay", simulation.freePlay)
    simulation.set({ temperature: 5 });

    if (simulation.freePlay) {
        for (let a = 0; a < stepsPerFrame!; a++) {
            model(timestamp)
        }
    }

    simulation.freePlay && window.requestAnimationFrame(freePlay)
}

export default freePlay;