export interface simulation {
    localMagnetic: Array<Array<number>>;
    spin: Array<any>;
    spins: Array<Array<number>>;
    spinBefore: Array<any>;
    nearestNeighs: Object;
    clusteredChildren: Array<any>;
    wall: Array<Array<number>>;
    running: boolean,
    freePlay: boolean,
    freePlayIncrememt: boolean,
    frames: Array<string>;
    set: (simulation: simulation) => void;
}
