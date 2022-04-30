import Canvas from "./canvas";
import create from "zustand/vanilla"
import Dashboard from "./dashboard";
import Settings from "./settings";
import Graphs from "./graph";
import Simulation from "./simulation";
import { MyState } from "../types/store2";

const Store2 = create<MyState>((set, get) => ({
    canvas: Canvas(set, get),
    dashboard: Dashboard(set, get),
    settings: Settings(set, get),
    graphs: Graphs(set, get),
    simulation: Simulation(set, get),
}))

export default Store2
