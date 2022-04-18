import Store2 from "../types/store2";

const freePlay = (timestamp: number) => {
    const { simulation, settings: { initialTemp, stepsPerFrame }, graphs, dashboard } = Store2.getState();

    simulation.set({ temperature: initialTemp! });

    if (simulation.freePlay) {
        // const { spins, temperature, localMagnetic } = simulation.algo()
        // simulation.set({ spins, temperature, localMagnetic });
        simulation.set({ ...simulation.algo() })

        // const { Ecurrent, Mcurrent } = simulation.calcStats()
        if (simulation.calcStats) {
            const { Ecurrent, Mcurrent } = simulation.calcStats()
            console.log(`Ecurrent: ${Ecurrent}, Mcurrent: ${Mcurrent}`);

            graphs.update({ x: simulation.temperature, y: Mcurrent / stepsPerFrame! });
            dashboard.set({
                energy: Ecurrent / stepsPerFrame!,
                magnetization: Mcurrent / stepsPerFrame!,
                temperature: simulation.temperature,
            })
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