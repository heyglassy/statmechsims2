import create from "zustand/vanilla";
import type { dashboard } from "../types/dashboard";
import type { settings } from "../types/settings";
import type { store } from "../types/store";
import Chart from "chart.js/auto";
import { graphData, plotPoint } from "../types/graphs";

const defaultSettings: settings = {
  freePlay: false,
  freePlayIncrement: false,
  initialTemp: 2.27,
  finalTemp: 5,
  qpotts: 5,
  tempStep: 0.01,
  fixedTemp: false,
  equilibriationDelay: 0,
  numberOfCycles: 5,
  latticeSize: 100,
  stepsPerFrame: 10000,
  couplingStrength: 0.1,
  magneticField: 0,
  localMagneticField: 0,
  magnetism: "Ferromagnetic",
  boundariesConditions: "Ferromagnetic",
  geometicPattern: "Ferromagnetic",
  nanotubeSimulation: {
    width: 2,
    height: 50,
    diameter: 15,
    spin: true,
  },
  fixedSpin: false,
  proportionSpin: {
    positive: 0.33,
    negative: 0.33,
  },
  simulation: false,
};

const defaultDashboard: dashboard = {
  frames: {
    savedFrames: 0,
    totalFrames: 0,
  },
  cycles: {
    currentCycle: 0,
    totalCycles: 0,
  },
  steps: 0,
  temperature: 0,
  energy: 0,
  totalEnergy: 0,
  averageEnergy: 0,
  sigmaEnergy: 0,
  magnetization: 0,
  totalMagnetization: 0,
  averageMagnetization: 0,
  sigmaMagnetisation: 0,
};

const defaultGraphData: graphData = [
  { x: 1, y: 1 },
  { x: 2, y: 2 },
];

const Store = create<store>((set) => ({
  color: ["white", "#3772FF"],
  endScreen: false,
  spinBefore: [],
  spin: [],
  localMagnetic: [],
  clusteredChildren: [],
  settings: defaultSettings,
  payloads: [],
  nearestneighs: [],
  dashboard: defaultDashboard,
  canvas: null,
  frames: [],
  width: 0,
  graph: new Chart("temp_vs_mag_graph", {
    type: "scatter",
    data: {
      datasets: [
        {
          label: "Temperature vs Magnetization",
          data: [],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  }),
  graphData: defaultGraphData,
  spins: [],
  wall: [],
  context: null,
  setGraph: (newgraph: Chart) => {
    set((store: store) => {
      if (store.graph != null) {
        newgraph.update("normal");
      }
      return { graph: newgraph };
    });
  },
  setSpins: (spins: Array<Array<number>>) =>
    set({
      spins: spins,
    }),
  setNearestNeighs: (newneighs: Object) => set({ nearestneighs: newneighs }),
  updateGraph: (plotPoint: plotPoint) =>
    set((store: store) => {
      store.graph.data.datasets[0].data.push(plotPoint);
      store.graph.data.datasets[1].data.pop();
      store.graph.data.datasets[1].data.push(plotPoint);
      store.graph.update("none");
      return { graphData: store.graphData.concat(plotPoint) };
    }),
  setSettings: (newSettings: settings) =>
    set(() => ({
      settings: { ...newSettings },
    })),
  resetSettings: () => set({ settings: defaultSettings }),
  setWall: (wall: Array<Array<number>>) => {
    set(() => ({
      wall: wall,
    }));
  },
  initSpins: () =>
    set((store: store) => {
      let BfieldM = new Array(store.settings.latticeSize);
      for (let i = 0; i < store.settings.latticeSize; i++) {
        BfieldM[i] = new Array(store.settings.latticeSize);
        for (let j = 0; j < store.settings.latticeSize; j++) {
          BfieldM[i][j] = 0;
        }
      }

      let clusterChild = new Array<any>(
        store.settings.latticeSize * store.settings.latticeSize
      );
      let sBefore = new Array<any>(
        store.settings.latticeSize * store.settings.latticeSize
      );
      sBefore.fill(0);

      let spin = new Array<any>(
        store.settings.latticeSize * store.settings.latticeSize
      );

      for (
        let i = 0;
        i < store.settings.latticeSize * store.settings.latticeSize;
        i++
      ) {
        spin[i] = Math.random() < 0.5 ? 1 : -1;
      }

      let s = new Array<Array<number>>(store.settings.latticeSize);
      for (let i = 0; i < store.settings.latticeSize; i++) {
        s[i] = new Array<number>(store.settings.latticeSize);
        for (let j = 0; j < store.settings.latticeSize; j++) {
          if (Math.random() < 0.5) s[i][j] = 1;
          else s[i][j] = -1;
        }
      }
      return {
        localMagnetic: BfieldM,
        spins: s,
        spinBefore: sBefore,
        spin: spin,
        clusteredChildren: clusterChild,
      };
    }),
  setLocalMagnetic: (localMagnetic: Array<Array<number>>) =>
    set(() => ({
      localMagnetic: localMagnetic,
    })),
  setSpin: (spin: Array<number>) =>
    set(() => ({
      spin: spin,
    })),
  setContext: (canvas: HTMLCanvasElement) =>
    set((store: store) => ({
      canvas: canvas,
      context: canvas.getContext("2d"),
      width: 600 / store.settings.latticeSize,
    })),
  resetDashboard: () => {
    set((store: store) => ({
      dashboard: {
        ...store.dashboard,
        steps: 0,
        averageEnergy: 0,
        sigmaEnergy: 0,
        averageMagnetization: 0,
        sigmaMagnetisation: 0,
      },
    }));
  },
  initDashboard: () =>
    set((store: store) => {
      return {
        endScreen: false,
        frames: [],
        dashboard: {
          ...defaultDashboard,
          cycles: {
            currentCycle: 1,
            totalCycles: store.settings.numberOfCycles!,
          },
          temperature: store.settings.initialTemp!,
          frames: {
            savedFrames: 0,
            totalFrames:
              (store.settings.finalTemp != 0
                ? (store.settings.finalTemp! - store.settings.initialTemp!) /
                store.settings.tempStep!
                : 1) * store.settings.numberOfCycles!,
          },
        },
      };
    }),

  setDashboard: (newDashboard: dashboard) => {
    set({
      dashboard: newDashboard!,
    });
  },

  incSteps: () => {
    set((store: store) => ({
      dashboard: {
        ...store.dashboard,
        steps: store.dashboard.steps + 1,
      },
    }));
  },

  incFrames: () => {
    set((store: store) => ({
      dashboard: {
        ...store.dashboard,
        frames: {
          ...store.dashboard.frames,
          savedFrames: store.dashboard.frames.savedFrames + 1,
        },
        temperature:
          Math.round(
            (store.dashboard.temperature + store.settings.tempStep!) * 10000
          ) / 10000,
      },
    }));
  },

  incCycles: () => {
    set((store: store) => ({
      dashboard: {
        ...store.dashboard,
        cycles: {
          ...store.dashboard.cycles,
          currentCycle: store.dashboard.cycles.currentCycle + 1,
        },
        temperature: store.settings.initialTemp!,
      },
    }));
  },

  endSimulation: () => {
    set((store: store) => ({
      endScreen: true,
      settings: {
        ...store.settings,
        simulation: false,
      },
    }));
  },

  updatePayload: (frame: string) => {
    set((store: store) => {
      return {
        payloads: store.payloads.concat(store.dashboard),
        frames: store.frames.concat(frame),
      };
    });
  },
}));

export default Store;
