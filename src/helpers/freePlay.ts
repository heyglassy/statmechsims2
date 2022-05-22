import Store from "../stores/store";

const freePlay = (timestamp: number) => {
  const { simulation, graphs, settings, dashboard } = Store.getState();

  simulation.set({ ...simulation.algo(), temperature: settings.initialTemp! });

  if (simulation.calcStats) {
    const { Ecurrent, Mcurrent } = simulation.calcStats();

    graphs.update({
      x: simulation.temperature,
      y: Mcurrent / settings.stepsPerFrame!,
    });
    dashboard.set({
      energy: Ecurrent / settings.stepsPerFrame!,
      magnetization: Mcurrent / settings.stepsPerFrame!,
      temperature: simulation.temperature,
    });
  }

  if (simulation.freePlayIncrememt) {
    let newTemp;
    if (simulation.temperature < 0 || simulation.temperature > 5) {
      newTemp = simulation.temperature < 0 ? 5 : 0;
    } else {
      newTemp = simulation.temperature + settings.tempStep!;
    }
    simulation.set({ temperature: newTemp });
    settings.set({ initialTemp: newTemp });
  }

  simulation.freePlay && window.requestAnimationFrame(freePlay);
};

export default freePlay;
