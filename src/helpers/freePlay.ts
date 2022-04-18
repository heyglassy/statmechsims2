import Settings from "../stores/settings";
import Store2 from "../types/store2";

const freePlay = (timestamp: number) => {
    const { simulation, settings: { initialTemp, stepsPerFrame, tempStep, set }, graphs, dashboard } = Store2.getState();

    simulation.set({ temperature: initialTemp! });

    if (simulation.freePlay) {
        // const { spins, temperature, localMagnetic } = simulation.algo()
        // simulation.set({ spins, temperature, localMagnetic });
        simulation.set({ ...simulation.algo() })

        // const { Ecurrent, Mcurrent } = simulation.calcStats()
        if (simulation.calcStats) {
            const { Ecurrent, Mcurrent } = simulation.calcStats()

            graphs.update({ x: simulation.temperature, y: Mcurrent / stepsPerFrame! });
            dashboard.set({
                energy: Ecurrent / stepsPerFrame!,
                magnetization: Mcurrent / stepsPerFrame!,
                temperature: simulation.temperature,
            })
        }
        if (simulation.freePlayIncrememt) {
            let newTemp;
            if (simulation.temperature < 0 || simulation.temperature > 5) {
                newTemp = simulation.temperature < 0 ? 5 : 0;
            } else {
                newTemp = simulation.temperature + tempStep!;
            }
            simulation.set({ temperature: newTemp });
            set({ initialTemp: newTemp })
        }
    }

    simulation.freePlay && window.requestAnimationFrame(freePlay)
}

export default freePlay;

    // const simulation = Simulation.getState();
    // const initialTemp = Settings.getState().initialTemp;
    // const stepsPerFrame = Settings.getState().stepsPerFrame;

    // const model = Models.find(model => model.url === simulation.currentUrl)!.algo;
    // simulation.set(produce(simulation, draft => {
    //     draft.temperature = settings.initialTemp!
    // }));
    // console.log("FreePlay", simulation.freePlay)