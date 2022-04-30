import Store2 from "../stores/store";

const freePlay = (timestamp: number) => {
    const { simulation, settings: { initialTemp, stepsPerFrame, tempStep, set }, graphs, dashboard } = Store2.getState();

    simulation.set({ ...simulation.algo(), temperature: initialTemp! })

    if (simulation.calcStats) {
        const { Ecurrent, Mcurrent } = simulation.calcStats()

        graphs.update({ x: simulation.temperature, y: Mcurrent / stepsPerFrame! });
        dashboard.set({
            energy: Ecurrent / stepsPerFrame!,
            magnetization: Mcurrent / stepsPerFrame!,
            temperature: simulation.temperature
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

    simulation.freePlay && window.requestAnimationFrame(freePlay)
}

export default freePlay;