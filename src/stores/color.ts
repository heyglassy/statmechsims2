import { color } from "../types/color";
import create from "zustand/vanilla";

const Color = create<color>(() => ({
    primaryColor: "white",
    secondaryColor: "#3772FF",
}));

export default Color;