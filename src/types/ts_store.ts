import create from "zustand/vanilla";
import type { dashboard } from "./dashboard";
import type { graphData, plotPoint } from "./graphs";
import type { settings } from "./settings";
import type { state } from "./state";
import Chart from "chart.js/auto";

const defaultSettings: settings = {
  freePlay: false,
  initialTemp: 2.27,
  minTemp: 0,
  maxTemp: 5,
  qpotts: 5,
  tempStep: 0.01,
  fixedTemp: false,
  equilibriationDelay: 0,
  numberOfCycles: 5,
  latticeSize: 100,
  stepsPerFrame: 100000,
  couplingStrength: 0.1,
  magneticField: 0,
  localMagneticField: 0,
  magnetism: "Ferromagnetic",
  boundariesConditions: "Ferromagnetic",
  geometicPattern: "Ferromagnetic",
  nanotubeSimulation: {
    width: 0,
    height: 0,
    diameter: 0,
    spin: false,
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

const TSStore = create<state>((set) => ({
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
  setGraph: (newgraph: any) => {
    set((state: state) => {
      if (state.graph != null) {
        newgraph.update("active");
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
    set((state: state) => {
      state.graph.data.datasets.forEach((dataset: any) => {
        dataset.data.push(plotPoint);
      });
      state.graph.update();
      return { graphData: state.graphData.concat(plotPoint) };
    }),
  setSettings: (newSettings: settings) =>
    set(() => ({
      settings: { ...newSettings },
    })),
  resetSettings: () => set({ settings: defaultSettings }),
  setWall: (wall: Array<Array<number>>) => {
    set((state: state) => ({
      wall: wall,
    }));
  },
  initSpins: () =>
    set((state: state) => {
      let BfieldM = new Array(state.settings.latticeSize);
      for (let i = 0; i < state.settings.latticeSize; i++) {
        BfieldM[i] = new Array(state.settings.latticeSize);
        for (let j = 0; j < state.settings.latticeSize; j++) {
          BfieldM[i][j] = 0;
        }
      }

      let clusterChild = new Array<any>(
        state.settings.latticeSize * state.settings.latticeSize
      );
      let sBefore = new Array<any>(
        state.settings.latticeSize * state.settings.latticeSize
      );
      sBefore.fill(0);

      let spin = new Array<any>(
        state.settings.latticeSize * state.settings.latticeSize
      );

      for (
        let i = 0;
        i < state.settings.latticeSize * state.settings.latticeSize;
        i++
      ) {
        spin[i] = Math.random() < 0.5 ? 1 : -1;
      }

      let s = new Array<Array<number>>(state.settings.latticeSize);
      for (let i = 0; i < state.settings.latticeSize; i++) {
        s[i] = new Array<number>(state.settings.latticeSize);
        for (let j = 0; j < state.settings.latticeSize; j++) {
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
    set((state: state) => ({
      canvas: canvas,
      context: canvas.getContext("2d"),
      width: 600 / state.settings.latticeSize,
    })),
  resetDashboard: () => {
    set((state: state) => ({
      dashboard: {
        ...state.dashboard,
        steps: 0,
        averageEnergy: 0,
        sigmaEnergy: 0,
        averageMagnetization: 0,
        sigmaMagnetisation: 0,
      },
    }));
  },
  initDashboard: () =>
    set((state: state) => {
      return {
        endScreen: false,
        frames: [],
        dashboard: {
          ...defaultDashboard,
          cycles: {
            currentCycle: 1,
            totalCycles: state.settings.numberOfCycles!,
          },
          temperature: state.settings.initialTemp!,
          frames: {
            savedFrames: 0,
            totalFrames:
              (state.settings.maxTemp != 0
                ? (state.settings.maxTemp! - state.settings.initialTemp!) /
                  state.settings.tempStep!
                : 1) * state.settings.numberOfCycles!,
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
    set((state: state) => ({
      dashboard: {
        ...state.dashboard,
        steps: state.dashboard.steps + 1,
      },
    }));
  },

  incFrames: () => {
    set((state: state) => ({
      dashboard: {
        ...state.dashboard,
        frames: {
          ...state.dashboard.frames,
          savedFrames: state.dashboard.frames.savedFrames + 1,
        },
        temperature:
          Math.round(
            (state.dashboard.temperature + state.settings.tempStep!) * 10000
          ) / 10000,
      },
    }));
  },

  incCycles: () => {
    set((state: state) => ({
      dashboard: {
        ...state.dashboard,
        cycles: {
          ...state.dashboard.cycles,
          currentCycle: state.dashboard.cycles.currentCycle + 1,
        },
        temperature: 0,
      },
    }));
  },

  endSimulation: () => {
    set((state: state) => ({
      endScreen: true,
      settings: {
        ...state.settings,
        simulation: false,
      },
    }));
  },

  updatePayload: (frame: string) => {
    set((state: state) => {
      return {
        payloads: state.payloads.concat(state.dashboard),
        frames: state.frames.concat(frame),
      };
    });
  },
}));

export default TSStore;
