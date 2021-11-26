import metropolis from "./metropolis";
import TSStore from "../types/ts_store";
import create from "zustand";

const runner = () => {
  const { settings } = create(TSStore).getState();
  if (settings.simulation && !settings.freePlay) {
    window.requestAnimationFrame(metropolis);
  } else if (settings.freePlay && !settings.simulation) {
    window.requestAnimationFrame(metropolis);
  }
};

export default runner;
