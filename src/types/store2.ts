import Canvas from "../stores/canvas";
import create from "zustand/vanilla"
import type { canvas } from "./canvas";
import { dashboard } from "./dashboard";
import { settings } from "./settings";
import Dashboard from "../stores/dashboard";
import Settings from "../stores/settings";
import Graphs from "../stores/graph";
import { simulation } from "./simulation";
import Simulation from "../stores/simulation";
import { graphs } from "./graphs";

export type MyState = {
    canvas: canvas,
    settings: settings,
    dashboard: dashboard,
    graphs: graphs,
    simulation: simulation
}

export type Optional<T> = { [K in keyof T]+?: T[K] };

const Store2 = create<MyState>((set, get) => ({
    canvas: Canvas(set, get),
    dashboard: Dashboard(set, get),
    settings: Settings(set, get),
    graphs: Graphs(set, get),
    simulation: Simulation(set, get),
}))

export default Store2

// export type MyState = canvas & settings & dashboard & graphs & simulation;

// export type MyState = {
//     typeof canvas,
//     typeof settings,

// }

// export type State = CreateState<[
//     typeof Canvas,
//     typeof Settings,
//     typeof Dashboard,
//     typeof Graphs,
//     typeof Simulation
// ]>;


// export type CreateState<T extends [...any]> = T extends [infer F, ...(infer R)]
//     ? F extends (...args: any) => object
//     ? CreateState<R> & ReturnType<F>
//     : unknown
//     : unknown

// const Store2 = create<State>((set, get) => ({
//     ...Canvas(set, get),
//     ...Settings(set, get),
//     ...Dashboard(set, get),
//     ...Graphs(set),
//     ...Simulation(set, get),
// }));
