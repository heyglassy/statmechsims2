import create from "zustand";
import Store from "./store";
import colorStore from "./colorStore";
import Settings from "./settings";

const useStore = create(Store);
const useColor = create(colorStore);
const useSettings = create(Settings);

export { useColor, useStore, useSettings };