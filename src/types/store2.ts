import { canvas } from "./canvas"
import { dashboard } from "./dashboard"
import { graphs } from "./graphs"
import { settings } from "./settings"
import { simulation } from "./simulation"

export type MyState = {
    canvas: canvas,
    settings: settings,
    dashboard: dashboard,
    graphs: graphs,
    simulation: simulation
}

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
