import create from "zustand/vanilla";
import type { dashboard } from "./dashboard";
import type { settings, State } from "./settings";

const defaultSettings: settings = {
  freePlay: false,
  initialTemp: 0,
  minTemp: 0,
  maxTemp: 0,
  tempStep: 0.01,
  fixedTemp: false,
  equilibriationDelay: 0,
  numberOfCycles: 5,
  latticeSize: 100,
  stepsPerFrame: 10,
  moleRatio: {
    up: 0.5,
    down: 0.5,
  },
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
    positive: 0,
    negative: 0,
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

const TSStore = create<State>((set) => ({
  settings: defaultSettings,
  dashboard: defaultDashboard,
  spins: [],
  context: undefined,
  setSettings: (newSettings: settings) =>
    set(() => ({
      settings: { ...newSettings },
    })),
  resetSettings: () => set({ settings: defaultSettings }),
  initSpins: () =>
    set((state: State) => {
      let s = new Array<Array<number>>(state.settings.latticeSize);
      for (let i = 0; i < state.settings.latticeSize; i++) {
        s[i] = new Array<number>(state.settings.latticeSize);
        for (let j = 0; j < state.settings.latticeSize; j++) {
          if (Math.random() < 0.5) s[i][j] = 1;
          else s[i][j] = -1;
        }
      }
      return { spins: s };
    }),
  setContext: (context: CanvasRenderingContext2D) =>
    set((state: State) => {
      state.context = context;
    }),
  resetDashboard: () => set({ dashboard: { ...defaultDashboard } }),
  initDashboard: () =>
    set((state: State) => {
      return {
        dashboard: {
          ...defaultDashboard,
          cycles: {
            ...defaultDashboard.cycles,
            totalCycles: state.settings.numberOfCycles!,
          },
          frames: {
            ...defaultDashboard.frames,
            totalFrames:
              ((state.settings.maxTemp! - state.settings.initialTemp!) /
                state.settings.tempStep!) *
              state.settings.numberOfCycles!,
          },
        },
      };
    }),
  setDashboard: (newDashboard: dashboard) => {
    set((state: State) => ({
      dashboard: { ...state.dashboard, ...newDashboard },
    }));
  },
  incSteps: () => {
    set((state: State) => ({
      dashboard: {
        ...state.dashboard,
        steps: state.dashboard.steps + 1,
      },
    }));
  },
  incCycles: () => {
    set((state: State) => ({
      dashboard: {
        ...state.dashboard,
        cycles: {
          ...state.dashboard.cycles,
          currentCycle: state.dashboard.cycles.currentCycle + 1,
        },
      },
    }));
  },
}));

export default TSStore;
