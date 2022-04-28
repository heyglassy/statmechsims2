import Store2 from "../types/store2";

const freePlay = (timestamp: number) => {
    const { simulation, settings: { initialTemp, stepsPerFrame, tempStep, set }, graphs, dashboard } = Store2.getState();

    simulation.set({ temperature: initialTemp! });

    if (simulation.freePlay) {
        const sim = simulation.algo()
        const oldSpins = simulation.spins
        simulation.set({ ...sim })
        console.log("compare", simulation.spins === oldSpins)
        // console.log(sim.energy)

        // const { Ecurrent, Mcurrent } = simulation.calcStats()
        if (simulation.calcStats) {
            console.log("???")
            const { Ecurrent, Mcurrent } = simulation.calcStats()
            console.log(Mcurrent)

            graphs.update({ x: simulation.temperature, y: Mcurrent / stepsPerFrame! });
            // graphs.update({ x: simulation.temperature, y: sim.magnetism / stepsPerFrame! });
            // dashboard.set({
            //     energy: sim.energy / stepsPerFrame!,
            //     magnetization: sim.magnetism / stepsPerFrame!,
            //     temperature: simulation.temperature,
            // })
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
    }

    simulation.freePlay && window.requestAnimationFrame(freePlay)
}

export default freePlay;